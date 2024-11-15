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

router.get("/creator/:creator_address", (req: any, res: any) => {
  res.send(getBlocksByCreatorController(req));
});

router.get("/", (req: any, res: any) => {
  res.send(getAllBlocksController(req));
});

router.post("/", (req: any, res: any) => {
  res.send(createBlockController(req));
});

module.exports = router;
