import { Router } from "express";
import { AdminAuthMiddleware } from "../middleware/Auth.middleware.js";
import { TotalUserForCurrentEvent } from "../controller/Dashboard.controller.js";

const DashboardRouter = Router();

DashboardRouter.route("/totalEventUser").get(AdminAuthMiddleware, TotalUserForCurrentEvent);

export default DashboardRouter;
