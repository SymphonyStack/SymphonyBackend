const express = require("express");
const router = express.router;

import { makeCallback } from "utils";
import {
  getBlockController,
  getBlocksByCreatorController,
  createBlockController,
  getAllBlocksController,
} from "../../controllers";

router.get("/:id", makeCallback(getBlockController));

router.get(
  "/creator/:creator_address",
  makeCallback(getBlocksByCreatorController),
);

router.get("/", makeCallback(getAllBlocksController));

router.post("/", makeCallback(createBlockController));

module.exports = router;
