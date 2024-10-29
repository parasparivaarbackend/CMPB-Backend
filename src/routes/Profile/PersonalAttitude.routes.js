import { Router } from "express";
import {
  CreatePersonalAttitude,
  UpdatePersonalAttitude,
} from "../../controller/Profile/PersonalAttitude.controller.js";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const PersonalAttitudeRouter = Router();

PersonalAttitudeRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreatePersonalAttitude)
);

PersonalAttitudeRouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdatePersonalAttitude)
);

export { PersonalAttitudeRouter };
