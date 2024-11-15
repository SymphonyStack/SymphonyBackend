import { JobStatus, Result } from "../../models";
import { useJobStatusDbClient } from "../../utils/database";

export const createJobStatusService = async (
  jobStatus: Pick<JobStatus, Exclude<keyof JobStatus, "id">>,
): Promise<Result<JobStatus[]>> => {
  const response = await useJobStatusDbClient.insertJobStatus(jobStatus);
  return { status: response.status, data: response.data };
};

export const getJobStatusService = async (
  id: string,
): Promise<Result<JobStatus[]>> => {
  const response = await useJobStatusDbClient.findById(id);
  return { status: response.status, data: response.data };
};

export const getJobByStatusService = async (
  status: string,
): Promise<Result<JobStatus[]>> => {
  const response = await useJobStatusDbClient.findByStatus(status);
  return { status: response.status, data: response.data };
};

export const updateJobStatusService = async (
  id: string,
  jobStatus: Pick<JobStatus, Exclude<keyof JobStatus, "id">>,
): Promise<Result<JobStatus[]>> => {
  const response = await useJobStatusDbClient.updateJobStatus(id, jobStatus);
  return { status: response.status, data: response.data };
};
