import { Router } from "express";
import {
  CreateContactUs,
  DeleteContact,
  getContact,
} from "../../controller/Contact Us/ContactUs.controller.js";
import { AdminAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const ContactUsRouter = Router();

ContactUsRouter.route("/create").post(asyncHandler(CreateContactUs));

ContactUsRouter.route("/get?").get(
  AdminAuthMiddleware,
  asyncHandler(getContact)
);

ContactUsRouter.route("/delete/:id").delete(
  AdminAuthMiddleware,
  asyncHandler(DeleteContact)
);

export { ContactUsRouter };
