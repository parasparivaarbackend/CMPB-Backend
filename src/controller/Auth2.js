"use strict";
import { z } from "zod";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../model/user.model.js";
import { ProfileModel } from "../model/Profile/profile.model.js";
import { SendMailTemplate } from "../utils/EmailHandler.js";
import { SendMobileOTP } from "../helper/SendMobileOTP.js";
import getAuthenticator from "../helper/getAuthenticator.js";

const GenerateToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
function generateMemberID() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let randomID = "";
  for (let i = 0; i < 3; i++) {
    const randomCharIndex = Math.floor(Math.random() * characters.length);
    const randomNumIndex = Math.floor(Math.random() * numbers.length);
    randomID += characters[randomCharIndex] + numbers[randomNumIndex];
  }

  return randomID;
}
const generateOTP = () => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const min = 5;
  const expire = Date.now() + 1000 * 60 * min;
  return { OTP, min, expire };
};

const UserSchemaValidation = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  password: z.string().min(6).max(16),
});

let EmailToOTP = {};

const registeredUser = async (req, res) => {
  let Authenticator = getAuthenticator(req.body);
  const validateData = UserSchemaValidation.safeParse(req.body);

  if (Authenticator === null)
    return res.status(400).json({ message: "Invaild Credentails" });

  const identifier = req.body.identifier;

  if (!validateData.success)
    return res.status(400).json({ errors: validateData.error.issues });

  let existUser;

  existUser = await UserModel.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (existUser && Authenticator !== null) {
    const checkPassword = await existUser.comparePassword(
      validateData?.data?.password ?? ""
    );

    if (!checkPassword)
      return res.status(400).json({ message: "Wrong Credentails" });

    if (!existUser.isEmailVerified && !existUser.isPhoneVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your account first" });
    }
    const token = GenerateToken(existUser._id, identifier);
    const user = existUser.toObject();
    delete user.password;

    res
      .cookie("token", token, {
        httpOnly: false,
        secure: false,
        path: "/",
      })
      .cookie("role", user.role, {
        httpOnly: false,
        secure: false,
        path: "/",
      });

    return res.status(200).json({
      message: "Login Succesfull",
      ...user,
      token,
    });
  }

  let MemberID;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    do {
      MemberID = generateMemberID();
      existUser = await UserModel.findOne({
        MemberID,
      }).session(session);

      if (!existUser) break;
    } while (existUser && existUser.MemberID === MemberID);

    const user = new UserModel(validateData.data);
    const profileData = new ProfileModel({ UserID: user._id });

    // Set references and save profile and user
    user.ProfileID = profileData._id;
    user.MemberID = MemberID;
    if (Authenticator === "email") user.email = identifier;
    if (Authenticator === "phone") user.phone = identifier;

    user.RegisterPackage = {
      PremiumMember: false,
    };

    await profileData.save({ session });
    const savedUser = await user.save({ session });

    const data = savedUser.toObject();
    delete data.password;

    const { OTP, min, expire } = generateOTP();

    if (Authenticator === "email") {
      EmailToOTP[identifier] = { OTP, expire };
      const item = {
        email: identifier,
        Sub: "Verify Account",
        text: OTP,
      };
      const template = {
        url: "SendEmailOTP.ejs",
        title: `Verify Your Account`,
        userName: `${user.firstName} ${user.lastName}`,
        OTP,
        min,
      };

      await SendMailTemplate(item, template);
    }
    if (Authenticator === "phone") {
      EmailToOTP[identifier] = { OTP, expire };
      await SendMobileOTP(identifier, OTP);
    }

    await session.commitTransaction();

    return res.status(200).json({
      message: "User registered successfully",
      ...data,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted due to an error:", error);
    return res.status(500).json({
      message: "User registration failed due to a server error.",
    });
  } finally {
    session.endSession();
  }
};

const loginUser = async (req, res) => {
  const data = req.body;
  let Authenticator = getAuthenticator(req.body);
  if (Authenticator === null)
    return res.status(400).json({ message: "Invaild Credentails" });

  const identifier = req.body.identifier;

  let existUser;
  existUser = await UserModel.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (!existUser) {
    return res.status(400).json({ message: "User Not Found" });
  }
  if (
    (Authenticator === "email" && !existUser.isEmailVerified) ||
    (Authenticator === "phone" && !existUser.isPhoneVerified)
  ) {
    return res
      .status(200)
      .json({ message: "Please verify your account first" });
  }

  const checkPassword = await existUser.comparePassword(data?.password ?? "");

  if (!checkPassword)
    return res.status(400).json({ message: "Wrong Credentails" });

  const token = GenerateToken(existUser._id, identifier);
  const user = existUser.toObject();
  delete user.password;

  res
    .cookie("token", token, {
      httpOnly: false,
      secure: false,
      path: "/",
    })
    .cookie("role", user.role, {
      httpOnly: false,
      secure: false,
      path: "/",
    });

  return res.status(200).json({
    message: "Login Succesfull",
    ...user,
    token,
  });
};

const SendOTP = async (req, res) => {
  let Authenticator = getAuthenticator(req.body);
  if (Authenticator === null)
    return res.status(400).json({ message: "Invaild Credentails" });

  const identifier = req.body.identifier;

  try {
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(400).json({ message: "User do not exist" });

    const { OTP, min, expire } = generateOTP();

    EmailToOTP[identifier] = { OTP, expire };

    if (Authenticator === "email") {
      const item = {
        email: identifier,
        Sub:
          req._parsedUrl.pathname === "/signup"
            ? "Verify Account"
            : "Reset password",
        text: OTP,
      };
      const template = {
        url: "SendEmailOTP.ejs",
        title:
          req._parsedUrl.pathname === "/signup"
            ? "Verify Account"
            : "Password Reset Request",
        userName: `${user.firstName} ${user.lastName}`,
        OTP,
        min,
      };

      await SendMailTemplate(item, template);
    }
    if (Authenticator === "phone") {
      SendMobileOTP(identifier, OTP);
    }

    return res.status(200).json({
      message: "OTP Sent",
    });
  } catch (error) {
    console.error(error);
  }
};

const VerifyCode = async (req, res) => {
  const { code } = req.params;
  let Authenticator = getAuthenticator(req.body);
  if (Authenticator === null)
    return res.status(400).json({ message: "Invaild Credentails" });

  const identifier = req.body.identifier;

  try {
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(400).json({ message: "User do not exist" });

    if (
      EmailToOTP[identifier].OTP != code ||
      EmailToOTP[identifier].expire < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Incorrect Verification code or code is expire" });
    }

    if (Authenticator === "email") {
      user.isEmailVerified = true;
    }
    if (Authenticator === "phone") {
      user.isPhoneVerified = true;
    }
    await user.save();
    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error(error);
  }
};

const newPassword = async (req, res) => {
  let Authenticator = getAuthenticator(req.body);
  if (Authenticator === null)
    return res.status(400).json({ message: "Invaild Credentails" });

  const identifier = req.body.identifier;

  const newPassword = req.body.newPassword;

  if (newPassword.length < 6) {
    return res.status(400).json({
      message:
        "Your password must be at least 6 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Please try again.",
    });
  }
  try {
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(400).json({ message: "Invalid User" });

    user.password = newPassword;
    await user.save();

    delete EmailToOTP[identifier];
    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Failed to reset password" });
  }
};
const ChangePassword = async (req, res) => {
  const { oldPassword, password } = req.body;

  if (oldPassword.trim() === password.trim()) {
    return res.status(400).json({
      message:
        "The new password cannot be the same as the old password. Please choose a different one.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message:
        "Your password must be at least 6 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Please try again.",
    });
  }
  try {
    const user = await UserModel.findById(req.user._id);
    const result = await user.comparePassword(oldPassword);

    if (!result) {
      return res.status(400).json({
        messages: "Old Password is Wrong",
      });
    }
    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

export {
  registeredUser,
  loginUser,
  SendOTP,
  ChangePassword,
  VerifyCode,
  newPassword,
};
