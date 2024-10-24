import { Router } from "express";
import UserRouter from "./User.routes.js";
import AdminRouter from "./Admin.routes.js";
import ProfileRouter from "./Profile/Profile.routes.js";

const IndexRoute = Router();

IndexRoute.use("/health-check", (_, res) => {
  res.send("hello");
});
IndexRoute.use("/user", UserRouter);
IndexRoute.use("/admin", AdminRouter);
IndexRoute.use("/profile", ProfileRouter);

export default IndexRoute;
