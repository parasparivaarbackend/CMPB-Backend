import { Router } from "express";
import ProfileRouter from "./Profile.routes.js";
import { registeredUser } from "../controller/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const UserRouter = Router();

// UserRouter.route("/login").post(login);
UserRouter.route("/signup").post(asyncHandler(registeredUser));
UserRouter.use("/profile", ProfileRouter);

export default UserRouter;
