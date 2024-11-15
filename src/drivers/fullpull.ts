import simpleGit from "simple-git";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
import path from "path";
import fs from "fs/promises";

const exec = promisify(execCallback);
const git = simpleGit();

export async function cloneAndRun(repoUrl: string) {
  try {
    const repoUrl = "https://github.com/SymphonyStack/TestBlock.git"; // Replace with your repository URL
    // Get the repo name from the URL
    const repoName = repoUrl?.split("/")?.pop()?.split(".")[0] as string;
    // Check if the directory exists
    const dirExists = await fs
      .access(repoName)
      .then(() => true)
      .catch(() => false);

    if (dirExists) {
      // If the directory exists, remove it
      await fs.rm(repoName, { recursive: true, force: true });
      console.log(`Removed existing directory: ${repoName}`);
    }

    // Clone the repository
    await git.clone(repoUrl);
    console.log("Repository cloned successfully.");

    process.chdir(repoName);

    // Install dependencies
    const resInstall = await exec("npm install");
    console.log(`npm install output: ${resInstall.stdout}`);
    // Run npm run build
    const runRes = await exec("npm run build");
    console.log(`npm run build output: ${runRes.stdout}`);
    // Run npm start
    const resStart = await exec("npm start");
    console.log(`npm start output: ${resStart.stdout}`);
    //go back to the parent folder
    process.chdir("..");
    // Delete the repo folder
    await fs.rm(path.resolve(__dirname, repoName), {
      recursive: true,
      force: true,
    });
    console.log(`Removed directory: ${repoName}`);
    return { status: 200, message: "Edge function executed successfully" };
  } catch (error) {
    console.error(`Error: ${error}`);
    return { status: 500, error };
  }
}

// cloneAndRun();
