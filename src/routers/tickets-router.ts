import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTicketTypes, getTickets, createTicket, createTicketType } from "@/controllers";
import { createTicketTypeSchema } from "@/schemas";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("", getTickets)
  .post("", createTicket)
  .post("/types", validateBody(createTicketTypeSchema), createTicketType);

export { ticketsRouter };
