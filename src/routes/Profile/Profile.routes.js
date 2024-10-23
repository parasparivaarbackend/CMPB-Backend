import { Router } from "express";
import { CreateProfileDetails } from "../../controller/Profile/ProfileDetails.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import presentaddressRouter from "./PresentAddress.routes.js";
import carrerRouter from "./carrer.routes.js";

const ProfileRouter = Router();

// ProfileRouter.use("/basic-details", BasicDetailsRouter);

ProfileRouter.route("/create").post(
  AuthMiddleware,
  asyncHandler(CreateProfileDetails)
);

ProfileRouter.use("/presentaddress", presentaddressRouter)

ProfileRouter.use("/carrer", carrerRouter)

export default ProfileRouter;
