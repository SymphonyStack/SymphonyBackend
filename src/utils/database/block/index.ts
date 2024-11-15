import { Block, Result } from "../../../models";

export const useBlockDb = (getDbClient: Function) => {
  async function getAll(): Promise<Result<Block[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance.from("Block").select();
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function findById(id: string): Promise<Result<Block[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance
        .from("Block")
        .select()
        .match({ id: id });
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function findByCreator(address: string): Promise<Result<Block[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance
        .from("Block")
        .select()
        .match({ created_by: address });
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function insertBlock(
    block: Pick<Block, Exclude<keyof Block, "id">>,
  ): Promise<Result<Block[]>> {
    try {
      const clientInstance = await getDbClient();
      console.log("HEH", block);
      const response = await clientInstance
        .from("Block")
        .insert(block)
        .select();
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  return Object.freeze({
    getAll,
    findById,
    findByCreator,
    insertBlock,
  });
};
