import { z } from "zod";
import axios from "axios";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../model/user.model.js";
import { ProfileModel } from "../model/Profile/profile.model.js";
import { oauth2Client } from "../utils/GoogleConfig.js";
import { GoogleModel } from "../model/GoogleLogin.model.js";
import { SendMailTemplate } from "../utils/EmailHandler.js";
import mongoose from "mongoose";

const GenerateToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
function generateMemberID() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let randomID = "#";

  for (let i = 0; i < 3; i++) {
    const randomCharIndex = Math.floor(Math.random() * characters.length);
    const randomNumIndex = Math.floor(Math.random() * numbers.length);
    randomID += characters[randomCharIndex] + numbers[randomNumIndex];
  }

  return randomID;
}

const emailSchema = z.string().email("Invalid email");

const UserSchemaValidation = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10).max(12).optional(),
  DOB: z.string().min(2).optional(),
  password: z.string().min(6).max(16),
  gender: z.enum(["male", "female"]).optional(),
});

const registeredUser = async (req, res) => {
  const userData = req.body;
  const validateData = UserSchemaValidation.safeParse(userData);

  if (!validateData.success) {
    return res.status(400).json({ errors: validateData.error.issues });
  }

  let MemberID;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Loop to ensure unique MemberID
    do {
      MemberID = generateMemberID();
      const existUser = await UserModel.findOne({
        $or: [
          { MemberID },
          { email: validateData.data.email },
          { phone: validateData.data.phone },
        ],
      }).session(session);

      if (!existUser) break; // Break if no existing user is found
    } while (existUser && existUser.MemberID === MemberID);

    const user = new UserModel(validateData.data);
    const profileData = new ProfileModel({ UserID: user._id });

    // Set references and save profile and user
    user.ProfileID = profileData._id;
    user.MemberID = MemberID;
    await profileData.save({ session });
    const savedUser = await user.save({ session });

    // Prepare response data without password
    const data = savedUser.toObject();
    delete data.password;

    const token = GenerateToken(data._id, data.email);

    // OTP generation and email setup
    const { OTP, min, expire } = generateOTP();
    EmailToOTP[validateData.data.email] = { OTP, expire };

    const item = {
      email: validateData.data.email,
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
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const existUser = await UserModel.findOne({ email });
  if (!existUser) {
    return res.status(400).json({ message: "User Not Found" });
  }
  if (!existUser.active) {
    return res
      .status(400)
      .json({ message: "Please verify your account first" });
  }

  const checkPassword = await existUser.comparePassword(password);
  if (!checkPassword) {
    return res.status(400).json({ message: "Password does not match" });
  }

  if (!existUser.active) {
    return res
      .status(400)
      .json({ message: "Please verify your account first" });
  }

  const token = GenerateToken(existUser._id, email);
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

  return res.status(StatusCodes.OK).json({
    message: "Login Succesfull",
    ...user,
    token,
  });
};

const GoogleLogin = async (req, res) => {
  try {
    const { credentials } = req.query;

    const googleToken = await oauth2Client.getToken(credentials);
    oauth2Client.setCredentials(googleToken.tokens);

    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${googleToken.tokens.access_token}`
    );
    const user = await GoogleModel.findOne({
      email: googleResponse.data.email,
    });

    if (user) {
      const token = GenerateToken(user._id, user.email);
      const data = user.toObject();
      delete data.password;
      return res.status(200).json({
        message: "Login successfull",
        ...data,
        token,
      });
    }
    const newUser = new GoogleModel({ email: googleResponse.data.email });

    const ProfileData = await ProfileModel.create({
      firstName: googleResponse.data.given_name,
      lastName: googleResponse.data.family_name,
      profileImage: googleResponse.data.picture,
    });

    if (!ProfileData)
      return res.status(500).json({ message: "Failed to Login" });

    newUser.ProfileID = ProfileData._id;
    await newUser.save();
    const savedUser = newUser.toObject();
    delete savedUser.password;
    const token = GenerateToken(savedUser._id, savedUser.email);

    if (!savedUser)
      return res.status(500).json({ message: "Failed to register user" });

    return res
      .status(200)
      .json({ message: "Signup Successfully", ...savedUser, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in Google login" });
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
    console.log(error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

let EmailToOTP = {};

const generateOTP = () => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const min = 5;
  const expire = Date.now() + 1000 * 60 * min;
  return { OTP, min, expire };
};

const SendOTP = async (req, res) => {
  const data = emailSchema.safeParse(req.body.email);
  const email = data.data;
  if (!data.success) return res.status(400).json({ message: "Invaild Email" });

  const user = await UserModel.findOne({ email: data.data });

  if (!user) return res.status(400).json({ message: "User do not exist" });

  const { OTP, min, expire } = generateOTP();
  EmailToOTP[email] = { OTP, expire };

  const item = { email, Sub: "Reset password", text: OTP };
  const template = {
    url: "SendEmailOTP.ejs",
    title: `Password Reset Request`,
    userName: `${user.firstName} ${user.lastName}`,
    OTP,
    min,
  };

  await SendMailTemplate(item, template);

  return res.status(200).json({
    message: "OTP Sent",
  });
};

const VerifyCode = async (req, res) => {
  const { code } = req.params;
  const data = emailSchema.safeParse(req.body.email);
  const email = data.data;
  if (!data.success) return res.status(400).json({ message: "Invaild Email" });

  if (EmailToOTP[email].OTP != code || EmailToOTP[email].expire < Date.now()) {
    return res
      .status(400)
      .json({ message: "Incorrect Verification code or code is expire" });
  }
  const user = await UserModel.findOne({ email });
  user.active = true;
  await user.save();
  return res.status(200).json({ message: "User verified successfully" });
};

const newPassword = async (req, res) => {
  const data = emailSchema.safeParse(req.body.email);
  const email = data.data;
  if (!data.success) return res.status(400).json({ message: "Invaild Email" });

  const newPassword = req.body.newPassword;

  if (newPassword.length < 6) {
    return res.status(400).json({
      message:
        "Your password must be at least 6 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Please try again.",
    });
  }
  try {
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid User" });

    user.password = newPassword;
    await user.save();

    delete EmailToOTP[email];
    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to reset password" });
  }
};

export {
  registeredUser,
  loginUser,
  GoogleLogin,
  SendOTP,
  ChangePassword,
  VerifyCode,
  newPassword,
};
