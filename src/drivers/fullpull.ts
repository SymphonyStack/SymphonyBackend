import simpleGit from "simple-git";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
import path from "path";
import fs from "fs/promises";
import { Flow } from "models";
import { getBlockService, updateJobStatusService } from "../services";

const exec = promisify(execCallback);
const git = simpleGit();

const reposDir = path.resolve(__dirname, "../../", "repos");
const DELIMITER = process.env.DELIMITER ?? "";

export async function cloneAndRun(repoUrl: string, data: any, context: any) {
  try {
    console.log("STARTING CLONE");
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

    console.log("STARTING INSTALL");
    // Install dependencies
    const resInstall = await exec("npm install");
    console.log(`npm install output: ${resInstall.stdout}`);
    // Run npm run build
    const runRes = await exec("npm run build");
    console.log(`npm run build output: ${runRes.stdout}`);
    // Run npm start
    const resStart = await exec("npm start");
    console.log(`npm start output: ${resStart.stdout}`);
    const mySubString = resStart.stdout.substring(
      resStart.stdout.indexOf(DELIMITER) + 1,
      resStart.stdout.lastIndexOf(DELIMITER),
    );
    return { status: 200, message: mySubString };
  } catch (error) {
    console.error(`Error: ${error}`);
    return { status: 500, error };
  }
}

export async function runFlow(flow: Flow, job_id: string) {
  try {
    const block_sequence = flow.block_sequence;
    let inputs = flow.block_params;
    const context = {};
    for (let i = 0; i < block_sequence.length; i++) {
      const block_id = block_sequence[i];
      let input = {};
      if (inputs && i < inputs.length) {
        if (input) {
          // Replace default values with the values from prev block
          const temp = { ...input };
          input = inputs[i];
          for (const key in temp) {
            input[key] = temp[key];
          }
        } else {
          input = inputs[i];
        }
      }
      const block_response = await getBlockService(block_id.toString());
      if (block_response.status != 200 || block_response.data.length == 0) {
        console.log(block_response);
        return {
          status: block_response.status,
          data: "Something went wrong while fetching data",
        };
      }
      console.log(block_response);
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
      // Output of the current block is the input to the next block
      if (output.message) {
        input = JSON.parse(output.message);
      } else {
        input = {};
      }
    }
    updateJobStatusService(job_id, { flow_id: flow.id, status: "SUCCESS" });
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
