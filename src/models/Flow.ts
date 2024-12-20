import { z } from "zod";

export const FlowSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  trigger_type: z.string().optional(),
  trigger_condition: z.string().optional(),
  block_sequence: z.array(z.number()),
  block_params: z.array(z.any()),
  created_by: z.string(),
});

export type Flow = z.infer<typeof FlowSchema>;

export const createFlow = (flow: Flow) => {
  return Object.freeze({
    name: flow.name,
    description: flow.description,
    trigger_type: flow.trigger_type,
    trigger_condition: flow.trigger_condition,
    block_sequence: flow.block_sequence,
    block_params: flow.block_params,
    created_by: flow.created_by,
  });
};
