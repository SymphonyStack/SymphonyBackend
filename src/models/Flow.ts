import { z } from "zod";

export const FlowSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  trigger_type: z.string(),
  trigger_condition: z.string(),
  block_sequence: z.array(z.number()),
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
    created_by: flow.created_by,
  });
};
