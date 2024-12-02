import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { UserModel } from "../model/user.model.js";

const UserAuthMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");

  if (!token) return res.status(400).json({ message: "Unauthenticated" });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decodedToken?._id).select(
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
  } catch (error) {
    return res.status(500).json({ message: "Invalid Token or Token exipre" });
  }
});
const AdminAuthMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");

  if (!token) return res.status(400).json({ message: "Unauthenticated" });

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const admin = await UserModel.findById(decodedToken?._id).select(
    "-password -__v"
  );

  if (!admin) return res.status(400).json({ message: "Invalid admin" });

  if (admin.role !== "admin")
    return res.status(400).json({ message: "Unauthorize user" });

  if (admin && !admin.active) {
    return res
      .status(400)
      .json({ message: "Please verify your account first" });
  }

  req.user = admin;
  next();
});
export { UserAuthMiddleware, AdminAuthMiddleware };

export class Auth {
  static async UserAuth(req, res, next) {
    console.log("inside user auth");

    const token =
      req.cookies?.token ||
      (req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(400).json({ message: "Unauthenticated" });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decodedToken._id).select(
        "-password -__v"
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user role is valid
      if (user.role !== "user" && user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      // Store user info in request for later use
      req.user = user;
      console.log("before user next");

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  static async AdminAuth(req, res, next) {
    console.log("inside admin auth");
    const token =
      req.cookies?.token ||
      (req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(400).json({ message: "Unauthenticated" });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await UserModel.findById(decodedToken._id).select(
        "-password -__v"
      );

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Check if the user role is 'admin'
      if (admin.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      // Store admin info in request for later use
      req.admin = admin;
      console.log("before admin next");
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
}
