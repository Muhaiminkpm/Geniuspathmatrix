import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {dotEnv} from 'genkit';

dotEnv();

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-pro',
});
