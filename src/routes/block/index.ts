const express = require("express");
const router = express.router;

import {
  getBlockController,
  getBlocksByCreatorController,
  createBlockController,
  getAllBlocksController,
} from "../../controllers";

router.get("/:id", (req: any, res: any) => {
  res.send(getBlockController(req));
});

router.get("/", (req: any, res: any) => {
  res.send(getAllBlocksController(req));
});

router.post("/", (req: any, res: any) => {
  res.send(createBlockController(req));
});

router.get("/creator/:id", (req: any, res: any) => {
  res.send(getBlocksByCreatorController(req));
});

module.exports = router;
