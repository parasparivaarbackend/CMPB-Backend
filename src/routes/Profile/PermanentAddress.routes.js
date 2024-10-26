import { Router } from "express";
import { CreatePermanentAddress, UpdatePermanentAddress } from "../../controller/Profile/PermanentAddress.controller.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js"
import asyncHandler from "../../utils/asyncHandler.js";

const PermanentAddressRouter = Router()

PermanentAddressRouter.route("/create").post(AuthMiddleware, asyncHandler(CreatePermanentAddress))

PermanentAddressRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdatePermanentAddress))


export { PermanentAddressRouter }