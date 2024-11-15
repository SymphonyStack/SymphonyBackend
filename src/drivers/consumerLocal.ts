import { NodeVM } from "vm2";
import supabase from "../supabaseClient";
import { createClient } from "@supabase/supabase-js";

export async function execute(metadata: any) {
  const steps: any[] = metadata.steps;

  let currentInput = {};

  for (const step of steps) {
    currentInput = await executeLocalFile(step.functionName, currentInput);
  }

  return currentInput;
}

export async function executeLocalFile(fileName: string, payload: any) {
  try {
    // Fetch the file from Supabase Storage
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string
    );
    const { data, error } = await supabase.storage
      .from("blocks")
      .download(fileName);

    if (error) {
      throw error;
    }

    // Read the file content
    const fileContent = await data.text();

    // Execute the file content using NodeVM
    const vm = new NodeVM({
      console: "inherit",
      sandbox: { payload }, // Pass the payload to the sandbox
      require: {
        external: true,
        builtin: ["*"],
      },
    });

    // Load the script and execute the run function
    const script = vm.run(fileContent, fileName);
    const result = script.run();

    console.log("Local function executed successfully", result);
    return result;
  } catch (error) {
    console.error(`Error executing local file ${fileName}:`, error);
    throw error;
  }
}
