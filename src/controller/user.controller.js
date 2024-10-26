import { z } from "zod";
import axios from "axios";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../model/user.model.js";
import { ProfileModel } from "../model/Profile/profile.model.js";
import { oauth2Client } from "../utils/GoogleConfig.js";
import { GoogleModel } from "../model/GoogleLogin.model.js";
import { SendMailTemplate } from "../utils/EmailHandler.js";

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

  const user = new UserModel(validateData.data);
  console.log("user before save", user);

  const profileData = await ProfileModel.create(validateData.data);
  console.log("Profile created", profileData);

  if (!profileData) {
    return res.status(500).json({ message: "Failed to register user" });
  }
  user.ProfileID = profileData._id;

  const savedUser = await user.save();
  const data = savedUser.toObject();
  delete data.password;
  profileData.UserID = data._id;
  await profileData.save();

  if (!savedUser) {
    return res.status(500).json({ message: "Failed to register user" });
  }

  const token = GenerateToken(savedUser._id, savedUser.email);

  return res.status(StatusCodes.OK).json({
    message: "User registered successfull",
    ...data,
    token,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const existUser = await UserModel.findOne({ email });
  if (!existUser) {
    return res.status(400).json({ message: "User Not Found" });
  }

  const checkPassword = await existUser.comparePassword(password);
  if (!checkPassword) {
    return res.status(400).json({ message: "Password does not match" });
  }

  const token = GenerateToken(existUser._id, email);
  const user = existUser.toObject();
  delete user.password;

  res
    .cookie("myCookie", "cookieValue", {
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      expires: new Date(Date.now() + 8 * 3600000),
    })
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
  if (EmailToOTP) {
  }
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

const SendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "User do not exist" });

  const OTP = Math.floor(1000 + Math.random() * 9000);
  const minute = 5;
  const expire = Date.now() + 1000 * 60 * minute;
  EmailToOTP[email] = { OTP, expire };

  const item = { email, Sub: "Reset password" };
  const template = {
    url: "SendOTP.ejs",
    userName: find.name,
    OTP,
    min,
  };
  const abc = await SendMailTemplate(item, template);

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
