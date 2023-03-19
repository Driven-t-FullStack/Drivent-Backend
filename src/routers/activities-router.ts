import { getActivities, getActivitiesDates } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter.all("/*", authenticateToken).get("/", getActivitiesDates).get("/:dateId", getActivities);

export { activitiesRouter };
