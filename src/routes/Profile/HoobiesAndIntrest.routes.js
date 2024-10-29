import { Router } from "express";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  CreateHoobiesAndIntrest,
  UpdateHoobiesAndIntrest,
} from "../../controller/Profile/HoobiesAndIntrest.controller.js";

const HoobiesAndIntrestrouter = Router();

HoobiesAndIntrestrouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreateHoobiesAndIntrest)
);

HoobiesAndIntrestrouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdateHoobiesAndIntrest)
);

export { HoobiesAndIntrestrouter };
