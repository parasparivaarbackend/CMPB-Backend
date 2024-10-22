import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { UserModel } from "../model/user.model.js";

const AuthMiddleware = asyncHandler(async (req, res) => {
  const role = req.cookies?.role;
  const cookies = req.cookies;
  console.log(cookies);

  console.log("here 1 role ", role);

  if (role === "user") {
    console.log("2");

    UserAuth();
  } else if (role === "admin") {
    AdminAuth();
  }
  throw new Error("unauthorize");
});

const UserAuth = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "Unauthenticated" });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  console.log("decodedToken", decodedToken);
  const user = UserModel.findById(decodedToken._id).select(
    "-password -createdAt -updatedAt -__v"
  );
  if (!user) {
    return res.status(400).json({ message: "Invalid User" });
  }
  req.user = user;
  next();
};
const AdminAuth = async (req, res) => {};

export default AuthMiddleware;
