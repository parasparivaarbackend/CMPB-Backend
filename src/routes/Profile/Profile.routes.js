import { Router } from "express";
import { CreateProfileDetails } from "../../controller/Profile/ProfileDetails.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";

const ProfileRouter = Router();

// ProfileRouter.use("/basic-details", BasicDetailsRouter);

ProfileRouter.route("/create").post(
  AuthMiddleware,
  asyncHandler(CreateProfileDetails)
);

export default ProfileRouter;
