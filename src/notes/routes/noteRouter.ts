import {Router} from "express";
import {validateDto} from '../../../middlewares/validateDto/validateDto'
import verifyToken from "../../../middlewares/authorization/authorization"
const notesRouter = Router();

notesRouter.use(verifyToken)


export default notesRouter;
