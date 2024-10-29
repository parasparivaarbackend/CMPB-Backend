import { Router } from "express";
import AuthRouter from "./Auth.routes.js";
import ProfileRouter from "./Profile/Profile.routes.js";
import { ContactUsRouter } from "./Contact/ContactUs.routes.js";
import UserRouter from "./User.routes.js";
import { EventRouter } from "./EventDetails/EventDetails.routes.js";

const IndexRoute = Router();

IndexRoute.use("/health-check", (_, res) => {
  res.send("hello");
});
IndexRoute.use("/auth", AuthRouter);
IndexRoute.use("/user", UserRouter);
IndexRoute.use("/profile", ProfileRouter);
IndexRoute.use("/contact", ContactUsRouter);
IndexRoute.use("/events", EventRouter);

export default IndexRoute;
