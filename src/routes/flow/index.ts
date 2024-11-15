const express = require("express");
const router = express.router;

import {
  createFlowController,
  getFlowController,
  getFlowsByCreatorController,
  getAllFlowsController,
  updateFlowController,
  deleteFlowController,
} from "../../controllers";

router.post("/", (req: any, res: any) => {
  res.send(createFlowController(req));
});

router.get("/:id", (req: any, res: any) => {
  res.send(getFlowController(req));
});

router.get("/", (req: any, res: any) => {
  res.send(getAllFlowsController(req));
});

router.get("/creator/:id", (req: any, res: any) => {
  res.send(getFlowsByCreatorController(req));
});

router.patch("/:id", (req: any, res: any) => {
  res.send(updateFlowController(req));
});

router.delete("/:id", (req: any, res: any) => {
  res.send(deleteFlowController(req));
});

module.exports = router;
