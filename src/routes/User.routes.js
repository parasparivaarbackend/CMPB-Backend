import { Router } from "express";
import ProfileRouter from "./Profile/Profile.routes.js";
import {
  GoogleLogin,
  loginUser,
  registeredUser,
} from "../controller/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const UserRouter = Router();

UserRouter.route("/signup").post(asyncHandler(registeredUser));
UserRouter.route("/login").post(asyncHandler(loginUser));
UserRouter.use("/profile", ProfileRouter);
UserRouter.route("/login/google?").post(GoogleLogin);

export default UserRouter;
