import simpleGit from "simple-git";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
import path from "path";
import fs from "fs/promises";
import rimraf from "rimraf";

const exec = promisify(execCallback);
const git = simpleGit();

const reposDir = path.resolve(__dirname, "../../", "repos");

export async function cloneAndRun(repoUrl: string, data: any, context: any) {
  try {
    const repoUrl = "https://github.com/SymphonyStack/TestBlock.git"; // Replace with your repository URL
    // Get the repo name from the URL
    const repoName = repoUrl?.split("/")?.pop()?.split(".")[0] as string;
    const localPath = path.resolve(reposDir, repoName);
    // Ensure the repos directory exists
    await fs.mkdir(reposDir, { recursive: true });

    // Check if the directory exists
    const dirExists = await fs
      .access(localPath)
      .then(() => true)
      .catch(() => false);

    if (dirExists) {
      // If the directory exists, remove it
      await fs.rm(localPath, { recursive: true, force: true });
      console.log(`Removed existing directory: ${localPath}`);
    }

    // Clone the repository into the repos folder
    await git.clone(repoUrl, localPath);
    console.log("Repository cloned successfully.");

    process.chdir(localPath);

    // Install dependencies
    const resInstall = await exec("npm install");
    console.log(`npm install output: ${resInstall.stdout}`);
    // Run npm run build
    const runRes = await exec("npm run build");
    console.log(`npm run build output: ${runRes.stdout}`);
    // Run npm start
    const resStart = await exec("npm start");
    console.log(`npm start output: ${resStart.stdout}`);
    return { status: 200, message: "Edge function executed successfully" };
  } catch (error) {
    console.error(`Error: ${error}`);
    return { status: 500, error };
  }
}

export async function runFlow(metadata: any) {
  try {
    const steps: any[] = metadata.steps;

    let currentInput = {};
    const context = metadata.context;

    for (const step of steps) {
      currentInput = await cloneAndRun(
        step.functionName,
        currentInput,
        context
      );
    }

    return currentInput;
  } catch (error) {
    console.error(`Error: ${error}`);
    return { status: 500, error };
  }
}
