import { Result, Flow, createFlow } from "../../models";
import {
  createFlowService,
  getAllFlowsService,
  getFlowService,
  getFlowByCreatorService,
  updateFlowService,
  deleteFlowService,
} from "../../services";
import { Request } from "express";

import dotenv from "dotenv";
dotenv.config();

export const createFlowController = async (
  req: Request,
): Promise<Result<Flow[] | string>> => {
  try {
    let input = req.body;
    const flow = createFlow(input) as Flow;
    return await createFlowService(flow);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const getFlowController = async (
  req: Request,
): Promise<Result<Flow[] | string>> => {
  try {
    const flow_id: string = req.params?.id;
    if (!flow_id || flow_id.length == 0 || isNaN(+flow_id)) {
      throw Error("No/Invalid flow_id found. flow_id:" + flow_id);
    }

    // TODO: check if auth needed for getting Flows
    // const typeOfAuthorization = req.headers.authorization?.split(" ")[0];
    // const accessToken = req.headers.authorization?.split(" ")[1];
    // if (!(typeOfAuthorization && accessToken)) {
    //   return { status: 400, data: "No access token found" };
    // }

    return await getFlowService(flow_id);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const getFlowsByCreatorController = async (
  req: Request,
): Promise<Result<Flow[] | string>> => {
  try {
    const created_by: string = req.params?.created_by;
    if (!created_by || created_by.length == 0) {
      throw Error("No/Invalid created_by found. created_by:" + created_by);
    }
    // TODO: check if auth needed for getting Flows
    // const typeOfAuthorization = req.headers.authorization?.split(" ")[0];
    // const accessToken = req.headers.authorization?.split(" ")[1];
    // if (!(typeOfAuthorization && accessToken)) {
    //   return { status: 400, data: "No access token found" };
    // }
    return await getFlowByCreatorService(created_by);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const getAllFlowsController = async (
  req: Request,
): Promise<Result<Flow[] | string>> => {
  try {
    // TODO: remove this
    console.log(req);
    // TODO: check if auth needed for getting Flows
    // const typeOfAuthorization = req.headers.authorization?.split(" ")[0];
    // const accessToken = req.headers.authorization?.split(" ")[1];
    // if (!(typeOfAuthorization && accessToken)) {
    //   return { status: 400, data: "No access token found" };
    // }

    return await getAllFlowsService();
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const deleteFlowController = async (
  req: Request,
): Promise<Result<string>> => {
  try {
    const flow_id = req.params.id;
    const flow = await getFlowService(flow_id);
    // // TODO: find a better way to do this. [ Using auth ]
    // if (flow.data[0].created_by != req.params.created_by) {
    //   console.log(flow);
    //   return {
    //     status: 404,
    //     data: "Current user doesn't own the flow.",
    //   };
    // }
    return await deleteFlowService(flow_id);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const updateFlowController = async (
  req: Request,
): Promise<Result<Flow[] | string>> => {
  try {
    const flow_id = req.params.id;
    let input = req.body;
    const old_flow = await getFlowService(flow_id);
    if (input.created_by != old_flow.data[0].created_by) {
      return {
        status: 404,
        data: "Current user doesn't own the flow.",
      };
    }
    const flow = createFlow(input);
    return await updateFlowService(flow_id, flow);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};
