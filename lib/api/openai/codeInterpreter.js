import { openai } from "./openai";

const file = await openai.files.create({
    file: fs.createReadStream("../../files/test.csv"),
    purpose: "assistants",
  });

  const assistant = await openai.beta.assistants.create({
    instructions: "You are a personal math tutor. When asked a math question, write and run code to answer the question.",
    model: "gpt-4-1106-preview",
    tools: [{"type": "code_interpreter"}],
    file_ids: [file.id]
  });

  const thread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": "I need to solve the equation `3x + 11 = 14`. Can you help me?",
        "file_ids": [file.id]
      }
    ]
  });