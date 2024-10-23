import { Router } from "express";
import {
  CreateProfileDetails,
  UpdateProfileDetails,
} from "../../controller/Profile/ProfileDetails.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import presentaddressRouter from "./PresentAddress.routes.js";

const ProfileRouter = Router();

// ProfileRouter.use("/basic-details", BasicDetailsRouter);

ProfileRouter.route("/create").post(
  AuthMiddleware,
  asyncHandler(CreateProfileDetails)
);
ProfileRouter.route("/update").put(
  AuthMiddleware,
  asyncHandler(UpdateProfileDetails)
);

ProfileRouter.use("/presentaddress", presentaddressRouter)

export default ProfileRouter;
