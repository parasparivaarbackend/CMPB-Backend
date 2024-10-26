import { Router } from "express";
import { getProfileData, UpdateProfileDetails } from "../../controller/Profile/ProfileDetails.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthMiddleware from "../../middleware/Auth.middleware.js";
import presentaddressRouter from "./PresentAddress.routes.js";
import carrerRouter from "./carrer.routes.js";
import educationRouter from "./education.routes.js";
import { PhysicalAttributerouter } from "./physicalAttribute.routes.js";
import { Languagerouter } from "./Language.routes.js";
import { HoobiesAndIntrestrouter } from "./HoobiesAndIntrest.routes.js";
import { PersonalAttitudeRouter } from "./PersonalAttitude.routes.js";
import { ResidencyInfoRouter } from "./ResidencyInfo.routes.js";
import { BackgroundRouter } from "./Background.routes.js";
import { AstronomicRouter } from "./Astronomic.routes.js";
import { PermanentAddressRouter } from "./PermanentAddress.routes.js";
import { FamilyInfoRouter } from "./FamilyInfo.routes.js";
import { PartnerExpectationRouter } from "./PartnerExpectation.routes.js";
import { ShowIntrestInRouter } from "./ShowIntrestIn.routes.js";

const ProfileRouter = Router();

//create register krte waqt kr rha h sirf update krega
// ProfileRouter.route("/create").post(
//   AuthMiddleware,
//   asyncHandler(CreateProfileDetails)
// );
ProfileRouter.route("/update").put(
  [AuthMiddleware],
  asyncHandler(UpdateProfileDetails)
);
ProfileRouter.route("/get").get(
  [AuthMiddleware],
  asyncHandler(getProfileData)
);

ProfileRouter.use("/presentaddress", presentaddressRouter);

ProfileRouter.use("/carrer", carrerRouter)

ProfileRouter.use("/education", educationRouter)

ProfileRouter.use("/physicalattribute", PhysicalAttributerouter)

ProfileRouter.use("/languages", Languagerouter)

ProfileRouter.use("/hoobiesandintrest", HoobiesAndIntrestrouter)

ProfileRouter.use("/personalattitude", PersonalAttitudeRouter)

ProfileRouter.use("/residencyinfo", ResidencyInfoRouter)

ProfileRouter.use("/background", BackgroundRouter)

ProfileRouter.use("/astronomic", AstronomicRouter)

ProfileRouter.use("/permanentaddress", PermanentAddressRouter)

ProfileRouter.use("/familyinfo", FamilyInfoRouter)

ProfileRouter.use("/partnerexpectation", PartnerExpectationRouter)

ProfileRouter.use("/showintrestin", ShowIntrestInRouter)



export default ProfileRouter;
