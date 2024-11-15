const express = require("express");
const router = express.router;

import { makeCallback } from "utils";
import {
  createFlowController,
  getFlowController,
  getFlowsByCreatorController,
  getAllFlowsController,
  updateFlowController,
  deleteFlowController,
} from "../../controllers";

router.post("/", makeCallback(createFlowController));

router.get("/:id", makeCallback(getFlowController));

router.get("/", makeCallback(getAllFlowsController));

router.get(
  "/creator/:creator_address",
  makeCallback(getFlowsByCreatorController),
);

router.patch("/:id", makeCallback(updateFlowController));

router.delete("/:id", makeCallback(deleteFlowController));

module.exports = router;
