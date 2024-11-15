import { Block, Result } from "../../models";
import { useBlockDbClient } from "../../utils/database";

export const createBlockService = async (
  block: Pick<Block, Exclude<keyof Block, "id">>,
): Promise<Result<Block[]>> => {
  const response = await useBlockDbClient.insertBlock(block);
  return { status: response.status, data: response.data };
};

export const getBlockService = async (id: string): Promise<Result<Block[]>> => {
  const response = await useBlockDbClient.findById(id);
  return { status: response.status, data: response.data };
};

export const getBlockByCreatorService = async (
  address: string,
): Promise<Result<Block[]>> => {
  const response = await useBlockDbClient.findByCreator(address);
  return { status: response.status, data: response.data };
};

export const getAllBlocksService = async (): Promise<Result<Block[]>> => {
  const response = await useBlockDbClient.getAll();
  return { status: response.status, data: response.data };
};
