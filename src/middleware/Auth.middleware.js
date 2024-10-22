import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { UserModel } from "../model/user.model.js";

const AuthMiddleware = asyncHandler(async (req, _, next) => {
  const role = req.cookies?.role;

  if (role === "user") {
    UserAuth(req);
    next();
  } else if (role === "admin") {
    AdminAuth();
    next();
  }
  throw new Error("unauthorize");
});

const UserAuth = async (req) => {
  const token = req.cookies?.token;
  console.log("inside UserAuth");
  console.log(token);

  if (!token) return res.status(400).json({ message: "Unauthenticated" });

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(decodedToken._id).select(
    "-password -createdAt -updatedAt -__v"
  );
  if (!user) {
    return res.status(400).json({ message: "Invalid User" });
  }
  req.user = user;
};
const AdminAuth = async (req) => {
  const token = req.cookies?.token;
  console.log("inside AdminAuth");

  if (!token) {
    return res.status(400).json({ message: "Unauthenticated" });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const admin = await UserModel.findById(decodedToken._id).select(
    "-password -createdAt -updatedAt -__v"
  );
  if (!user) {
    return res.status(400).json({ message: "Invalid User" });
  }
  req.user = user;
};

export default AuthMiddleware;
