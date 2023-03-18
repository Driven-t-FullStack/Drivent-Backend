import { prisma } from "@/config";

async function findMany() {
  return prisma.activityDate.findMany({});
}

const activiesRepository = { findMany };

export default activiesRepository;
