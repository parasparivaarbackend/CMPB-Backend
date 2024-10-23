import { StatusCodes } from "http-status-codes";
import { UserModel } from "../model/user.model.js";
import { UserSchemaValidation } from "../validation/auth.validation.js";
import jwt from "jsonwebtoken";

const GenerateToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

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
  const data = await UserModel.create(validateData.data);

  const token = GenerateToken(data._id);
  res
    .cookie("token", token, {
      httpOnly: false,
      secure: false,
    })
    .cookie("role", data.role, {
      httpOnly: false,
      secure: false,
    });
  return res.status(StatusCodes.OK).json({
    message: "User registered successfull",
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
    .cookie("token", token, {
      httpOnly: true,
      secure: false,
    })
    .cookie("role", user.role, {
      httpOnly: true,
      secure: false,
    });
  return res.status(StatusCodes.OK).json({
    message: "Login Succesfull",
    user,
    token,
  });
};
export { registeredUser, loginUser };
