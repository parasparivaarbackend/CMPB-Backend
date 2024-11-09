import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  CreateRegisterPackage,
  GetRegisterPackage,
  UpdateRegisterPackage,
} from "../../controller/eventDetails/RegisterEvent.js";
import { AdminAuthMiddleware } from "../../middleware/Auth.middleware.js";

const RegisterPackage = Router();

RegisterPackage.route("/create").post(
  AdminAuthMiddleware,
  asyncHandler(CreateRegisterPackage)
);
RegisterPackage.route("/update/:id").put(
  AdminAuthMiddleware,
  asyncHandler(UpdateRegisterPackage)
);
RegisterPackage.route("/get").get(asyncHandler(GetRegisterPackage));

export default RegisterPackage;
