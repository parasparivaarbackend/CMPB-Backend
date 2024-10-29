import { Router } from "express";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  CreateResidencyInfo,
  UpdateResidencyInfo,
} from "../../controller/Profile/ResidencyInfo.controller.js";

const ResidencyInfoRouter = Router();

ResidencyInfoRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreateResidencyInfo)
);

ResidencyInfoRouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdateResidencyInfo)
);

export { ResidencyInfoRouter };
