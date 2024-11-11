import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { payment } from "../controller/payment.controller.js";
import { UserAuthMiddleware } from "../middleware/Auth.middleware.js";

const PaymentRouter = Router();

PaymentRouter.route(`/events?`).post(UserAuthMiddleware, asyncHandler(payment));

PaymentRouter.route(`/package?`).post(
  UserAuthMiddleware,
  asyncHandler(payment)
);

export default PaymentRouter;
