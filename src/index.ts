/*
======================================================
This is the entry point for the application.
It is responsible for setting up the application
and starting the server.

Please use #TODO comments to mark areas that need
to be changed or improved.

======================================================
*/

if (process.env.NODE_ENV === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

import express, { Express, Request, Response } from "express";
import cors from "cors";
import {
  blockRouter,
  executeRouter,
  flowRouter,
  jobStatusRouter,
} from "../src/routes";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// for testing purposes, allow all origins
// #TODO: Remove this in production
app.use(
  cors({
    origin: "*",
  })
);

// ========================================
//                routing
// ========================================

// ========================================
//                health check
// ========================================

app.get("/health", (_, res) => {
  res.status(200).send("OK");
});

// ========================================
//              error handling
// ========================================

app.use((err: any, _: Request, res: Response, __: any) => {
  console.error(err);
  res.status(err.status || 500).end(err.message);
});

app.use("/block", blockRouter);
app.use("/flow", flowRouter);
app.use("/job_status", jobStatusRouter);
app.use("/execute", executeRouter);

// ========================================
//              start server
// ========================================

import { cloneAndRun } from "./drivers/fullpull";
app.get("/driver", async (req, res) => {
  const repoUrl =
    "https://github.com/SymphonyStack/message-to-telegram-bot.git";
  const context = {};
  const data = {
    args: {
      telegram_api_token: "8138744738:AAG8E8Ey5mLj-fHryKfOrYekY7K7AYL_tQE",
      recipient_id: "-1002421881674",
      message:
        "Hello my name is Loca and I am a little pug. I live in Belfast Ireland and my favorite things a hug. I love to eat roast chicken and my friends say I am lot fun but one thing that I cannot do is, I can't heckin run...",
    },
    startup_script: "node main.js ",
  };
  const response = await cloneAndRun(repoUrl, data, context);
  console.log("Edge function response:", response);
  return res.status(500).send({ message: "Error executing edge function" });
});

const port = process.env.PORT || 8081;

try {
  app.listen(port, () => {
    console.log("App listening on port " + port);
  });
} catch (error) {
  console.log(error);
  console.error("Error occurred while starting the server:", error);
}
