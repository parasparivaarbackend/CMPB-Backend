import { Router } from "express";
import { CreateEventDetails } from "../../controller/eventDetails/eventDetails.contoller.js";
import { AdminAuthMiddleware } from "../../middleware/Auth.middleware.js"
import asyncHandler from "../../utils/asyncHandler.js";


const EventRouter = Router();

EventRouter.route("/create").post(AdminAuthMiddleware, asyncHandler(CreateEventDetails))

export { EventRouter }