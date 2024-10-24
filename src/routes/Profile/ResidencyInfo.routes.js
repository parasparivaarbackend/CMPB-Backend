import { Router } from "express";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { CreateResidencyInfo, UpdateResidencyInfo } from "../../controller/Profile/ResidencyInfo.controller.js";


const ResidencyInfoRouter = Router()

ResidencyInfoRouter.route("/create").post(AuthMiddleware, asyncHandler(CreateResidencyInfo))

ResidencyInfoRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdateResidencyInfo))

export { ResidencyInfoRouter }