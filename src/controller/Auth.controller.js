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
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  const existUser = await UserModel.findOne({
    $or: [
      { email: validateData.data.email },
      { phone: validateData.data.phone },
    ],
  });
  if (existUser) {
    return res.status(400).json({
      message: "User already Exist",
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = new UserModel(validateData.data);
    const profileData = new ProfileModel({ UserID: user._id });
    user.ProfileID = profileData._id;
    await profileData.save();
    const savedUser = await user.save();
    const data = savedUser.toObject();
    delete data.password;

    const token = GenerateToken(data._id, data.email);

    // await SendMailTemplate()

    res
      .cookie("token", token, {
        httpOnly: false,
        secure: false,
        path: "/",
      })
      .cookie("role", data.role, {
        httpOnly: false,
        secure: false,
        path: "/",
      });

    return res.status(200).json({
      message: "User registered successfull",
      ...data,
      token,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted due to an error:", error);
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

const VerifyCode = async (req, res) => {
  const { code } = req.params;
  const { email } = req.body;
  if (
    EmailToOTP[email] ||
    EmailToOTP.email.OTP != code ||
    EmailToOTP.email.expire < Date.now()
  ) {
    return res
      .status(400)
      .json({ message: "Incorrect Verification code or code is expire" });
  }
  const user = await UserModel.findOne({ email });
  user.active = true;
  await user.save();
  return res.status(200).json({ message: "User verified successfully" });
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
  const { password } = req.body;
  try {
    await UserModel.findByIdAndUpdate(
      req.user._id,
      { password },
      { new: true }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

let EmailToOTP = {};

const generateOTP = () => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const minute = 5;
  const expire = Date.now() + 1000 * 60 * minute;
  return { OTP, minute, expire };
};

const SendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "User do not exist" });

  const { OTP, minute, expire } = generateOTP();
  EmailToOTP[email] = { OTP, expire };

  const item = { email, Sub: "Reset password", text: OTP };
  const template = {
    url: "SendEmailOTP.ejs",
    userName: `${user.firstName} ${user.lastName}`,
    OTP,
    minute,
  };
  console.log("OTP", OTP);
  console.log("minute", minute);
  console.log("expire", expire);
  console.log("item", item);
  console.log("temp", template);

  const abc = await SendMailTemplate(item, template);

  console.log("abc", abc);

  return res.status(200).json({
    message: "OTP Sent",
  });
};

export {
  registeredUser,
  loginUser,
  GoogleLogin,
  SendOTP,
  ChangePassword,
  VerifyCode,
};
