import { Router } from "express";
import ProfileRouter from "./Profile/Profile.routes.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getAllUserByAdmin } from "../controller/user.controller.js";
import { AdminAuthMiddleware } from "../middleware/Auth.middleware.js";

const UserRouter = Router();

UserRouter.use("/profile", ProfileRouter);

UserRouter.route("/getAllUserAdmin?").get(
  AdminAuthMiddleware,
  asyncHandler(getAllUserByAdmin)
);

UserRouter.route("/getUser/:id").get(AdminAuthMiddleware,asyncHandler())



export default UserRouter;
