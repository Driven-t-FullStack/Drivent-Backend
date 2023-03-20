import { getActivities, getActivitiesDates, postUserActivities } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getActivitiesDates)
  .get("/:dateId", getActivities)
  .post("/", postUserActivities);

export { activitiesRouter };
