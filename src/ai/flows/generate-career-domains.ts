'use server';

/**
 * @fileOverview Generates career domains ranking based on student assessment
 * 
 * - generateCareerDomains - Analyzes assessment and returns ranked career domains
 */

import { generateJSON } from '@/ai/groq';
import { z } from 'zod';

const CareerDomainInputSchema = z.object({
    personality: z.string().describe("Summary of personality assessment"),
    interest: z.string().describe("Summary of interest profiler"),
    cognitiveAbilities: z.string().describe("Summary of cognitive abilities"),
    selfReportedSkills: z.string().describe("Summary of self-reported skills"),
    cvq: z.string().describe("Summary of career values"),
});

export type CareerDomainInput = z.infer<typeof CareerDomainInputSchema>;

const DomainSchema = z.object({
    domainName: z.string().describe("Name of the career domain (e.g., 'Innovation & Technology', 'Healthcare & Social Services')"),
    score: z.number().describe("Match score from 0-100 indicating fit for this domain"),
    description: z.string().describe("2-3 sentence description of what this domain encompasses"),
    careerPaths: z.array(z.string()).describe("3-5 specific career paths within this domain"),
    swotAnalysis: z.string().describe("SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for this career domain based on the student's profile. Format: **Strengths:**\\n- bullet points\\n\\n**Weaknesses:**\\n- bullet points\\n\\n**Opportunities:**\\n- bullet points\\n\\n**Threats:**\\n- bullet points"),
});

const CareerDomainsOutputSchema = z.object({
    domains: z.array(DomainSchema).describe("Top 5 career domains ranked by score"),
});

export type CareerDomainsOutput = z.infer<typeof CareerDomainsOutputSchema>;

export async function generateCareerDomains(input: CareerDomainInput): Promise<CareerDomainsOutput> {
    const systemPrompt = `You are "Path-GeniX", an expert career guidance AI. Your task is to analyze a student's comprehensive assessment and identify the TOP 5 CAREER DOMAINS that best match their profile.

IMPORTANT: Think in terms of BROAD CAREER DOMAINS first, not specific job titles.

Career Domains are broad categories like:
- "Healthcare & Social Services" (medical, counseling, social work)
- "Creative Arts & Media" (design, writing, entertainment)
- "Business & Entrepreneurship" (management, sales, startups)
- "Education & Training" (teaching, coaching, curriculum design)
- "Science & Research" (laboratory, academic, R&D)
- "Law & Public Service" (legal, government, policy)
- "Innovation & Technology" (software, data, engineering)
- "Finance & Analytics" (banking, accounting, data analysis)

You will be provided with:
1. Personality traits (Big Five)
2. Interest profile (Holland Codes/RIASEC)
3. Cognitive abilities
4. Self-reported skills
5. Career values

Your Task:
1. Analyze ALL data points holistically
2. Identify the TOP 5 career domains that best match the student
3. Assign a match score (0-100) to each domain based on the strength of alignment
4. For each domain, list 3-5 SPECIFIC career paths within that domain
5. Generate a personalized SWOT analysis for each domain based on the student's specific profile
6. Rank domains from highest to lowest score

SWOT Analysis Requirements:
- **Strengths**: Internal student traits that align with this domain (reference their personality, skills)
- **Weaknesses**: Internal gaps or challenges the student may face (reference their assessment results)
- **Opportunities**: External market trends or factors favoring this domain
- **Threats**: External challenges or competition in this domain

Format SWOT as:
**Strengths:**
- [bullet point referencing student profile]
- [bullet point referencing student profile]

**Weaknesses:**
- [bullet point referencing student profile]
- [bullet point referencing student profile]

**Opportunities:**
- [market trend or factor]
- [market trend or factor]

**Threats:**
- [market challenge]
- [market challenge]

Output Requirements:
- Return exactly 5 domains
- Scores should be realistic (typically 65-95 for good matches)
- Include brief description of each domain
- List specific career paths (job titles) within each domain
- Include personalized SWOT analysis for each domain
- Output must be valid JSON matching the schema`;

    const prompt = `${systemPrompt}

Student Assessment Data:
${JSON.stringify(input, null, 2)}

Generate the top 5 career domains for this student.`;

    try {
        const result = await generateJSON<CareerDomainsOutput>(prompt, CareerDomainsOutputSchema);

        if (!result || !result.domains || result.domains.length === 0) {
            console.error("AI returned empty domains");
            return {
                domains: []
            };
        }

        // Sort by score descending
        result.domains.sort((a, b) => b.score - a.score);

        return result;
    } catch (error) {
        console.error("Failed to generate career domains:", error);
        return {
            domains: []
        };
    }
}
