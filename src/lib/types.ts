
import type { SuggestCareersOutput } from "@/ai/flows/ai-career-suggestions";
import type { SwotAnalysisOutput } from "@/ai/flows/swot-analysis-for-career";
import type { GenerateGoalsOutput } from "@/ai/flows/generate-goals-flow";


export type CareerSuggestion = SuggestCareersOutput[0];
export type SwotAnalysis = SwotAnalysisOutput;
export type GoalPlan = GenerateGoalsOutput;


export interface Goal {
  id: string;
  title: string;
  category: 'Academic' | 'Skill' | 'Networking';
  completed: boolean;
  dueDate: Date;
}

export interface CareerPath {
    id: string;
    title: string;
    description: string;
    matchReasons: string[];
    avgSalary: string;
    jobOutlook: string;
    minEducation: string;
    responsibilities: string[];
    skillMatch: { skill: string; match: number }[];
}
