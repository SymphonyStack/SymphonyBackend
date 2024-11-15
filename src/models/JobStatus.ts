import { z } from "zod";

export const JobStatusSchema = z.object({
  id: z.number(),
  flow_id: z.number(),
  timestamp: z.string(),
  status: z.string(),
  details: z.string(),
});

export type JobStatus = z.infer<typeof JobStatusSchema>;

export const createJobStatus = (jobStatus: JobStatus) => {
  return Object.freeze({
    flow_id: jobStatus.flow_id,
    timestamp: jobStatus.timestamp,
    status: jobStatus.status,
    details: jobStatus.details,
  });
};
