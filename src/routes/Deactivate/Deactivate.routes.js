import { Router } from "express";
import { DeactivateAccount } from "../../controller/Deactivate/deactivate.controller.js";
import {UserAuthMiddleware} from "../../middleware/Auth.middleware.js"
import asyncHandler from "../../utils/asyncHandler.js";


const DeactivateRouter = Router();

DeactivateRouter.route("/delete").post(UserAuthMiddleware, asyncHandler(DeactivateAccount))

export { DeactivateRouter }