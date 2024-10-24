import { Router } from "express";
import { UpdateProfileDetails } from "../../controller/Profile/ProfileDetails.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import presentaddressRouter from "./PresentAddress.routes.js";
import carrerRouter from "./carrer.routes.js";
import educationRouter from "./education.routes.js";

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

ProfileRouter.use("/carrer", carrerRouter)

ProfileRouter.use("/education", educationRouter)

export default ProfileRouter;
