import { Router } from "express";
import { CreateShowIntrestIn } from "../../controller/Profile/ShowIntrestIn.controller.js";
import AuthMiddleware from '../../middleware/Auth.middleware.js';
import asyncHandler from "../../utils/asyncHandler.js";



const ShowIntrestInRouter = Router()

ShowIntrestInRouter.route("/create").post(AuthMiddleware, asyncHandler(CreateShowIntrestIn))

export { ShowIntrestInRouter }