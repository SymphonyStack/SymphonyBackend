import { Flow, Result } from "../../../models";

export const useFlowDb = (getDbClient: Function) => {
  async function insertFlow(
    flow: Pick<Flow, Exclude<keyof Flow, "id">>,
  ): Promise<Result<Flow[]>> {
    try {
      const clientInstance = await getDbClient();
      const response = await clientInstance.from("Flow").insert(flow).select();
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function getAll(): Promise<Result<Flow[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance.from("Flow").select();
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function findById(id: string): Promise<Result<Flow[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance
        .from("Flow")
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

  async function updateFlow(
    id: string,
    flow: Pick<Flow, Exclude<keyof Flow, "id">>,
  ): Promise<Result<Flow[]>> {
    try {
      const clientInstance = await getDbClient();
      const response = await clientInstance
        .from("Flow")
        .update({ ...flow })
        .eq("id", id)
        .select();
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function deleteFlow(id: string): Promise<Result> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance.from("Flow").delete().eq("id", id);
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  return Object.freeze({
    insertFlow,
    updateFlow,
    getAll,
    findById,
    deleteFlow,
  });
};
