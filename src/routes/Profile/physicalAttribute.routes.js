import { Router } from "express";
import {
  CreatePhysicalAttribute,
  UpdatePhysicalAttribute,
} from "../../controller/Profile/PhysicalAttribute.controller.js";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const PhysicalAttributerouter = Router();

PhysicalAttributerouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreatePhysicalAttribute)
);

PhysicalAttributerouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdatePhysicalAttribute)
);

export { PhysicalAttributerouter };
