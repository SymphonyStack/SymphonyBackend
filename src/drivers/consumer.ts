import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const lambda = new AWS.Lambda();

export async function execute(metadata: any) {
  const steps: any[] = metadata.steps;

  let currentInput = {};

  for (const step of steps) {
    currentInput = await executeLambda(currentInput);
  }

  return currentInput;
}

async function executeLambda(payload: any) {
  const params = {
    FunctionName: "run-block-helloFromLambdaFunction-2PTMfvW8YeLD",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify(payload),
  };

  try {
    const response = await lambda.invoke(params).promise();
    if (response.Payload) {
      return JSON.parse(response.Payload as string);
    } else {
      throw new Error("No payload in response");
    }
  } catch (error) {
    console.error(`Error invoking lambda:`, error);
    throw error;
  }
}
