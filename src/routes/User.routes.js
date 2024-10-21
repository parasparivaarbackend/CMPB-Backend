import { Router } from "express";
import ProfileRouter from "./Profile.routes.js";

const UserRouter = Router();

// UserRouter.route("/login").post(login);
// UserRouter.route("/signup").post(signup);
UserRouter.use("/profile", ProfileRouter);

export default UserRouter;
