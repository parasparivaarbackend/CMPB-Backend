import { Router } from "express";
import { CreateBackground, UpdateBackground } from "../../controller/Profile/Background.controller.js";
import AuthMiddleware from '../../middleware/Auth.middleware.js'
import asyncHandler from "../../utils/asyncHandler.js";

const BackgroundRouter = Router()

BackgroundRouter.route("/create").post(AuthMiddleware, asyncHandler(CreateBackground))

BackgroundRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdateBackground))

export { BackgroundRouter }