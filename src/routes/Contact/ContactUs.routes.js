import { Router } from "express";
import { CreateContactUs, DeleteContact, getContact } from "../../controller/Contact Us/ContactUs.controller.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js"
import asyncHandler from "../../utils/asyncHandler.js";


const ContactUsRouter = Router()

ContactUsRouter.route("/create").post(AuthMiddleware, asyncHandler(CreateContactUs));

ContactUsRouter.route("/get?").get(AuthMiddleware, asyncHandler(getContact));

ContactUsRouter.route("/delete/:id").delete(AuthMiddleware, asyncHandler(DeleteContact));

export { ContactUsRouter }