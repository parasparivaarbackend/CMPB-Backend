import { Router } from "express";
import AuthMiddleware from '../../middleware/Auth.middleware.js'
import asyncHandler from "../../utils/asyncHandler.js";
import { CreateAstronomic, UpdateAstronomic } from "../../controller/Profile/Astronomic.controller.js";

const AstronomicRouter = Router()

AstronomicRouter.route("/create").post(AuthMiddleware, asyncHandler(CreateAstronomic))

AstronomicRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdateAstronomic))

export { AstronomicRouter }