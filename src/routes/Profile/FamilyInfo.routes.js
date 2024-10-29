import { Router } from "express";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  CreateFamilyInfo,
  UpdateFamilyInfo,
} from "../../controller/Profile/FamilyInfo.controller.js";

const FamilyInfoRouter = Router();

FamilyInfoRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreateFamilyInfo)
);

FamilyInfoRouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdateFamilyInfo)
);

export { FamilyInfoRouter };
