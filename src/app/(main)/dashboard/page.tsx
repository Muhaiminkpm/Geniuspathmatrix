'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Bot, CheckSquare, Compass, Goal } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { chartData } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="Dashboard" />
      <main className="flex-1 space-y-8 bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto grid max-w-7xl gap-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <CheckSquare className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-lg">
                    InsightX Assessment
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>
                  Start with our diagnostic tests to uncover your profile.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="h-auto p-0">
                  <Link href="/assessment">
                    Take Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Compass className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-lg">
                    PathXplore Career
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>
                  Explore the top 5 career options that fit you.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="h-auto p-0">
                  <Link href="#">
                    Explore Careers <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Goal className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-lg">
                    GoalMint Planner
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>
                  Design your SMART career action plan for success.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="h-auto p-0">
                  <Link href="/goals">
                    Plan Your Goals <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Bot className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-lg">
                    MentorSuite AI
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>
                  Chat with our AI Mentor for reflective questions.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="h-auto p-0">
                  <Link href="#">
                    Chat with Mentor <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-headline">Your Progress</CardTitle>
                <CardDescription>
                  Here is a summary of your skills assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Next Steps</CardTitle>
                <CardDescription>
                  Complete your journey to unlock your full potential.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Overall Progress</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">
                      Completed:
                    </span>{' '}
                    InsightX Assessment
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">
                      Next up:
                    </span>{' '}
                    PathXplore Career
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue Journey</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
