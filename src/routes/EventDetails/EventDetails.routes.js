import { Router } from "express";
import {
  CreateEventDetails,
  createEventPayment,
  DeleteEventsDetails,
  GetEvents,
  GetPurchasedUserEvent,
  UpdateEventDetails,
  UserWhoBookedEvent,
} from "../../controller/eventDetails/eventDetails.contoller.js";
import {
  AdminAuthMiddleware,
  UserAuthMiddleware,
} from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const EventRouter = Router();

EventRouter.route("/get-admin").get(
  AdminAuthMiddleware,
  asyncHandler(GetEvents)
);
EventRouter.route("/get").get(asyncHandler(GetEvents));

EventRouter.route("/create").post(
  AdminAuthMiddleware,
  asyncHandler(CreateEventDetails)
);
EventRouter.route("/bookuser/:id").post(
  UserAuthMiddleware,
  asyncHandler(createEventPayment)
);
EventRouter.route("/UserWhoBookedEvent/:id").get(
  asyncHandler(UserWhoBookedEvent)
);

EventRouter.route("/update/:id").put(
  AdminAuthMiddleware,
  asyncHandler(UpdateEventDetails)
);

EventRouter.route("/delete/:id").delete(
  AdminAuthMiddleware,
  asyncHandler(DeleteEventsDetails)
);
EventRouter.route("/getBookedEvent").get(
  UserAuthMiddleware,
  asyncHandler(GetPurchasedUserEvent)
);

export { EventRouter };
