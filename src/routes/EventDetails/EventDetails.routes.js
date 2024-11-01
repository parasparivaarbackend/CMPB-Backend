import { Router } from "express";
import { CreateEventDetails, DeleteEventsDetails, GetEvents, UpdateEventDetails } from "../../controller/eventDetails/eventDetails.contoller.js";
import { AdminAuthMiddleware } from "../../middleware/Auth.middleware.js"
import asyncHandler from "../../utils/asyncHandler.js";


const EventRouter = Router();

EventRouter.route("/get").get(AdminAuthMiddleware, asyncHandler(GetEvents))

EventRouter.route("/create").post(AdminAuthMiddleware, asyncHandler(CreateEventDetails))

EventRouter.route("/update/:id").put(AdminAuthMiddleware, asyncHandler(UpdateEventDetails))

EventRouter.route("/delete/:id").delete(AdminAuthMiddleware, asyncHandler(DeleteEventsDetails))

export { EventRouter }