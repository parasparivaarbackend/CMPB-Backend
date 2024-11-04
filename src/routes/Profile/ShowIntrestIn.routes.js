import { Router } from "express";
import {
  CreateShowIntrestIn,
  getAdminIntrestedIn,
} from "../../controller/Profile/ShowIntrestIn.controller.js";
import {
  AdminAuthMiddleware,
  UserAuthMiddleware,
} from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const ShowIntrestInRouter = Router();

ShowIntrestInRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreateShowIntrestIn)
);
ShowIntrestInRouter.route("/admin-get/:id").get(
  AdminAuthMiddleware,
  asyncHandler(getAdminIntrestedIn)
);

export { ShowIntrestInRouter };
