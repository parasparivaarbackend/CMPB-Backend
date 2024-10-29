import { Router } from "express";
import {
  CreatePartnerExpectation,
  UpdatePartnerExpectation,
} from "../../controller/Profile/PartnerExpectation.controller.js";
import { UserAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const PartnerExpectationRouter = Router();

PartnerExpectationRouter.route("/create").post(
  UserAuthMiddleware,
  asyncHandler(CreatePartnerExpectation)
);

PartnerExpectationRouter.route("/update").put(
  UserAuthMiddleware,
  asyncHandler(UpdatePartnerExpectation)
);

export { PartnerExpectationRouter };
