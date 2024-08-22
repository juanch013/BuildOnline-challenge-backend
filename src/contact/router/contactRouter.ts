import {Router} from "express";
import {validateDto} from '../../../middlewares/validateDto/validateDto'
import { CreateContactDto } from "../dtos/createContactDto";
import createContactFactory from "../controller/factories/createContactFactory";
import validateUuidParam from '../../../middlewares/validateUuidParam/validateUuidParam'
import getContactFactory from "../controller/factories/getContactFactory";

const contactRouter = Router();

contactRouter.post('/',validateDto(CreateContactDto),createContactFactory);
contactRouter.get('/:contactId',validateUuidParam("contactId"),getContactFactory);

export default contactRouter;
