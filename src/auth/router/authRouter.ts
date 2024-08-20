import {Router} from "express";
import { LoginDto } from "../dtos/loginDto";
import {validateDto} from '../../../middlewares/validateDto/validateDto'
import { authController } from "../controller/authController";
const authRouter = Router();

const auth = new authController()

authRouter.post('/login',validateDto(LoginDto),auth.login);

export default authRouter;