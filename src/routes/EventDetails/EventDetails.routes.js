import { Router } from "express";
import {
  CreateEventDetails,
  DeleteEventsDetails,
  GetEvents,
  RegisterForEvent,
  UpdateEventDetails,
  verifyPayment,
} from "../../controller/eventDetails/eventDetails.contoller.js";
import {
  AdminAuthMiddleware,
  UserAuthMiddleware,
} from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const EventRouter = Router();

EventRouter.route("/get").get(asyncHandler(GetEvents));

EventRouter.route("/create").post(
  AdminAuthMiddleware,
  asyncHandler(CreateEventDetails)
);

EventRouter.route("/update/:id").put(
  AdminAuthMiddleware,
  asyncHandler(UpdateEventDetails)
);

// EventRouter.route("/delete/:id").delete(
//   AdminAuthMiddleware,
//   asyncHandler(DeleteEventsDetails)
// );

EventRouter.route("/pay/?").post(
  UserAuthMiddleware,
  asyncHandler(RegisterForEvent)
);
// EventRouter.route("/payment/verify").post(asyncHandler(verifyPayment));

export { EventRouter };
