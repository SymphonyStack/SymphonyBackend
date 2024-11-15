import { Flow, Result } from "../../models";
import { useFlowDbClient } from "../../utils/database";

export const createFlowService = async (
  flow: Pick<Flow, Exclude<keyof Flow, "id">>,
): Promise<Result<Flow[]>> => {
  const response = await useFlowDbClient.insertFlow(flow);
  return { status: response.status, data: response.data };
};

export const getFlowService = async (id: string): Promise<Result<Flow[]>> => {
  const response = await useFlowDbClient.findById(id);
  return { status: response.status, data: response.data };
};

export const getAllFlowsService = async (): Promise<Result<Flow[]>> => {
  const response = await useFlowDbClient.getAll();
  return { status: response.status, data: response.data };
};

export const getFlowByCreatorService = async (
  address: string,
): Promise<Result<Flow[]>> => {
  const response = await useFlowDbClient.findByCreator(address);
  return { status: response.status, data: response.data };
};

export const updateFlowService = async (
  id: string,
  flow: Pick<Flow, Exclude<keyof Flow, "id">>,
): Promise<Result<Flow[]>> => {
  const response = await useFlowDbClient.updateFlow(id, flow);
  return { status: response.status, data: response.data };
};

export const deleteFlowService = async (id: string): Promise<Result> => {
  const response = await useFlowDbClient.deleteFlow(id);
  if (response.status === 204) {
    response.status = 200; // This so that we get some response content on the api request
    response.data = "Deleted record successfully.";
  }
  return { status: response.status, data: response.data };
};
