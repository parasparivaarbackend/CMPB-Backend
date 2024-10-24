import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import { CreateEducation, UpdateEducation } from "../../controller/Profile/education.controller.js";


const educationRouter = Router()

educationRouter.route("/create").post(AuthMiddleware, asyncHandler(CreateEducation))
educationRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdateEducation))


export default educationRouter