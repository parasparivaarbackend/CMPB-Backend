import { Router } from "express";
import {
  CreatePresentAddress,
  UpdatePresentAddress,
} from "../../controller/Profile/presentaddress.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";

const presentaddressRouter = Router();

presentaddressRouter
  .route("/create")
  .post(UserAuthMiddleware, asyncHandler(CreatePresentAddress));
presentaddressRouter
  .route("/update")
  .put(UserAuthMiddleware, asyncHandler(UpdatePresentAddress));

export default presentaddressRouter;
