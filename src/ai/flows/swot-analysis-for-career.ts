'use server';

/**
 * @fileOverview Generates a SWOT analysis for a student considering a specific career.
 * 
 * - getSWOTAnalysisForCareer - A function that takes a career name and student profile to generate a SWOT analysis.
 * - SWOTAnalysisInput - The input type for the function.
 * - SWOTAnalysisOutput - The return type for the function.
 */

import { generateText } from '@/ai/groq';
import { z } from 'zod';

const SWOTAnalysisInputSchema = z.object({
  careerName: z.string().describe('The career for which to generate the analysis.'),
  studentProfile: z.string().describe('A JSON string of the student\'s assessment results (personality, interests, skills).'),
});
export type SWOTAnalysisInput = z.infer<typeof SWOTAnalysisInputSchema>;

export type SWOTAnalysisOutput = string;

export async function getSWOTAnalysisForCareer(input: SWOTAnalysisInput): Promise<SWOTAnalysisOutput> {
  const { careerName, studentProfile } = input;

  const systemPrompt = `You are a career strategy expert. Your task is to generate a concise, personalized SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for a student considering a specific career path.

You will be given the student's profile and their chosen career.

**Instructions**:
1.  **Analyze Strengths (Internal, Personal)**: Based on the student's profile (personality, skills, interests), what are their internal strengths that align with this career? (e.g., "Your high 'Openness' score aligns with the creativity needed in Graphic Design.")
2.  **Analyze Weaknesses (Internal, Personal)**: What internal weaknesses or skill gaps from their profile might they need to address? (e.g., "Lower confidence in public speaking could be a challenge in a sales role, but this can be developed.")
3.  **Identify Opportunities (External, Market)**: What external factors or trends in the job market could benefit them in this career? (e.g., "The growing demand for data scientists provides ample job opportunities.")
4.  **Identify Threats (External, Market)**: What external factors in the job market could pose a challenge? (e.g., "Automation may impact certain administrative roles in the long term, so continuous learning is key.")

**Output Format**:
Provide the output as a single, formatted string. Use markdown-style headings for each section. For example:

**Strengths:**
- [Strength 1 based on student profile]
- [Strength 2 based on student profile]

**Weaknesses:**
- [Weakness 1 based on student profile]
- [Weakness 2 based on student profile]

**Opportunities:**
- [Opportunity 1 based on market trends]
- [Opportunity 2 based on market trends]

**Threats:**
- [Threat 1 based on market trends]
- [Threat 2 based on market trends]
`;

  const prompt = `${systemPrompt}\n\nGenerate a SWOT analysis for the career of "${careerName}" based on this student profile: ${studentProfile}`;

  try {
    const output = await generateText(prompt);
    return output ?? "Could not generate SWOT analysis at this time.";
  } catch (error) {
    console.error("AI failed to return SWOT analysis:", error);
    return "Could not generate SWOT analysis at this time.";
  }
}
