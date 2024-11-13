import { Router } from "express";
import ProfileRouter from "./Profile/Profile.routes.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getActiveUser,
  getAllUserByAdmin,
  getMemberByID,
  getUserById,
  listFiles,
  ManualDeleteImage,
  ProfileImageDelete,
  ProfileImageUpdate,
  UpdateProfileDetails,
  UserPackageData,
} from "../controller/user.controller.js";
import {
  AdminAuthMiddleware,
  Auth,
  UserAuthMiddleware,
} from "../middleware/Auth.middleware.js";
import { uploadImage } from "../middleware/multter.middleware.js";

const UserRouter = Router();

UserRouter.use("/profile", ProfileRouter);

UserRouter.route("/update").put(
  [UserAuthMiddleware],
  asyncHandler(UpdateProfileDetails)
);
UserRouter.route("/profile_image/update").put(
  [UserAuthMiddleware, uploadImage.single("image")],
  asyncHandler(ProfileImageUpdate)
);
UserRouter.route("/profile_image/delete").delete(
  [UserAuthMiddleware],
  asyncHandler(ProfileImageDelete)
);
UserRouter.route("/manualDelete").delete(asyncHandler(ManualDeleteImage));
UserRouter.route("/allfiles").get(asyncHandler(listFiles));

UserRouter.route("/getAllUserAdmin?").get(
  AdminAuthMiddleware,
  asyncHandler(getAllUserByAdmin)
);

UserRouter.route("/getActiveUser").get(
  UserAuthMiddleware,
  asyncHandler(getActiveUser)
);
UserRouter.route("/member/?").get(
  UserAuthMiddleware,
  asyncHandler(getMemberByID)
);
UserRouter.route("/admin-member/?").get(
  AdminAuthMiddleware,
  asyncHandler(getMemberByID)
);
UserRouter.route("/getUser/:id").get(
  UserAuthMiddleware,
  asyncHandler(getUserById)
);
UserRouter.route("/paymentUpdate").put(
  UserAuthMiddleware,
  asyncHandler(UserPackageData)
);

export default UserRouter;
