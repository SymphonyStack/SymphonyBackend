import { z } from "zod";

export const JobStatusSchema = z.object({
  id: z.number(),
  JobStatus_id: z.number(),
  timestamp: z.string(),
  status: z.string(),
  details: z.string(),
});

export type JobStatus = z.infer<typeof JobStatusSchema>;

export const createJobStatus = (jobStatus: JobStatus) => {
  return Object.freeze({
    JobStatus_id: jobStatus.JobStatus_id,
    timestamp: jobStatus.timestamp,
    status: jobStatus.status,
    details: jobStatus.details,
  });
};
