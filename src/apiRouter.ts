import { Router } from "express";
import authRouter from "./auth/router/authRouter";
import contactRouter from "./contact/router/contactRouter";
import notesRouter from "./notes/routes/noteRouter";
const apiRouter = Router();

apiRouter.use("/auth",authRouter)
apiRouter.use("/contacts",contactRouter)
apiRouter.use("/notes",notesRouter)


export default apiRouter;