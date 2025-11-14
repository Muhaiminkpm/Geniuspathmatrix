
// import type { SuggestCareersOutput } from "@/ai/flows/ai-career-suggestions";
// import type { SwotAnalysisOutput } from "@/ai/flows/swot-analysis-for-career";
// import type { GenerateGoalsOutput } from "@/ai/flows/generate-goals-flow";

// Mock types since AI flows are removed
export type CareerSuggestion = {
  careerName: string;
  careerDescription: string;
  swotAnalysis: string;
  matchExplanation: string;
};
export type SwotAnalysis = any;
export type GoalPlan = Record<string, Goal[]>;


export interface Goal {
  id: string;
  title: string;
  category: 'Academic' | 'Skill' | 'Networking';
  description: string;
}

export interface CareerPath {
    id: string;
    title:string;
    description: string;
    matchReasons: string[];
    avgSalary: string;
    jobOutlook: string;
    minEducation: string;
    responsibilities: string[];
    skillMatch: { skill: string; match: number }[];
}
