import { Router } from "express";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import { CreateBasicDetails } from "../../controller/Profile/BasicDetails.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";

const BasicDetailsRouter = Router();

BasicDetailsRouter.route("/create").post(
  AuthMiddleware,
  asyncHandler(CreateBasicDetails)
);

export default BasicDetailsRouter;
