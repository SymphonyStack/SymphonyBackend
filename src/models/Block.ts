import { z } from "zod";

export const BlockSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  created_by: z
    .string()
    .min(1, { message: "Cannot have empty address of user." }),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  vcs_path: z.string(),
  params: z.any(),
});

export type Block = z.infer<typeof BlockSchema>;

export const createBlock = (block: Block) => {
  return Object.freeze({
    name: block.name,
    description: block.description,
    location: block.location,
    vcs_path: block.vcs_path,
  });
};
