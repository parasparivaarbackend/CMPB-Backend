import { Router } from "express";
import ProfileRouter from "./Profile/Profile.routes.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getActiveUser,
  getAllUserByAdmin,
  getUserById,
} from "../controller/user.controller.js";
import {
  AdminAuthMiddleware,
  Auth,
  UserAuthMiddleware,
} from "../middleware/Auth.middleware.js";

const UserRouter = Router();

UserRouter.use("/profile", ProfileRouter);

UserRouter.route("/getAllUserAdmin?").get(
  AdminAuthMiddleware,
  asyncHandler(getAllUserByAdmin)
);

UserRouter.route("/getActiveUser").get(
  UserAuthMiddleware,
  asyncHandler(getActiveUser)
);
UserRouter.route("/check").get(Auth.UserAuth, asyncHandler(getUserById));

export default UserRouter;
