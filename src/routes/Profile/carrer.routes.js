import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import {
  CreateCareer,
  UpdateCarrer,
} from "../../controller/Profile/career.controller.js";

const carrerRouter = Router();

carrerRouter
  .route("/create")
  .post(UserAuthMiddleware, asyncHandler(CreateCareer));
carrerRouter
  .route("/update")
  .put(UserAuthMiddleware, asyncHandler(UpdateCarrer));

export default carrerRouter;
