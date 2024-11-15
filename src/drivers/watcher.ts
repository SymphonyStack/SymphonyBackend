// watcher.js
import supabase from "../supabaseClient";

const channel = supabase
  .channel("schema-db-changes")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
    },
    async (payload: any) => {
      console.log(payload);
      // Call the Edge Function
      const response = await fetch(
        "https://rqijumoyzpknxedozdun.supabase.co/functions/v1/runBlock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log("Lambda function response:", data);
    }
  )
  .subscribe();
