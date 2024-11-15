// watcher.js
import supabase from "../supabaseClient";

export const channel = supabase
  .channel("supabase_realtime")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
    },
    async (payload: any) => {
      console.log(payload);
    },
  )
  .subscribe();
