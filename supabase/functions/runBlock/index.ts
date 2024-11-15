/**
 * A Lambda function that returns a string.
 */

export const helloFromLambdaHandler = async () => {
  console.log("1");
  import { createClient } from "@supabase/supabase-js";
  import { NodeVM } from "vm2";
  console.log("2");
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    // Fetch the index.js file from Supabase Storage
    const { data, error } = await supabase.storage
      .from("blocks")
      .download("index.js");

    if (error) {
      console.error(error);
      throw error;
    }

    // Read the file content
    const fileContent = await data.text();

    // Execute the file content using vm2
    const vm = new NodeVM({
      sandbox: {},
    });
    const script = new vm.Script(fileContent);
    const context = vm.createContext();
    script.runInContext(context);

    // Call the run function from the script
    const result = context.run();

    return {
      status: 200,
      message: "Edge function executed successfully",
      result,
    };
  } catch (error) {
    console.error("Error executing edge function:", error);
    return { status: 500, error };
  }
};
