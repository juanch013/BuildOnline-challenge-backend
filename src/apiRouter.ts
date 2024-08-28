import { Router } from "express";
import authRouter from "./auth/router/authRouter";
import contactRouter from "./contact/router/contactRouter";
import notesRouter from "./notes/routes/noteRouter";
import userRouter from "./user/router/userRouter";
const apiRouter = Router();

apiRouter.use("/auth",authRouter)
apiRouter.use("/contacts",contactRouter)
apiRouter.use("/notes",notesRouter)
apiRouter.use("/user",userRouter)


export default apiRouter;