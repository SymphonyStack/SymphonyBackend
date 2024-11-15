import { Result, JobStatus, createJobStatus } from "../../models";
import {
  createJobStatusService,
  getJobByStatusService,
  getJobStatusService,
  updateJobStatusService,
} from "../../services";
import { Request } from "express";

import dotenv from "dotenv";
dotenv.config();

export const createJobStatusController = async (
  req: Request,
): Promise<Result<JobStatus[] | string>> => {
  try {
    let input = req.body;
    const jobStatus = createJobStatus(input) as JobStatus;
    return await createJobStatusService(jobStatus);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const getJobStatusController = async (
  req: Request,
): Promise<Result<JobStatus[] | string>> => {
  try {
    const jobStatus_id: string = req.params?.id;
    if (!jobStatus_id || jobStatus_id.length == 0 || isNaN(+jobStatus_id)) {
      throw Error(
        "No/Invalid jobStatus_id found. jobStatus_id:" + jobStatus_id,
      );
    }

    // TODO: check if auth needed for getting JobStatus
    // const typeOfAuthorization = req.headers.authorization?.split(" ")[0];
    // const accessToken = req.headers.authorization?.split(" ")[1];
    // if (!(typeOfAuthorization && accessToken)) {
    //   return { status: 400, data: "No access token found" };
    // }

    return await getJobStatusService(jobStatus_id);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const getJobStatusesByStatusController = async (
  req: Request,
): Promise<Result<JobStatus[] | string>> => {
  try {
    const status: string = req.params?.status;
    if (!status || status.length == 0) {
      throw Error("No/Invalid status found. status:" + status);
    }
    // TODO: check if auth needed for getting JobStatuses
    // const typeOfAuthorization = req.headers.authorization?.split(" ")[0];
    // const accessToken = req.headers.authorization?.split(" ")[1];
    // if (!(typeOfAuthorization && accessToken)) {
    //   return { status: 400, data: "No access token found" };
    // }

    return await getJobByStatusService(status);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};

export const updateJobStatusController = async (
  req: Request,
): Promise<Result<JobStatus[] | string>> => {
  try {
    const job_status_id = req.params.id;
    let input = req.body;
    // TODO: need to add access control here
    const jobStatus = createJobStatus(input);
    return await updateJobStatusService(job_status_id, jobStatus);
  } catch (e: any) {
    return { status: 400, data: e };
  }
};
