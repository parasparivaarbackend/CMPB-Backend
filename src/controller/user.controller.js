import { StatusCodes } from "http-status-codes";
import { UserModel } from "../model/user.model.js";
import { UserSchemaValidation } from "../validation/auth.validation.js";
import jwt from "jsonwebtoken";

const GenerateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registeredUser = async (req, res) => {
  const userData = req.body;
  const validatedData = UserSchemaValidation.safeParse(userData);
  if (validatedData.success === false) {
    return res.status(400).json(...validatedData.error.issues);
  }

  const existUser = await UserModel.findOne({
    $or: [
      { email: validatedData.data.email },
      { phone: validatedData.data.phone },
    ],
  });
  if (existUser) {
    return res.status(StatusCodes.OK).json({
      message: "User already Exist",
    });
  }
  const data = await UserModel.create(validatedData.data);

  const token = GenerateToken(data._id);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
    })
    .cookie("role", data.role, {
      httpOnly: true,
      secure: true,
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

  const token = GenerateToken(email);
  const user = existUser.toObject();
  delete user.password;

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
    })
    .cookie("role", user.role, {
      httpOnly: true,
      secure: true,
    });
  return res.status(StatusCodes.OK).json({
    message: "Login Succesfull",
    user,
  });
};
export { registeredUser, loginUser };
