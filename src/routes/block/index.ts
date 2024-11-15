import { makeCallback } from "../../utils";
import {
  getBlockController,
  getBlocksByCreatorController,
  createBlockController,
  getAllBlocksController,
} from "../../controllers";

import express from "express";
export const blockRouter = express.Router();

blockRouter.get("/:id", makeCallback(getBlockController));

blockRouter.get(
  "/creator/:creator_address",
  makeCallback(getBlocksByCreatorController),
);

blockRouter.get("/", makeCallback(getAllBlocksController));

blockRouter.post("/", makeCallback(createBlockController));

// module.exports = blockRouter;
