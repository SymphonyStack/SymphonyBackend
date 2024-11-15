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
import supabase from "./supabaseClient.js";

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

// ========================================
//              start server
// ========================================

const port = process.env.PORT || 8081;

try {
  app.listen(port, () => {
    console.log("App listening on port " + port);
  });
} catch (error) {
  console.log(error);
  console.error("Error occurred while starting the server:", error);
}
