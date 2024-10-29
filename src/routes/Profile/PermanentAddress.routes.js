import { Router } from "express";
import {
  CreatePermanentAddress,
  UpdatePermanentAddress,
} from "../../controller/Profile/PermanentAddress.controller.js";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const PermanentAddressRouter = Router();

PermanentAddressRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreatePermanentAddress)
);

PermanentAddressRouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdatePermanentAddress)
);

export { PermanentAddressRouter };
