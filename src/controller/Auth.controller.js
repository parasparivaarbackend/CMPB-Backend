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

const CheckUser = async (req, res) => {
  let Authenticator = getAuthenticator(req.body);
  if (Authenticator === null)
    return res.status(400).json({ message: "Invaild Credentails" });

  const identifier = req.body.identifier;

  try {
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (user) {
      const { OTP, min, expire } = generateOTP();
      console.log("Authenticator is", Authenticator);

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
        const abc = await SendMobileOTP(identifier, OTP);
        console.log("abc", abc);
      }
      return res.status(200).json({ success: true, message: "user Found" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "user Not Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const registeredUser = async (req, res) => {
  const Authenticator = getAuthenticator(req.body);
  const { success, data, error } = UserSchemaValidation.safeParse(req.body);

  if (!Authenticator) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  if (!success) {
    return res.status(400).json({ errors: error.issues });
  }

  const identifier = req.body.identifier;
  const searchField = Authenticator === "email" ? "email" : "phone";
  const searchQuery = { [searchField]: identifier || null };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Generate a unique MemberID and check for conflicts
    let MemberID;
    let existUser;
    do {
      MemberID = generateMemberID();
      existUser = await UserModel.findOne({
        $or: [{ MemberID }, searchQuery],
      }).session(session);
    } while (existUser && existUser.MemberID === MemberID);

    if (existUser) {
      return res.status(400).json({
        message: `${searchField === "email" ? "Email" : "Phone"} already exists`,
      });
    }

    // Prepare user and profile models
    const user = new UserModel({
      ...data,
      [searchField]: identifier,
      [searchField === "email" ? "phone" : "email"]: null, // Set the opposite field to null
      ProfileID: undefined,
      MemberID,
      RegisterPackage: { PremiumMember: false },
    });

    const profileData = new ProfileModel({ UserID: user._id });

    user.ProfileID = profileData._id;

    // Save profile and user within the transaction
    await profileData.save({ session });
    await user.save({ session });

    // Generate and send OTP
    const { OTP, min, expire } = generateOTP();
    EmailToOTP[identifier] = { OTP, expire };

    if (searchField === "email") {
      await SendMailTemplate(
        {
          email: identifier,
          Sub: "Verify Account",
          text: OTP,
        },
        {
          url: "SendEmailOTP.ejs",
          title: "Verify Your Account",
          userName: `${user.firstName} ${user.lastName}`,
          OTP,
          min,
        }
      );
    } else if (searchField === "phone") {
      await SendMobileOTP(identifier, OTP);
    }

    await session.commitTransaction();

    return res.status(200).json({ message: "User registered successfully" });
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
      .status(302)
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
const VerifyCodeAndLogin = async (req, res) => {
  const { code } = req.params;
  let Authenticator = getAuthenticator(req.body);
  if (Authenticator === null)
    return res.status(400).json({ message: "Invaild Credentails" });

  const identifier = req.body.identifier;

  try {
    const existUser = await UserModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!existUser)
      return res.status(400).json({ message: "User do not exist" });

    if (
      EmailToOTP[identifier].OTP != code ||
      EmailToOTP[identifier].expire < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Incorrect Verification code or code is expire" });
    }

    if (Authenticator === "email") {
      existUser.isEmailVerified = true;
    }
    if (Authenticator === "phone") {
      existUser.isPhoneVerified = true;
    }
    await existUser.save();
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
    return res
      .status(200)
      .json({ message: "User verified successfully", ...user, token });
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
  VerifyCodeAndLogin,
  CheckUser,
};
