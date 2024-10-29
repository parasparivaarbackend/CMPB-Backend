import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { UserModel } from "../model/user.model.js";

const UserAuthMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers.authorization.replace("Bearer ", "");

  if (!token) return res.status(400).json({ message: "Unauthenticated" });

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(decodedToken._id).select(
    "-password -updatedAt -__v"
  );

  if (!user) return res.status(400).json({ message: "Invalid User" });

  if (user.role !== "user")
    return res.status(400).json({ message: "Unauthorize user" });

  if (user && !user.active)
    return res
      .status(400)
      .json({ message: "Please verify your account first" });

  req.user = user;

  next();
});
const AdminAuthMiddleware = asyncHandler(async (req, res, next) => {
  const role = req.cookies?.role || req.headers.role;

  const token =
    req.cookies?.token || req.headers.authorization.replace("Bearer ", "");

  if (!token) return res.status(400).json({ message: "Unauthenticated" });

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const admin = await UserModel.findById(decodedToken._id).select(
    "-password -__v"
  );
  if (!admin) return res.status(400).json({ message: "Invalid admin" });

  if (admin.role !== "admin" || admin.role !== "user")
    return res.status(400).json({ message: "Unauthorize user" });

  if (admin && !admin.active) {
    return res
      .status(400)
      .json({ message: "Please verify your account first" });
  }

  req.admin = admin;
  next();
});
export { UserAuthMiddleware, AdminAuthMiddleware };
