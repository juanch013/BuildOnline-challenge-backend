import {Router} from "express";
import {validateDto} from '../../../middlewares/validateDto/validateDto'
import { CreateContactDto } from "../dtos/createContactDto";
import createContactFactory from "../controller/factories/createContactFactory";
import validateUuidParam from '../../../middlewares/validateUuidParam/validateUuidParam'
import getContactFactory from "../controller/factories/getContactFactory";
import updateContactFactory from "../controller/factories/updateContactFactory";
import verifyToken from "../../../middlewares/authorization/authorization"
import { UpdateContactDto } from "../dtos/updateContactDto";

const contactRouter = Router();

contactRouter.use(verifyToken)

contactRouter.post('/',validateDto(CreateContactDto),createContactFactory);
contactRouter.get('/:contactId',validateUuidParam("contactId"),getContactFactory);
contactRouter.put('/:contactId',validateUuidParam("contactId"),validateDto(UpdateContactDto),updateContactFactory);

export default contactRouter;
