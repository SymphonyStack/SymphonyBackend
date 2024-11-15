import express from "express";
import { runFlow } from "../../drivers/fullpull";
import { getFlowService } from "../../services";

export const executeRouter = express.Router();

executeRouter.post("/", async (req, res) => {
  console.log("EXEC body:", req.body);
  const flow_id = req.body.record.flow_id;
  const job_id = req.body.record.job_id;
  console.log("STARTING EXECUTION FOR: " + job_id);
  const flow_response = await getFlowService(flow_id);
  if (flow_response.status != 200) {
    console.log(flow_response);
    res.status(flow_response.status).send("Something went wrong");
  }
  runFlow(flow_response.data[0], job_id);
  res.status(200).send("Started working");
});
