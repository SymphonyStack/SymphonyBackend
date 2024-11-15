import simpleGit from "simple-git";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
import path from "path";
import fs from "fs/promises";
import rimraf from "rimraf";
import { Flow } from "models";
import { getBlockService } from "../services";

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

export async function runFlow(flow: Flow) {
  try {
    const block_sequence = flow.block_sequence;
    let inputs = flow.block_params;
    const context = {};
    for (let i = 0; i < block_sequence.length; i++) {
      const block_id = block_sequence[i];
      let input = inputs[i];
      const block_response = await getBlockService(block_id.toString());
      if (block_response.status != 200) {
        console.log(block_response);
        return {
          status: block_response.status,
          data: "Something went wrong while fetching data",
        };
      }
      const output = await cloneAndRun(
        block_response.data[0].vcs_path,
        input,
        context,
      );
      if (output.status != 200) {
        console.log(output);
        return {
          status: output.status,
          data: "Something went wrong while cloning and running.",
        };
      }
      input = output.message;
    }
    return {
      status: 200,
      // TODO: change this
      data: "Success",
    };
  } catch (error) {
    console.error(`Error: ${error}`);
    return { status: 500, error };
  }
}
