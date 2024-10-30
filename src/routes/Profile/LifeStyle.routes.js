import { Router } from "express";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  CreateLifeStyle,
  UpdateLifeStyle,
} from "../../controller/Profile/LifeStyle.controller.js";

const LifeStyleRouter = Router();

LifeStyleRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreateLifeStyle)
);
LifeStyleRouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdateLifeStyle)
);

export { LifeStyleRouter };
