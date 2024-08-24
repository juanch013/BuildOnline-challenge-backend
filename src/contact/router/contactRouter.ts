import {Router} from "express";
import {validateDto} from '../../../middlewares/validateDto/validateDto'
import { CreateContactDto } from "../dtos/createContactDto";
import createContactFactory from "../controller/factories/createContactFactory";
import validateUuidParam from '../../../middlewares/validateUuidParam/validateUuidParam'
import getContactFactory from "../controller/factories/getContactFactory";
import updateContactFactory from "../controller/factories/updateContactFactory";
import verifyToken from "../../../middlewares/authorization/authorization"
import { UpdateContactDto } from "../dtos/updateContactDto";
import listContactFactory from "../controller/factories/listContactsFactory";
import validateNumberParam from "../../../middlewares/validateNumberParam/validateNumberParam"
const contactRouter = Router();

contactRouter.use(verifyToken)

contactRouter.post('/',validateDto(CreateContactDto),createContactFactory);
contactRouter.get('/',validateNumberParam(['quantity','page']),listContactFactory);
contactRouter.get('/:contactId',validateUuidParam("contactId"),getContactFactory);
contactRouter.put('/:contactId',validateUuidParam("contactId"),validateDto(UpdateContactDto),updateContactFactory);

export default contactRouter;
