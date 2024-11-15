const express = require("express");
const router = express.router;

import { makeCallback } from "utils";
import {
  createJobStatusController,
  getJobStatusController,
  getJobStatusesByStatusController,
  updateJobStatusController,
} from "../../controllers";

router.post("/", makeCallback(createJobStatusController));

router.get("/:id", makeCallback(getJobStatusController));

router.get("/status/:status", makeCallback(getJobStatusesByStatusController));

router.patch("/:id", makeCallback(updateJobStatusController));

module.exports = router;
