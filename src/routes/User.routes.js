import { Router } from "express";
import ProfileRouter from "./Profile/Profile.routes.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getAllUserByAdmin } from "../controller/user.controller.js";

const UserRouter = Router();

UserRouter.use("/profile", ProfileRouter);

UserRouter.route("/getAllUserAdmin?").post(asyncHandler(getAllUserByAdmin));

export default UserRouter;
