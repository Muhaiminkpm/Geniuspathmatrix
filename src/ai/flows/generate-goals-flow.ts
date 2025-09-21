'use server';
/**
 * @fileOverview Generates a SMART goal plan for a given career path.
 *
 * - generateGoalsForCareer - A function that generates the goal plan.
 * - GenerateGoalsInput - The input type for the generateGoalsForCareer function.
 * - GenerateGoalsOutput - The return type for the generateGoalsForCareer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGoalsInputSchema = z.object({
  careerName: z.string().describe('The name of the career to generate a goal plan for.'),
  studentProfile: z.string().describe('A summary of the student\'s profile, including skills, interests, and personality traits.'),
});
export type GenerateGoalsInput = z.infer<typeof GenerateGoalsInputSchema>;

const GoalSchema = z.object({
  title: z.string().describe('The specific, measurable, achievable, relevant, and time-bound (SMART) goal.'),
  category: z.enum(['Academic', 'Skill', 'Networking']).describe('The category of the goal.'),
  description: z.string().describe('A brief description of the goal and why it is important for the career path.'),
});

const GoalPlanSchema = z.object({
  '1-year': z.array(GoalSchema).describe('A list of SMART goals to be achieved within 1 year.'),
  '3-year': z.array(GoalSchema).describe('A list of SMART goals to be achieved within 3 years.'),
  '5-year': z.array(GoalSchema).describe('A list of SMART goals to be achieved within 5 years.'),
});

const GenerateGoalsOutputSchema = GoalPlanSchema;
export type GenerateGoalsOutput = z.infer<typeof GenerateGoalsOutputSchema>;

export async function generateGoalsForCareer(input: GenerateGoalsInput): Promise<GenerateGoalsOutput> {
  return generateGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGoalsPrompt',
  input: {schema: GenerateGoalsInputSchema},
  output: {schema: GenerateGoalsOutputSchema},
  prompt: `You are an expert career planner who specializes in creating actionable roadmaps for students.

Based on the student's chosen career and their profile, generate a comprehensive SMART GoalMint™ Plan. This plan should be broken down into 1-year, 3-year, and 5-year timelines.

For each timeline (1-year, 3-year, 5-year), create a set of specific, measurable, achievable, relevant, and time-bound (SMART) goals. These goals must fall into one of three categories: 'Academic', 'Skill', or 'Networking'.

Include concrete action items like specific courses to take, skills to develop, projects to build, certifications to earn, or networking events to attend.

Career: {{{careerName}}}
Student Profile: {{{studentProfile}}}

Generate the plan.
`,
});

const generateGoalsFlow = ai.defineFlow(
  {
    name: 'generateGoalsFlow',
    inputSchema: GenerateGoalsInputSchema,
    outputSchema: GenerateGoalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
