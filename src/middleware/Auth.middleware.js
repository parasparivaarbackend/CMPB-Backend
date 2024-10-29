import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { UserModel } from "../model/user.model.js";

const UserAuthMiddleware = asyncHandler(async (req, res) => {
  const role = req.cookies?.role;

  if (role !== "user")
    return res.status(400).json({ message: "Unauthorize user" });

  const token =
    req.cookies?.token || req.headers.authorization.replace("Bearer ", "");

  if (!token) return res.status(400).json({ message: "Unauthenticated" });

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(decodedToken._id).select(
    "-password -updatedAt -__v"
  );

  if (!user) return res.status(400).json({ message: "Invalid User" });

  if (user && !user.active)
    return res
      .status(400)
      .json({ message: "Please verify your account first" });

  req.user = user;
});
const AdminAuthMiddleware = asyncHandler(async (req, res) => {
  const role = req.cookies?.role;

  if (role !== "admin" || role !== "user")
    return res.status(400).json({ message: "Unauthorize user" });

  const token =
    req.cookies?.token || req.headers.authorization.replace("Bearer ", "");

  if (!token) return res.status(400).json({ message: "Unauthenticated" });

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const admin = await UserModel.findById(decodedToken._id).select(
    "-password -__v"
  );
  if (!user) return res.status(400).json({ message: "Invalid User" });
  if (user && !user.active) {
    return res
      .status(400)
      .json({ message: "Please verify your account first" });
  }
  req.user = user;
});
export { UserAuthMiddleware, AdminAuthMiddleware };
