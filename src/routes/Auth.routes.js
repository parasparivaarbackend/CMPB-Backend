import { Router } from "express";
import ProfileRouter from "./Profile/Profile.routes.js";
import {
  GoogleLogin,
  loginUser,
  registeredUser,
  SendOTP,
  VerifyCode,
} from "../controller/Auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const AuthRouter = Router();

AuthRouter.use("/profile", ProfileRouter);

AuthRouter.route("/signup").post(asyncHandler(registeredUser));
AuthRouter.route("/login").post(asyncHandler(loginUser));
AuthRouter.route("/sendotp").post(asyncHandler(SendOTP));
AuthRouter.route("/verify/:code").post(asyncHandler(VerifyCode));
AuthRouter.route("/login/google?").post(GoogleLogin);

export default AuthRouter;
