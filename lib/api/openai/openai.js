import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});