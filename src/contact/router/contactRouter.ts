import {Router} from "express";
import {validateDto} from '../../../middlewares/validateDto/validateDto'
import { CreateContactDto } from "../dtos/createContactDto";
import createContactFactory from "../controller/factories/createContactFactory";
const contactRouter = Router();

contactRouter.post('/',validateDto(CreateContactDto),createContactFactory);

export default contactRouter;