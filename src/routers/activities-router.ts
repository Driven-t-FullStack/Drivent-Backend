import { getActivies } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter.all("/*", authenticateToken).get("/", getActivies);

export { activitiesRouter };
