import { Router } from "express";
import authRouter from "./auth/router/authRouter";
import contactRouter from "./contact/router/contactRouter";
const apiRouter = Router();

apiRouter.use("/auth",authRouter)
apiRouter.use("/contacts",contactRouter)

export default apiRouter;