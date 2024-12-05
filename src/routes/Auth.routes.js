import { Router } from "express";
import ProfileRouter from "./Profile/Profile.routes.js";
import {} from // ChangePassword,
// GoogleLogin,
// loginUser,
// newPassword,
// registeredUser,
// SendOTP,
// VerifyCode,
"../controller/Auth.controller.js";
import {
  registeredUser,
  loginUser,
  SendOTP,
  newPassword,
  ChangePassword,
  VerifyCode,
  VerifyCodeAndLogin,
  CheckUser,
} from "../controller/Auth2.js";
import asyncHandler from "../utils/asyncHandler.js";
import { UserAuthMiddleware } from "../middleware/Auth.middleware.js";

const AuthRouter = Router();

AuthRouter.use("/profile", ProfileRouter);

AuthRouter.route("/signup").post(asyncHandler(registeredUser));
AuthRouter.route("/check-user").post(asyncHandler(CheckUser));
AuthRouter.route("/login").post(asyncHandler(loginUser));
AuthRouter.route("/sendotp").post(asyncHandler(SendOTP));
AuthRouter.route("/verify/:code").post(asyncHandler(VerifyCode));
AuthRouter.route("/verifyAndLogin/:code").post(
  asyncHandler(VerifyCodeAndLogin)
);
AuthRouter.route("/newpassword").post(asyncHandler(newPassword));
AuthRouter.route("/changepassword").post(
  UserAuthMiddleware,
  asyncHandler(ChangePassword)
);
// AuthRouter.route("/login/google?").post(GoogleLogin);

export default AuthRouter;
