import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivies(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  try {
    const activies = await activitiesService.getActivities(userId);

    return res.status(httpStatus.OK).send(activies);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (err.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
