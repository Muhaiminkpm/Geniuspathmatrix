import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { WebhookResponseData } from '@/lib/types';
import { AlertCircle, CheckCircle2, Target, TrendingUp } from 'lucide-react';

interface WebhookAnalysisDisplayProps {
    data: WebhookResponseData;
}

export function WebhookAnalysisDisplay({ data }: WebhookAnalysisDisplayProps) {
    // Add console logging to display fetched data
    React.useEffect(() => {
        console.log('=== WEBHOOK ANALYSIS DATA ===');
        console.log('Full data:', JSON.stringify(data, null, 2));
        console.log('Issues:', data.issues);
        console.log('Avg Category:', data.avg_category);
        console.log('5 Domains:', data['5_domains']);
        console.log('SWOT:', data.swot);
        console.log('Decision Matrix:', data.decision_matrix);
        console.log('Plans:', data.plans);
        console.log('============================');
    }, [data]);

    if (!data) return null;

    // Safely handle issues - convert to array if it's not already
    const issuesArray = Array.isArray(data.issues)
        ? data.issues
        : data.issues
            ? [String(data.issues)]
            : [];

    return (
        <div className="space-y-6">
            {/* Issues Section */}
            {issuesArray.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            Issues Identified
                        </CardTitle>
                        <CardDescription>Areas that may require attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {issuesArray.map((issue, index) => (
                                <li key={`issue-${index}`} className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    <span className="text-sm">{issue}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Average Category Scores */}
            {data.avg_category && Object.keys(data.avg_category).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            Category Performance
                        </CardTitle>
                        <CardDescription>Your average scores across different categories</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(data.avg_category).map(([category, score]) => {
                            // Ensure score is properly handled
                            const scoreValue = typeof score === 'number' ? score : parseFloat(String(score)) || 0;
                            return (
                                <div key={`avg-cat-${category}`} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium capitalize">{category.replace(/_/g, ' ')}</span>
                                        <span className="text-sm font-semibold">{scoreValue.toFixed(1)}</span>
                                    </div>
                                    <Progress value={(scoreValue / 5) * 100} className="h-2" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* 5 Domains */}
            {data['5_domains'] && Object.keys(data['5_domains']).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-purple-500" />
                            5 Key Domains
                        </CardTitle>
                        <CardDescription>Your strengths across core competency areas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(data['5_domains']).map(([domain, score]) => {
                            // Ensure score is properly handled
                            const scoreValue = typeof score === 'number' ? score : parseFloat(String(score)) || 0;
                            return (
                                <div key={`5-domain-${domain}`} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium capitalize">{domain.replace(/_/g, ' ')}</span>
                                        <Badge variant="outline">{scoreValue.toFixed(1)}</Badge>
                                    </div>
                                    <Progress value={(scoreValue / 5) * 100} className="h-2" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* SWOT Analysis */}
            {data.swot && (
                <Card>
                    <CardHeader>
                        <CardTitle>SWOT Analysis</CardTitle>
                        <CardDescription>Strengths, Weaknesses, Opportunities, and Threats</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Strengths
                            </h4>
                            <ul className="space-y-1">
                                {data.swot.strengths?.map((item, index) => (
                                    <li key={`strength-${index}`} className="text-sm pl-4 border-l-2 border-green-500 py-1">{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-orange-600 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Weaknesses
                            </h4>
                            <ul className="space-y-1">
                                {data.swot.weaknesses?.map((item, index) => (
                                    <li key={`weakness-${index}`} className="text-sm pl-4 border-l-2 border-orange-500 py-1">{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Opportunities */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Opportunities
                            </h4>
                            <ul className="space-y-1">
                                {data.swot.opportunities?.map((item, index) => (
                                    <li key={`opportunity-${index}`} className="text-sm pl-4 border-l-2 border-blue-500 py-1">{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Threats */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-red-600 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Threats
                            </h4>
                            <ul className="space-y-1">
                                {data.swot.threats?.map((item, index) => (
                                    <li key={`threat-${index}`} className="text-sm pl-4 border-l-2 border-red-500 py-1">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Decision Matrix */}
            {data.decision_matrix && data.decision_matrix.criteria && data.decision_matrix.options && (
                <Card>
                    <CardHeader>
                        <CardTitle>Decision Matrix</CardTitle>
                        <CardDescription>Comparative analysis of career options</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">Criteria</th>
                                        {data.decision_matrix.options.map((option, index) => (
                                            <th key={`option-${index}-${option}`} className="text-center p-3 font-semibold">{option}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.decision_matrix.criteria.map((criterion, index) => (
                                        <tr key={`criterion-${index}-${criterion}`} className="border-b hover:bg-muted/50">
                                            <td className="p-3 font-medium">{criterion}</td>
                                            {data.decision_matrix!.options!.map((option, optIndex) => (
                                                <td key={`score-${index}-${optIndex}-${option}`} className="text-center p-3">
                                                    {data.decision_matrix!.scores?.[criterion]?.[option] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Career Plans */}
            {data.plans && (
                <Card>
                    <CardHeader>
                        <CardTitle>Career Development Plan</CardTitle>
                        <CardDescription>Your roadmap for the coming years</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Selected Domains */}
                        {data.plans.selected_domains && data.plans.selected_domains.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Selected Career Domains</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.plans.selected_domains.map((domain, index) => (
                                        <Badge key={`selected-domain-${index}-${domain}`} variant="secondary">{domain}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timeline Plans */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(['1_year', '3_year', '5_year', '10_year'] as const).map((timeframe) => {
                                const plan = data.plans?.[timeframe];
                                if (!plan) return null;

                                return (
                                    <Card key={timeframe} className="bg-muted/30">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{timeframe.replace('_', ' ')} Plan</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {plan.goals && plan.goals.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-sm mb-2">Goals</h5>
                                                    <ul className="space-y-1">
                                                        {plan.goals.map((goal, index) => (
                                                            <li key={`goal-${timeframe}-${index}`} className="text-sm flex items-start gap-2">
                                                                <span className="text-primary mt-1">•</span>
                                                                <span>{goal}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {plan.milestones && plan.milestones.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-sm mb-2">Milestones</h5>
                                                    <ul className="space-y-1">
                                                        {plan.milestones.map((milestone, index) => (
                                                            <li key={`milestone-${timeframe}-${index}`} className="text-sm flex items-start gap-2">
                                                                <CheckCircle2 className="h-3 w-3 text-green-500 mt-1" />
                                                                <span>{milestone}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {plan.skills_to_develop && plan.skills_to_develop.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-sm mb-2">Skills to Develop</h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {plan.skills_to_develop.map((skill, index) => (
                                                            <Badge key={`skill-${timeframe}-${index}-${skill}`} variant="outline" className="text-xs">{skill}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
