import { Router } from "express";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  CreateLanguages,
  UpdateLanguages,
} from "../../controller/Profile/Language.controller.js";

const Languagerouter = Router();

Languagerouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreateLanguages)
);
Languagerouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdateLanguages)
);

export { Languagerouter };
