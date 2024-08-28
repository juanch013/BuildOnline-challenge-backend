import {Router} from "express";
import verifyToken from "../../../middlewares/authorization/authorization"
const userRouter = Router();
import getUserFactory from "../controller/factories/getUserFactory";

userRouter.use(verifyToken)

userRouter.get('/',getUserFactory)

export default userRouter;
