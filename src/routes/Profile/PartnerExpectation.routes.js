import { Router } from "express";
import { CreatePartnerExpectation, UpdatePartnerExpectation } from "../../controller/Profile/PartnerExpectation.controller.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js"
import asyncHandler from "../../utils/asyncHandler.js";


const PartnerExpectationRouter = Router()

PartnerExpectationRouter.route("/create").post(AuthMiddleware, asyncHandler(CreatePartnerExpectation))

PartnerExpectationRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdatePartnerExpectation))

export { PartnerExpectationRouter }