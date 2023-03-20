import { conflictError, notFoundError, unauthorizedError } from "@/errors";
import activiesRepository from "@/repositories/activies-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hall, UserOnActivity } from "@prisma/client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

type activityVector = (Hall & {
  Activity: {
    name: string;
    startTime: Date;
    endTime: Date;
    isEnrolled?: boolean;
    UserOnActivity: UserOnActivity[];
  }[];
})[];

type rangeTime = {
  startTime: Date;
  endTime: Date;
};

function checkUserEnrollmentOnActivity(vector: activityVector, userId: number) {
  vector.forEach((hall) =>
    hall.Activity.forEach((activity) => {
      if (activity.UserOnActivity.length === 0) {
        activity.isEnrolled = false;
      } else {
        activity.UserOnActivity.forEach((user) => {
          if (user.userId === userId) {
            activity.isEnrolled = true;
          } else if (user.userId !== userId && activity.isEnrolled !== true) {
            activity.isEnrolled = false;
          }
        });
      }
    }),
  );
}

function checkConflictInRangeTime(activityToBeEnrolledObject: rangeTime, userActivityEnrolledObject: rangeTime) {
  const rangeTimeOne = { start: activityToBeEnrolledObject.startTime, end: activityToBeEnrolledObject.endTime };
  const rangeTimeTwo = { start: userActivityEnrolledObject.startTime, end: userActivityEnrolledObject.endTime };

  const isThereConflict =
    dayjs(rangeTimeOne.start).isBetween(rangeTimeTwo.start, rangeTimeTwo.end) ||
    dayjs(rangeTimeOne.end).isBetween(rangeTimeTwo.start, rangeTimeTwo.end) ||
    dayjs(rangeTimeTwo.start).isBetween(rangeTimeOne.start, rangeTimeOne.end) ||
    dayjs(rangeTimeTwo.end).isBetween(rangeTimeOne.start, rangeTimeOne.end);

  if (isThereConflict) {
    throw conflictError("Você já está cadastrado em um evento neste horário!");
  }
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

async function postEnrollmentOnActivity(userId: number, activityId: number) {
  const activity = await activiesRepository.findActivityById(activityId);

  if (!activity) {
    throw notFoundError();
  }

  const userActivity = await activiesRepository.findUserActivities(userId);

  userActivity.forEach((object) => {
    checkConflictInRangeTime(
      { startTime: activity.startTime, endTime: activity.endTime },
      { startTime: object.Activity.startTime, endTime: object.Activity.endTime },
    );
  });

  await activiesRepository.createEnrollmentOnActivity(userId, activityId);
}

const activitiesService = { getActivitiesDates, getActivities, postEnrollmentOnActivity };

export default activitiesService;
