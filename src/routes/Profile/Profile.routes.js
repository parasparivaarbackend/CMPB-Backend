import { Router } from "express";
import { UpdateProfileDetails } from "../../controller/Profile/ProfileDetails.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import presentaddressRouter from "./PresentAddress.routes.js";

const ProfileRouter = Router();

//create register krte waqt kr rha h sirf update krega
// ProfileRouter.route("/create").post(
//   AuthMiddleware,
//   asyncHandler(CreateProfileDetails)
// );
ProfileRouter.route("/update").put(
  [AuthMiddleware],
  asyncHandler(UpdateProfileDetails)
);

ProfileRouter.use("/presentaddress", presentaddressRouter);

export default ProfileRouter;
