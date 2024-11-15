import { JobStatus, Result } from "../../../models";

export const useJobStatusDb = (getDbClient: Function) => {
  async function insertJobStatus(
    JobStatus: Pick<JobStatus, Exclude<keyof JobStatus, "id">>,
  ): Promise<Result<JobStatus[]>> {
    try {
      const clientInstance = await getDbClient();
      const response = await clientInstance
        .from("JobStatus")
        .insert(JobStatus)
        .select();
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function findById(id: string): Promise<Result<JobStatus[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance
        .from("JobStatus")
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

  async function findByStatus(status: string): Promise<Result<JobStatus[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance
        .from("JobStatus")
        .select()
        .match({ status: status });
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function updateJobStatus(
    id: string,
    JobStatus: Pick<JobStatus, Exclude<keyof JobStatus, "id">>,
  ): Promise<Result<JobStatus[]>> {
    try {
      const clientInstance = await getDbClient();
      const response = await clientInstance
        .from("JobStatus")
        .update({ ...JobStatus })
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

  return Object.freeze({
    insertJobStatus,
    updateJobStatus,
    findById,
    findByStatus,
  });
};
