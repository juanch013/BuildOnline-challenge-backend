import {Router} from "express";
import verifyToken from "../../../middlewares/authorization/authorization"
const notesRouter = Router();
import validateNumberParam from '../../../middlewares/validateNumberParam/validateNumberParam'
import listNoteFactory from "../controller/factories/listNotesFactory";
import validateUuidParam from "../../../middlewares/validateUuidParam/validateUuidParam";
import getNoteFactory from "../controller/factories/getNoteFactory";

notesRouter.use(verifyToken)

notesRouter.get('/',validateNumberParam(['page','quantity']),listNoteFactory)
notesRouter.get('/:noteId',validateUuidParam('noteId'),getNoteFactory)

export default notesRouter;
