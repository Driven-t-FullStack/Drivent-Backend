import { notFoundError, unauthorizedError } from "@/errors";
import activiesRepository from "@/repositories/activies-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hall, UserOnActivity } from "@prisma/client";

type activityVector = (Hall & {
  Activity: {
    name: string;
    startTime: Date;
    endTime: Date;
    isEnrolled?: boolean;
    UserOnActivity: UserOnActivity[];
  }[];
})[];

function checkUserEnrollmentOnActivity(vector: activityVector, userId: number) {
  vector.forEach((hall) =>
    hall.Activity.forEach((activity) =>
      activity.UserOnActivity.forEach((user) => {
        if (user.userId === userId) {
          activity.isEnrolled = true;
        } else {
          activity.isEnrolled = false;
        }
      }),
    ),
  );
}

async function validateGetActivtyRequest(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED") {
    throw unauthorizedError();
  }

  return ticket.TicketType.isRemote;
}

async function getActivitiesDates(userId: number) {
  const isRemote = await validateGetActivtyRequest(userId);

  const dates = await activiesRepository.findMany();

  return { isRemote, dates };
}

async function getActivities(userId: number, dateId: number) {
  await validateGetActivtyRequest(userId);

  const activities = await activiesRepository.findManyActivities(dateId);

  checkUserEnrollmentOnActivity(activities, userId);

  return activities;
}

const activitiesService = { getActivitiesDates, getActivities };

export default activitiesService;
