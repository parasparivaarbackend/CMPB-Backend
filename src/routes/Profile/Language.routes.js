import { Router } from "express";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { CreateLanguages, UpdateLanguages } from "../../controller/Profile/Language.controller.js";


const Languagerouter = Router()


Languagerouter.route("/create").post(AuthMiddleware, asyncHandler(CreateLanguages))
Languagerouter.route("/update").put(AuthMiddleware, asyncHandler(UpdateLanguages))

export { Languagerouter }