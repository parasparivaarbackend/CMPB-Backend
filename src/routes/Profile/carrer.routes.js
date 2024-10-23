import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import { CreateCareer, UpdateCarrer } from "../../controller/Profile/career.controller.js";


const carrerRouter = Router()

carrerRouter.route("/create").post(AuthMiddleware, asyncHandler(CreateCareer))
carrerRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdateCarrer))


export default carrerRouter