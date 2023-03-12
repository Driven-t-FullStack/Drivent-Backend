import { redis } from "@/config";
import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";

const HOURS_IN_SECONDS = 3600

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKey = "event";
  const cachedEvent = await redis.get(cacheKey);
  if (cachedEvent) {
    const typedCache: Event = JSON.parse(cachedEvent)
    return exclude(typedCache, "createdAt", "updatedAt")
  } else {
    const event = await eventRepository.findFirst();
    if (!event) throw notFoundError();
    redis.setEx(cacheKey, HOURS_IN_SECONDS, JSON.stringify(event));
    return exclude(event, "createdAt", "updatedAt");
  }
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
