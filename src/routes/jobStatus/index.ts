const express = require("express");
const router = express.router;

import {
  createJobStatusController,
  getJobStatusController,
  getJobStatusesByStatusController,
  updateJobStatusController,
} from "../../controllers";

router.post("/", (req: any, res: any) => {
  res.send(createJobStatusController(req));
});

router.get("/:id", (req: any, res: any) => {
  res.send(getJobStatusController(req));
});

router.get("/status/:status", (req: any, res: any) => {
  res.send(getJobStatusesByStatusController(req));
});

router.patch("/:id", (req: any, res: any) => {
  res.send(updateJobStatusController(req));
});

module.exports = router;
