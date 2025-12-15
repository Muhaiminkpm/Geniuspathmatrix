import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Heart, Lightbulb, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import type { PersonalityProfile, InterestProfile, CognitiveProfile, InsightXReportData } from '@/lib/types';

type Props = {
    reportData: InsightXReportData;
    studentName?: string;
};

function PersonalitySection({ profile }: { profile: PersonalityProfile }) {
    const traits = [
        { key: 'openness', label: 'Openness to Experience', value: profile.openness, description: 'Curiosity, creativity, and openness to new ideas' },
        { key: 'conscientiousness', label: 'Conscientiousness', value: profile.conscientiousness, description: 'Organization, responsibility, and self-discipline' },
        { key: 'extraversion', label: 'Extraversion', value: profile.extraversion, description: 'Sociability, assertiveness, and energy level' },
        { key: 'agreeableness', label: 'Agreeableness', value: profile.agreeableness, description: 'Compassion, cooperation, and trust' },
        { key: 'neuroticism', label: 'Emotional Stability', value: 100 - profile.neuroticism, description: 'Calmness, emotional resilience, and stress management' },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle>Personality Profile</CardTitle>
                </div>
                <CardDescription>Based on the Big Five personality traits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {traits.map((trait) => (
                    <div key={trait.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm">{trait.label}</p>
                                <p className="text-xs text-muted-foreground">{trait.description}</p>
                            </div>
                            <Badge variant="secondary">{trait.value}%</Badge>
                        </div>
                        <Progress value={trait.value} className="h-2" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function InterestSection({ profile }: { profile: InterestProfile }) {
    const interests = [
        { key: 'realistic', label: 'Realistic (Doers)', value: profile.realistic, description: 'Hands-on, practical activities' },
        { key: 'investigative', label: 'Investigative (Thinkers)', value: profile.investigative, description: 'Research, analysis, problem-solving' },
        { key: 'artistic', label: 'Artistic (Creators)', value: profile.artistic, description: 'Creative expression and innovation' },
        { key: 'social', label: 'Social (Helpers)', value: profile.social, description: 'Teaching, helping, and nurturing' },
        { key: 'enterprising', label: 'Enterprising (Persuaders)', value: profile.enterprising, description: 'Leadership, sales, and influence' },
        { key: 'conventional', label: 'Conventional (Organizers)', value: profile.conventional, description: 'Structure, data, and organization' },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <CardTitle>Career Interest Profile</CardTitle>
                </div>
                <CardDescription>Holland Codes (RIASEC) - What you enjoy doing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {interests.map((interest) => (
                    <div key={interest.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm">{interest.label}</p>
                                <p className="text-xs text-muted-foreground">{interest.description}</p>
                            </div>
                            <Badge variant="secondary">{interest.value}%</Badge>
                        </div>
                        <Progress value={interest.value} className="h-2" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function CognitiveSection({ profile }: { profile: CognitiveProfile }) {
    const abilities = [
        { key: 'logicalReasoning', label: 'Logical Reasoning', value: profile.logicalReasoning, icon: Lightbulb },
        { key: 'verbalAbility', label: 'Verbal Ability', value: profile.verbalAbility, icon: Brain },
        { key: 'problemSolving', label: 'Problem Solving', value: profile.problemSolving, icon: TrendingUp },
        { key: 'numericalAptitude', label: 'Numerical Aptitude', value: profile.numericalAptitude, icon: TrendingUp },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>Cognitive Capability Indicators</CardTitle>
                </div>
                <CardDescription>Your mental aptitudes and thinking strengths</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {abilities.map((ability) => {
                        const Icon = ability.icon;
                        return (
                            <div key={ability.key} className="p-4 border rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-semibold text-sm">{ability.label}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Progress value={ability.value} className="h-2 flex-1" />
                                    <Badge>{ability.value}%</Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

function PICIndexCard({ picIndex }: { picIndex: number }) {
    const getIndexColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-orange-600';
    };

    const getIndexLabel = (score: number) => {
        if (score >= 80) return 'Excellent Match';
        if (score >= 60) return 'Strong Foundation';
        if (score >= 40) return 'Developing Potential';
        return 'Exploratory Stage';
    };

    return (
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">PIC Index™</CardTitle>
                <CardDescription>Personality × Interest × Cognitive Alignment</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className={`text-6xl font-bold ${getIndexColor(picIndex)}`}>
                    {picIndex}
                </div>
                <Badge variant="outline" className="text-lg px-4 py-1">
                    {getIndexLabel(picIndex)}
                </Badge>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Your PIC Index™ represents how well your personality, interests, and cognitive abilities align for career success.
                </p>
            </CardContent>
        </Card>
    );
}

export function InsightXReport({ reportData, studentName }: Props) {
    const router = useRouter();

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold font-headline">InsightX™ Assessment Report</h1>
                {studentName && <p className="text-xl text-muted-foreground">For {studentName}</p>}
                <p className="text-sm text-muted-foreground">
                    Generated on {new Date(reportData.generatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* PIC Index - Hero Section */}
            <PICIndexCard picIndex={reportData.picIndex} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PersonalitySection profile={reportData.personalityProfile} />
                <InterestSection profile={reportData.interestProfile} />
            </div>

            {/* Cognitive Section - Full Width */}
            <CognitiveSection profile={reportData.cognitiveProfile} />

            {/* Call to Action */}
            <Card className="bg-muted/50">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Ready to Explore Your Career Matches?</h3>
                            <p className="text-muted-foreground">
                                Based on your InsightX™ profile, we've identified the top career paths that align with your unique strengths.
                            </p>
                        </div>
                        <Button size="lg" onClick={() => router.push('/pathxplore')} className="whitespace-nowrap">
                            Proceed to PathXplore Careers™
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
