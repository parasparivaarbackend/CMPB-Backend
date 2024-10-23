import { Router } from "express";
import { CreatePresentAddress } from "../../controller/Profile/presentaddress.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";


const presentaddressRouter = Router()

presentaddressRouter.route("/create").post(AuthMiddleware, asyncHandler(CreatePresentAddress))

export default presentaddressRouter