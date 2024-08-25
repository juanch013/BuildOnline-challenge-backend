import {Router} from "express";
import verifyToken from "../../../middlewares/authorization/authorization"
const notesRouter = Router();
import validateNumberParam from '../../../middlewares/validateNumberParam/validateNumberParam'
import listNoteFactory from "../controller/factories/listNotesFactory";

notesRouter.use(verifyToken)

notesRouter.get('/',validateNumberParam(['page','quantity']),listNoteFactory)
export default notesRouter;
