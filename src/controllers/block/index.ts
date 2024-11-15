import { Result, createBlock, Block } from "../../models";
import {
  createBlockService,
  getAllBlocksService,
  getBlockByCreatorService,
  getBlockService,
} from "../../services";
import { Request } from "express";

import dotenv from "dotenv";
dotenv.config();

export const createBlockController = async (
  req: Request,
): Promise<Result<Block[] | string>> => {
  try {
    let input = req.body;
    console.log(input);
    const block = createBlock(input) as Block;
    return await createBlockService(block);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const getBlockController = async (
  req: Request,
): Promise<Result<Block[] | string>> => {
  try {
    const block_id: string = req.params?.id;
    if (!block_id || block_id.length == 0 || !isNaN(+block_id)) {
      throw Error("No/Invalid block_id found. block_id:" + block_id);
    }

    // TODO: check if auth needed for getting blocks
    // const typeOfAuthorization = req.headers.authorization?.split(" ")[0];
    // const accessToken = req.headers.authorization?.split(" ")[1];
    // if (!(typeOfAuthorization && accessToken)) {
    //   return { status: 400, data: "No access token found" };
    // }

    return await getBlockService(block_id);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const getBlocksByCreatorController = async (
  req: Request,
): Promise<Result<Block[] | string>> => {
  try {
    const creator_address: string = req.params?.creator_address;
    if (!creator_address || creator_address.length == 0) {
      throw Error(
        "No/Invalid creator_address found. creator_address:" + creator_address,
      );
    }
    // TODO: check if auth needed for getting blocks
    // const typeOfAuthorization = req.headers.authorization?.split(" ")[0];
    // const accessToken = req.headers.authorization?.split(" ")[1];
    // if (!(typeOfAuthorization && accessToken)) {
    //   return { status: 400, data: "No access token found" };
    // }

    return await getBlockByCreatorService(creator_address);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const getAllBlocksController = async (
  req: Request,
): Promise<Result<Block[] | string>> => {
  try {
    // TODO: remove this
    console.log(req);
    // TODO: check if auth needed for getting blocks
    // const typeOfAuthorization = req.headers.authorization?.split(" ")[0];
    // const accessToken = req.headers.authorization?.split(" ")[1];
    // if (!(typeOfAuthorization && accessToken)) {
    //   return { status: 400, data: "No access token found" };
    // }

    return await getAllBlocksService();
  } catch (e: any) {
    return { status: 400, data: e };
  }
};
