import { Router } from "express";
import AuthRouter from "./Auth.routes.js";
import ProfileRouter from "./Profile/Profile.routes.js";
import { ContactUsRouter } from "./Contact/ContactUs.routes.js";
import UserRouter from "./User.routes.js";
import { EventRouter } from "./EventDetails/EventDetails.routes.js";
import { HappyStoriesRouter } from "./HappyStories/HappyStories.routes.js";
import { DeactivateRouter } from "./Deactivate/Deactivate.routes.js";
import { ChurayeHuaPalRouter } from "./ChurayeHuaPal/ChurayeHuaPal.routes.js";
import PaymentRouter from "./payment.routes.js";
import RegisterPackage from "./Register/Register.routes.js";

const IndexRoute = Router();

IndexRoute.use("/health-check", (_, res) => {
  res.send("hello");
});
IndexRoute.use("/auth", AuthRouter);
IndexRoute.use("/user", UserRouter);
IndexRoute.use("/profile", ProfileRouter);
IndexRoute.use("/contact", ContactUsRouter);
IndexRoute.use("/events", EventRouter);
IndexRoute.use("/happystories", HappyStoriesRouter);
IndexRoute.use("/deactivate-account", DeactivateRouter);
IndexRoute.use("/churaye-hua-pal", ChurayeHuaPalRouter);
IndexRoute.use("/payment", PaymentRouter);
IndexRoute.use("/RegisterPackage", RegisterPackage);

export default IndexRoute;
