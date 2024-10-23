import { Router } from "express";
import BasicDetailsRouter from "./BasicDetails.routes.js";

const ProfileRouter = Router();

ProfileRouter.use("/basic-details", BasicDetailsRouter);

export default ProfileRouter;
