import { Router } from "express";
import { CreateHappyStories, UpdateHappyStories } from "../../controller/HappyStories/HappyStories.controller.js";
import { AdminAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { uploadImage } from "../../middleware/multter.middleware.js";


const HappyStoriesRouter = Router();

HappyStoriesRouter.route("/create").post(AdminAuthMiddleware, uploadImage.single("image"), asyncHandler(CreateHappyStories))

HappyStoriesRouter.route("/update/:id").post(AdminAuthMiddleware, uploadImage.single("image"), asyncHandler(UpdateHappyStories))

export { HappyStoriesRouter }