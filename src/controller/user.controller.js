import { StatusCodes } from "http-status-codes";
import { UserModel } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { ProfileModel } from "../model/Profile/profile.model.js";

const GenerateToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const UserSchemaValidation = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10).max(12),
  DOB: z.string().min(2),
  password: z.string().min(6).max(16),
  gender: z.enum(["male", "female"]),
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
    return res.status(StatusCodes.OK).json({
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
    })
   

  return res.status(StatusCodes.OK).json({
    message: "Login Succesfull",
    ...user,
    token,
  });
};
export { registeredUser, loginUser };
