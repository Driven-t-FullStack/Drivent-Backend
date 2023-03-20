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
          name: true,
          startTime: true,
          endTime: true,
          UserOnActivity: true,
        },
      },
    },
  });
}

const activiesRepository = { findMany, findManyActivities };

export default activiesRepository;
