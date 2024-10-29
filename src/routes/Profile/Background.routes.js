import { Router } from "express";
import {
  CreateBackground,
  UpdateBackground,
} from "../../controller/Profile/Background.controller.js";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const BackgroundRouter = Router();

BackgroundRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreateBackground)
);

BackgroundRouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdateBackground)
);

export { BackgroundRouter };
