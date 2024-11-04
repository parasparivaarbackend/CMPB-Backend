import { Router } from "express";
import { DeactivateAccount } from "../../controller/Deactivate/deactivate.controller.js";



const DeactivateRouter = Router();

DeactivateRouter.route("/delete/:id").post(DeactivateAccount)

export { DeactivateRouter }