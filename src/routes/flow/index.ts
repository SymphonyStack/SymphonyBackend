import express from "express";
export const flowRouter = express.Router();

import { makeCallback } from "../../utils";
import {
  createFlowController,
  getFlowController,
  getFlowsByCreatorController,
  getAllFlowsController,
  updateFlowController,
  deleteFlowController,
} from "../../controllers";

flowRouter.post("/", makeCallback(createFlowController));

flowRouter.get("/:id", makeCallback(getFlowController));

flowRouter.get("/", makeCallback(getAllFlowsController));

flowRouter.get(
  "/creator/:created_by",
  makeCallback(getFlowsByCreatorController),
);

flowRouter.patch("/:id", makeCallback(updateFlowController));

flowRouter.delete("/:id", makeCallback(deleteFlowController));

// module.exports = flowRouter;
