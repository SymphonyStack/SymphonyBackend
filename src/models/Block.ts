import { z } from "zod";

export const BlockSchema = z.object({
  id: z.number(),
  created_at: z.string().optional(),
  created_by: z
    .string()
    .min(1, { message: "Cannot have empty address of user." }),
  name: z.string(),
  description: z.string().optional(),
  location: z.string(),
  vcs_path: z.string(),
  params: z.any().optional(),
  startup_script: z.string().optional(),
  build_script: z.string().optional(),
});

export type Block = z.infer<typeof BlockSchema>;

export const createBlock = (block: Block) => {
  return Object.freeze({
    created_by: block.created_by,
    name: block.name,
    description: block.description,
    location: block.location,
    vcs_path: block.vcs_path,
    params: block.params,
    startup_script: z.string().optional(),
    build_script: z.string().optional(),
  });
};
