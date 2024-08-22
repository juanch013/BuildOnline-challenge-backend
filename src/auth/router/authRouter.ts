import {Router} from "express";
import { LoginDto } from "../dtos/loginDto";
import {validateDto} from '../../../middlewares/validateDto/validateDto'
const authRouter = Router();
import authLoginFactory from '../controller/factories/authLoginFactory'

authRouter.post('/login',validateDto(LoginDto),authLoginFactory);

export default authRouter;