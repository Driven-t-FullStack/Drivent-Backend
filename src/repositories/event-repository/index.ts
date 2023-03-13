import { prisma } from "@/config";
import { redis } from "@/config";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";


const HOURS_IN_SECONDS = 3600


async function findFirst() {
  let event: Event = JSON.parse(await redis.get("event"));
  if (!event) {
    event = await prisma.event.findFirst();
    redis.setEx("event", HOURS_IN_SECONDS, JSON.stringify(event));
  }
  return exclude(event, "createdAt", "updatedAt");
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
