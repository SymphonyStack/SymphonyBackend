import express from "express";
import { runFlow } from "../../drivers/fullpull";
import { getFlowService } from "../../services";

export const executeRouter = express.Router();

executeRouter.post("/", async (req, res) => {
  const flow_id = req.body.flow_id;
  const flow_response = await getFlowService(flow_id);
  if (flow_response.status != 200) {
    console.log(flow_response);
    res.status(flow_response.status).send("Something went wrong");
  }
  runFlow(flow_response.data[0]);
  res.status(200).send("Started working");
});
