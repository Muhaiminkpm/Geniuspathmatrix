'use server';

/**
 * @fileOverview Generates comprehensive career report using Groq AI
 * 
 * - generateCareerReport - Creates detailed career analysis report with executive summary,
 *   recommendations, SWOT, roadmap, and action items
 */

import { generateText, generateJSON } from '@/ai/groq';
import { z } from 'zod';

const CareerReportInputSchema = z.object({
    careerDomains: z.array(z.any()).describe("Top career domains with scores and SWOT"),
    careerSuggestions: z.array(z.any()).describe("Career suggestions with descriptions"),
    studentProfile: z.string().describe("Summary of student's assessment results"),
});

export type CareerReportInput = z.infer<typeof CareerReportInputSchema>;

const CareerRecommendationSchema = z.object({
    careerName: z.string().describe("Career or domain name"),
    fitScore: z.number().describe("Match score out of 100"),
    rationale: z.string().describe("2-3 sentences explaining why this is a good fit"),
    keyStrengths: z.array(z.string()).describe("3-4 key strengths for this career"),
    developmentAreas: z.array(z.string()).describe("2-3 areas to develop"),
});

const DetailedSWOTSchema = z.object({
    overallStrengths: z.array(z.string()).describe("3-5 overall strengths across all careers"),
    overallWeaknesses: z.array(z.string()).describe("3-5 overall weaknesses to address"),
    marketOpportunities: z.array(z.string()).describe("3-5 market opportunities in suggested fields"),
    potentialThreats: z.array(z.string()).describe("3-5 potential challenges or threats"),
});

const CareerReportOutputSchema = z.object({
    executiveSummary: z.string().describe("2-3 paragraph executive summary of the career assessment"),
    careerRecommendations: z.array(CareerRecommendationSchema).describe("Top 3-5 career recommendations"),
    detailedSWOT: DetailedSWOTSchema.describe("Comprehensive SWOT analysis"),
    roadmap: z.string().describe("Career development roadmap with timeline suggestions"),
    nextSteps: z.array(z.string()).describe("5-7 concrete action items the student should take"),
});

export type CareerReportOutput = z.infer<typeof CareerReportOutputSchema>;

export async function generateCareerReport(input: CareerReportInput): Promise<CareerReportOutput> {
    const systemPrompt = `You are "Path-GeniX", an expert career counselor AI. Generate a comprehensive, professional career analysis report for a student based on their assessment results.

The report should be:
- Professional yet encouraging
- Specific and actionable
- Based on the student's actual assessment data
- Forward-looking and practical

Structure your response to include:

1. **Executive Summary**: Provide a high-level overview of the student's profile, their top career matches, and the overall assessment outcome. Make it compelling and personalized.

2. **Career Recommendations**: For each top career/domain:
   - Explain the fit score
   - Provide specific rationale referencing their assessment
   - List their key strengths for this career
   - Identify areas they should develop

3. **Detailed SWOT Analysis**: Provide an overall analysis:
   - Strengths: Internal qualities that will help them succeed
   - Weaknesses: Internal gaps or challenges to address
   - Opportunities: External market factors in their favor
   - Threats: External challenges they should be aware of

4. **Career Development Roadmap**: Provide a timeline-based plan:
   - Short-term (Next 6 months)
   - Medium-term (6-12 months)
   - Long-term (1-2 years)
   Include specific milestones and goals for each phase.

5. **Next Steps**: List concrete, actionable steps they can take immediately, such as:
   - Courses or certifications to pursue
   - Skills to develop
   - Experiences to gain
   - People to connect with
   - Research to conduct

Make the report motivating and practical.`;

    const prompt = `${systemPrompt}

Student Assessment Data:
${JSON.stringify(input, null, 2)}

Generate a comprehensive career analysis report for this student.`;

    try {
        const result = await generateJSON<CareerReportOutput>(prompt, CareerReportOutputSchema);

        if (!result) {
            throw new Error("AI returned empty report");
        }

        return result;
    } catch (error) {
        console.error("Failed to generate career report:", error);
        throw error;
    }
}
