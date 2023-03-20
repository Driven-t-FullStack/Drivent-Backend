import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivitiesDates(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  try {
    const data = await activitiesService.getActivitiesDates(userId);

    return res.status(httpStatus.OK).send(data);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (err.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const dateId = Number(req.params.dateId);
  try {
    const activities = await activitiesService.getActivities(userId, dateId);

    return res.status(httpStatus.OK).send(activities);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (err.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

export async function postUserActivities(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const activityId = req.body.activityId;

  if (!activityId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  try {
    await activitiesService.postEnrollmentOnActivity(userId, Number(activityId));

    return res.sendStatus(httpStatus.OK);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (err.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (err.name === "ConflictError") {
      return res.status(httpStatus.CONFLICT).send({ message: err.message });
    }
  }
}
