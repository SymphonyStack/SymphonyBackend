import { NodeVM, VMScript } from "vm2";
import fs from "fs/promises";
import path from "path";

// Ensure __dirname points to the directory of index.ts
const baseDir = path.resolve(__dirname, "../../");

export async function execute(metadata: any) {
  const steps: any[] = metadata.steps;

  let currentInput = {};

  for (const step of steps) {
    currentInput = await executeLocalFile(step.functionName, currentInput);
  }

  return currentInput;
}

export async function executeLocalFile(filePath: string, payload: any) {
  try {
    // Resolve the file path relative to the base directory
    const resolvedPath = path.resolve(baseDir, filePath);

    // Read the file content
    const fileContent = await fs.readFile(resolvedPath, "utf-8");
    console.log("File content:", fileContent);

    // Create a script from the file content
    const script = new VMScript(fileContent, resolvedPath);

    // Execute the file content using NodeVM
    const vm = new NodeVM({
      console: "inherit",
      sandbox: { payload }, // Pass the payload to the sandbox
      require: {
        external: true,
        builtin: ["*"],
        root: baseDir,
      },
    });

    // Run the script in the VM
    const scriptModule = vm.run(script);
    console.log("Script module:", scriptModule);

    // if (!scriptModule || typeof scriptModule.run !== "function") {
    //   throw new Error(`The script does not export a 'run' function`);
    // }

    const result = scriptModule.run(payload);

    console.log("Local function executed successfully", result);
    return result;
  } catch (error) {
    console.error(`Error executing local file ${filePath}:`, error);
    throw error;
  }
}
