import { configureGenkit, genkit as ai } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});

export { ai };
