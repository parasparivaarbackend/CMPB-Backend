import { Router } from "express"
import { CreatePersonalAttitude, UpdatePersonalAttitude } from "../../controller/Profile/PersonalAttitude.controller.js"
import AuthMiddleware from "../../middleware/Auth.middleware.js"
import asyncHandler from "../../utils/asyncHandler.js"



const PersonalAttitudeRouter = Router()

PersonalAttitudeRouter.route("/create").post(AuthMiddleware, asyncHandler(CreatePersonalAttitude))

PersonalAttitudeRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdatePersonalAttitude))

export { PersonalAttitudeRouter }