import { CreateTicketTypeParams } from "@/services/tickets-service";
import Joi from "joi";

export const createTicketTypeSchema = Joi.object<CreateTicketTypeParams>({
    price: Joi.number().required(),
    name: Joi.string().required(),
    isRemote: Joi.boolean().required(),
    includesHotel: Joi.boolean().required()
});
