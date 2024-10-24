import { Router } from "express";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { CreateHoobiesAndIntrest, UpdateHoobiesAndIntrest } from "../../controller/Profile/HoobiesAndIntrest.controller.js";


const HoobiesAndIntrestrouter = Router()

HoobiesAndIntrestrouter.route("/create").post(AuthMiddleware, asyncHandler(CreateHoobiesAndIntrest))

HoobiesAndIntrestrouter.route("/update").put(AuthMiddleware, asyncHandler(UpdateHoobiesAndIntrest))

export { HoobiesAndIntrestrouter }