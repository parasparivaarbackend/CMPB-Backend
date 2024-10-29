import { Router } from "express";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  CreateAstronomic,
  UpdateAstronomic,
} from "../../controller/Profile/Astronomic.controller.js";

const AstronomicRouter = Router();

AstronomicRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreateAstronomic)
);

AstronomicRouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdateAstronomic)
);

export { AstronomicRouter };
