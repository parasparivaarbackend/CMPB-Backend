import { Router } from "express";
import {
  AdminAuthMiddleware,
  UserAuthMiddleware,
} from "../../middleware/Auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  CreateBlog,
  DeleteBlog,
  GetBlog,
  UpdateBlog,
} from "../../controller/Blog/Blog.controller.js";
import { uploadImage } from "../../middleware/multter.middleware.js";
const BlogRouter = Router();

BlogRouter.route("/get-admin").get(AdminAuthMiddleware, asyncHandler(GetBlog));
BlogRouter.route("/get").get(asyncHandler(GetBlog));

BlogRouter.route("/create").post(
  AdminAuthMiddleware,
  uploadImage.single("image"),
  asyncHandler(CreateBlog)
);

BlogRouter.route("/delete/:id").delete(
  AdminAuthMiddleware,
  asyncHandler(DeleteBlog)
);

BlogRouter.route("/update/:id").put(
  AdminAuthMiddleware,
  uploadImage.single("image"),
  asyncHandler(UpdateBlog)
);

export { BlogRouter };
