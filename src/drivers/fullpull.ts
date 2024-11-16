import simpleGit from "simple-git";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
import path, { sep } from "path";
import fs from "fs/promises";
import { Flow } from "models";
import { getBlockService, updateJobStatusService } from "../services";
import { forEach } from "lodash";

const exec = promisify(execCallback);
const git = simpleGit();

const reposDir = path.resolve(__dirname, "../../", "repos");
const DELIMITER = process.env.DELIMITER ?? "";

import os from "os";

class CommandExecutor {
  private sessionName: string;
  private isWindows: boolean;

  constructor(prefix: string = "symphony") {
    this.sessionName = `${prefix}-${Date.now()}`;
    this.isWindows = os.platform() === "win32";
  }

  async init(): Promise<void> {
    if (!this.isWindows) {
      await exec(`tmux new-session -d -s "${this.sessionName}"`);
    }
    // Windows doesn't need initialization
  }

  async sendCommand(command: string): Promise<string> {
    if (this.isWindows) {
      // On Windows, execute directly
      const { stdout } = await exec(command);
      return stdout;
    } else {
      // On Unix-like systems, use tmux
      await exec(`tmux send-keys -t "${this.sessionName}" "${command}" Enter`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { stdout } = await exec(
        `tmux capture-pane -t "${this.sessionName}" -p`
      );
      return stdout;
    }
  }

  async cleanup(): Promise<void> {
    if (!this.isWindows) {
      try {
        await exec(`tmux kill-session -t "${this.sessionName}"`);
      } catch (error) {
        console.error("Error cleaning up tmux session:", error);
      }
    }
    // Windows doesn't need cleanup
  }
}

// Update cloneAndRun to use CommandExecutor instead of TmuxManager
export async function cloneAndRun(repoUrl: string, data: any, context: any) {
  const executor = new CommandExecutor();

  try {
    await executor.init();

    // Rest of your cloneAndRun function remains the same, but use executor.sendCommand
    // instead of direct exec calls

    console.log("STARTING CLONE: ", repoUrl);
    const repoName = repoUrl?.split("/")?.pop()?.split(".")[0] as string;
    const random = Math.floor(Math.random() * 1000);
    const repoNameWithRandom = `${random}_${repoName}`;
    const localPath = path.resolve(reposDir, repoNameWithRandom);

    await fs.mkdir(reposDir, { recursive: true });

    if (
      await fs
        .access(localPath)
        .then(() => true)
        .catch(() => false)
    ) {
      await fs.rm(localPath, { recursive: true, force: true });
    }

    await git.clone(repoUrl, localPath);

    process.chdir(localPath);

    console.log("STARTING INSTALL");
    await executor.sendCommand("npm install --legacy-peer-deps");

    if (data.build_script) {
      await executor.sendCommand(data.build_script);
    }

    const values = data.args
      ? Object.values(data.args).map((value) => `"${value}"`)
      : [];

    const startup_script = data.startup_script || "npm run dev";
    const separator = startup_script.includes("--") ? "" : "--";
    const command = `${startup_script} ${separator} ${values.join(" ")}`;

    const output = await executor.sendCommand(command);

    const modifiedOutput = output.substring(
      output.indexOf(DELIMITER) + 2,
      output.lastIndexOf(DELIMITER)
    );

    await fs.rm(localPath, { recursive: true, force: true });
    await executor.cleanup();

    return { status: 200, message: modifiedOutput };
  } catch (error) {
    await executor.cleanup();
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
