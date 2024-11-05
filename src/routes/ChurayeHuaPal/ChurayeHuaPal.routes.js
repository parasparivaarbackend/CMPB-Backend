import { Router } from "express";
import { ChurayeHuaPalCreate, ChurayeHuaPalDelete, ChurayeHuaPalGet, ChurayeHuaPalUpdate } from "../../controller/ChurayeHuaPal/ChurayeHuaPal.controller.js";
import { AdminAuthMiddleware } from "../../middleware/Auth.middleware.js"
import asyncHandler from "../../utils/asyncHandler.js";

const ChurayeHuaPalRouter = Router();

ChurayeHuaPalRouter.route("/get").get(AdminAuthMiddleware, asyncHandler(ChurayeHuaPalGet))

ChurayeHuaPalRouter.route("/create").post(AdminAuthMiddleware, asyncHandler(ChurayeHuaPalCreate))

ChurayeHuaPalRouter.route("/update/:id").put(AdminAuthMiddleware, asyncHandler(ChurayeHuaPalUpdate))

ChurayeHuaPalRouter.route("/delete/:id").delete(AdminAuthMiddleware, asyncHandler(ChurayeHuaPalDelete))

export { ChurayeHuaPalRouter }