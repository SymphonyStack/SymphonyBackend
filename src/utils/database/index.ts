import { createClient } from "@supabase/supabase-js";
import { useBlockDb } from "./block";
import { useFlowDb } from "./flow";
import { useJobStatusDb } from "./jobStatus";

import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

export const createDbClient = () => {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
  });
};

export const useBlockDbClient = useBlockDb(createDbClient);
export const useFlowDbClient = useFlowDb(createDbClient);
export const useJobStatusDbClient = useJobStatusDb(createDbClient);
