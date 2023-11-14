import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GPT(message) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "gpt-4-1106-preview",
  });
}

async function main() {
  const runner = openai.beta.chat.completions
    .runFunctions({
      model: "gpt-4-1106-preview",
      messages: [{ role: "user", content: "From: Camila Roldan, Message: Hola mi amor como estas?" }],
      functions: [
        {
          function: getMessagePriority,
          parameters: { type: "object", properties: {} },
        },
        {
          function: getMessagePriority,
          parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
          parameters: {
            type: "object",
            properties: {
              from: { type: "string" },
              message: { type: "string" },
              priority: { type: "number" },
            },
          },
        },
      ],
    })
    .on("message", (message) => console.log(message));

  const finalContent = await runner.finalContent();
  console.log();
  console.log("Final content:", finalContent);
}

async function getMessagePriority() {
  return "Boston"; // Simulate lookup
}

async function getWeather(args) {
  const { location } = args;
  // … do lookup …
  return { temperature: 6, precipitation: 5 };
}
main();