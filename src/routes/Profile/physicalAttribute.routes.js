import { Router } from "express";
import { CreatePhysicalAttribute, UpdatePhysicalAttribute } from "../../controller/Profile/PhysicalAttribute.controller.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const PhysicalAttributerouter = Router()

PhysicalAttributerouter.route("/create").post(AuthMiddleware, asyncHandler(CreatePhysicalAttribute))

PhysicalAttributerouter.route("/update").put(AuthMiddleware, asyncHandler(UpdatePhysicalAttribute))


export { PhysicalAttributerouter }