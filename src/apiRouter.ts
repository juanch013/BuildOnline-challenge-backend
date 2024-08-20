import { Router } from "express";
import authRouter from "./auth/router/authRouter";
const apiRouter = Router();

apiRouter.use("/auth",authRouter)

export default apiRouter;