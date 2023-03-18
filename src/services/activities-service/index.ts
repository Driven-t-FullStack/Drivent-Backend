import { notFoundError, unauthorizedError } from "@/errors";
import activiesRepository from "@/repositories/activies-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function validateGetActivtyRequest(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED") {
    throw unauthorizedError();
  }

  return ticket.TicketType.isRemote;
}

async function getActivities(userId: number) {
  const ticketType = await validateGetActivtyRequest(userId);

  const activities = await activiesRepository.findMany();

  return { ticketType, activities };
}

const activitiesService = { getActivities };

export default activitiesService;
