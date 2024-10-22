import { Router } from "express";


const ProfileRouter = Router();

ProfileRouter.use("/basic-details",BasicDetailsRouter);



export default ProfileRouter;
