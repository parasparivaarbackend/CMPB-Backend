import { Router } from "express";
import { CreateHappyStories, DeleteHappyStories, GetHappyStories, UpdateHappyStories } from "../../controller/HappyStories/HappyStories.controller.js";
import { AdminAuthMiddleware } from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { uploadImage } from "../../middleware/multter.middleware.js";


const HappyStoriesRouter = Router();

HappyStoriesRouter.route("/get").get(AdminAuthMiddleware, asyncHandler(GetHappyStories))

HappyStoriesRouter.route("/create").post(AdminAuthMiddleware, uploadImage.single("image"), asyncHandler(CreateHappyStories))

HappyStoriesRouter.route("/update/:id").put(AdminAuthMiddleware, uploadImage.single("image"), asyncHandler(UpdateHappyStories))

HappyStoriesRouter.route("/delete/:id").delete(AdminAuthMiddleware, asyncHandler(DeleteHappyStories))

export { HappyStoriesRouter }