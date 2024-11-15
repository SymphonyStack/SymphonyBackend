import { Router } from "express";
export const jobStatusRouter = Router();

import { makeCallback } from "../../utils";
import {
  createJobStatusController,
  getJobStatusController,
  getJobStatusesByStatusController,
  updateJobStatusController,
} from "../../controllers";

jobStatusRouter.post("/", makeCallback(createJobStatusController));

jobStatusRouter.get("/:id", makeCallback(getJobStatusController));

jobStatusRouter.get(
  "/status/:status",
  makeCallback(getJobStatusesByStatusController),
);

jobStatusRouter.patch("/:id", makeCallback(updateJobStatusController));

// module.exports = jobStatusRouter;
