import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import {
  CreateEducation,
  UpdateEducation,
} from "../../controller/Profile/education.controller.js";

const educationRouter = Router();

educationRouter
  .route("/create")
  .post(UserAuthMiddleware, asyncHandler(CreateEducation));
educationRouter
  .route("/update")
  .put(UserAuthMiddleware, asyncHandler(UpdateEducation));

export default educationRouter;
