import { Router } from "express";
import ProfileRouter from "./Profile/Profile.routes.js";
import { loginUser, registeredUser } from "../controller/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const UserRouter = Router();

UserRouter.route("/signup").post(asyncHandler(registeredUser));
UserRouter.route("/login").post(asyncHandler(loginUser));
UserRouter.route("/login/google/?credentials").post(asyncHandler(loginUser));
UserRouter.use("/profile", ProfileRouter);

export default UserRouter;
