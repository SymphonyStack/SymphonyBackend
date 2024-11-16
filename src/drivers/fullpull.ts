import simpleGit from "simple-git";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
import path from "path";
import fs from "fs/promises";
import { Flow } from "models";
import { getBlockService, updateJobStatusService } from "../services";
import { forEach } from "lodash";

const exec = promisify(execCallback);
const git = simpleGit();

const reposDir = path.resolve(__dirname, "../../", "repos");
const DELIMITER = process.env.DELIMITER ?? "";

export async function cloneAndRun(repoUrl: string, data: any, context: any) {
  try {
    console.log("STARTING CLONE: ", repoUrl);
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
    console.log("DATA: ", data);
    // Install dependencies
    const resInstall = await exec("npm install --legacy-peer-deps");
    console.log(`npm install output: ${resInstall.stdout}`);
    // Run npm run build
    if (data.build_script) {
      const runRes = await exec(data.build_script);
      console.log(`npm run build output: ${runRes.stdout}`);
    } else {
      console.log("Skipping build step ");
    }
    // Run npm start
    const values = data.args
      ? Object.values(data.args).map((value) => `"${value}"`)
      : [];

    console.log("VALUES: ", values);
    const command = `${data.startup_script || "npm run dev"} -- ${values.join(
      " "
    )}`;
    console.log(`Executing command: ${command}`);
    const resStart = await exec(command);
    console.log(`npm start output: ${resStart.stdout}`);
    const modifiedOutput = resStart.stdout.substring(
      resStart.stdout.indexOf(DELIMITER) + 2,
      resStart.stdout.lastIndexOf(DELIMITER)
    );
    console.log(`MOFIFIED_OUTPUT for ${repoName}: ${modifiedOutput}`);

    //delete the folder
    // await fs.rm(localPath, { recursive: true, force: true });
    // console.log(`Removed directory: ${localPath}`);
    return { status: 200, message: modifiedOutput };
  } catch (error) {
    console.error(`Error: ${error}`);
    return { status: 500, error };
  }
}

export async function runFlow(flow: Flow, job_id: string) {
  try {
    updateJobStatusService(job_id, { flow_id: flow.id, status: "RUNNING" });
    const block_sequence = flow.block_sequence;
    // Default params for blocks
    let inputs = flow.block_params;
    console.log("INPUTS:", inputs);
    let context = {};
    let ordered_input = {};
    for (let i = 0; i < block_sequence.length; i++) {
      const block_id = block_sequence[i];

      const block_response = await getBlockService(block_id.toString());
      if (block_response.status != 200 || block_response.data.length == 0) {
        console.log(block_response);
        return {
          status: block_response.status,
          data: "Something went wrong while fetching data",
        };
      }
      console.log(block_response);

      const block_params = block_response.data[0].params;

      let input = {};
      if (inputs && i < inputs.length) {
        input = inputs[i];
        if (inputs[i].type == "transformer") {
          input = context;
        } else if (context) {
          for (let key in input) {
            console.log("KEY: ", key);
            // Using context replace string keys between {{ and }} with values from context
            const matches = input[key].match(/{{(\w*\s*)*}}/g);
            console.log("MATCHES: ", matches);
            if (!matches) {
              continue;
            }
            for (let temp of matches) {
              const newKey = temp.substring(2, temp.length - 2).trim();
              console.log("NEWKEY: ", newKey);
              console.log("TEMP: ", temp);
              input[key] = input[key].replaceAll(temp, context[newKey]);
            }
          }
        }
        // console.log("CONTEXT: ", context);
        // console.log("INPUT: ", input);
        console.log("BLOCK_PARAMS: ", block_params);
        if (flow.block_params[i].type == "transformer") {
          ordered_input = input;
        } else {
          forEach(block_params.input, (param) => {
            // console.log("PARAM NAME: ", param.name);
            if (input[param.name]) {
              ordered_input[param.name] = input[param.name];
            }
          });
        }
        console.log("ORDERED INPUT: ", ordered_input);
      }
      const data = {
        args: ordered_input,
        startup_script: block_response.data[0].startup_script,
        build_script: block_response.data[0].build_script,
      };
      ordered_input = {};
      const output = await cloneAndRun(
        block_response.data[0].vcs_path,
        data,
        context
      );
      if (output.status != 200) {
        console.log(output);
        updateJobStatusService(job_id, {
          flow_id: flow.id,
          status: "FAILED",
          // @ts-ignore
          details: output.message + output.error,
        });
        return {
          status: output.status,
          data: "Something went wrong while cloning and running.",
        };
      }
      // Output of the current block is the input to the next block
      console.log("d", output);
      if (output.message) {
        console.log("d", output.message);
        context = JSON.parse(output.message);
      } else {
        context = {};
      }
    }
    console.log("Flow executed successfully.");
    updateJobStatusService(job_id, { flow_id: flow.id, status: "SUCCESS" });
    console.log("Updated db...");
    return {
      status: 200,
      // TODO: change this
      data: "Success",
    };
  } catch (error: any) {
    console.error(`Error: ${error}`);
    updateJobStatusService(job_id, {
      flow_id: flow.id,
      status: "FAILED",
      details: error.message,
    });
    return { status: 500, error };
  }
}
