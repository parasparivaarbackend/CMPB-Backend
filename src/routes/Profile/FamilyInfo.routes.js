import { Router } from "express";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { CreateFamilyInfo, UpdateFamilyInfo } from "../../controller/Profile/FamilyInfo.controller.js";



const FamilyInfoRouter = Router()

FamilyInfoRouter.route("/create").post(AuthMiddleware, asyncHandler(CreateFamilyInfo))

FamilyInfoRouter.route("/update").put(AuthMiddleware, asyncHandler(UpdateFamilyInfo))

export { FamilyInfoRouter }