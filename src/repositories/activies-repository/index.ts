import { prisma } from "@/config";

async function findMany() {
  return prisma.activityDate.findMany({});
}

async function findManyActivities(dateId: number) {
  return prisma.hall.findMany({
    include: {
      Activity: {
        where: {
          activityDateId: dateId,
        },
        select: {
          id: true,
          name: true,
          startTime: true,
          endTime: true,
          UserOnActivity: true,
        },
      },
    },
  });
}

async function createEnrollmentOnActivity(userId: number, activityId: number) {
  return prisma.userOnActivity.create({
    data: {
      userId,
      activityId,
    },
  });
}

async function findActivityById(activityId: number) {
  return prisma.activity.findUnique({
    where: {
      id: activityId,
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });
}

async function findUserActivities(userId: number) {
  return prisma.userOnActivity.findMany({
    where: {
      userId,
    },
    select: {
      Activity: {
        select: {
          endTime: true,
          startTime: true,
        },
      },
    },
  });
}

const activiesRepository = {
  findMany,
  findManyActivities,
  createEnrollmentOnActivity,
  findActivityById,
  findUserActivities,
};

export default activiesRepository;
