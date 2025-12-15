
'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import type { GoalPlan, CareerSuggestion, MentorMessage } from './types';
import { FieldValue } from 'firebase-admin/firestore';
import { suggestCareers } from '@/ai/flows/ai-career-suggestions';
import { generateGoals } from '@/ai/flows/generate-goals-flow';
import { getSocraticResponse } from '@/ai/flows/mentor-flow';
import { generateInsightXReport } from '@/lib/profile-calculator';


type GeneralInfo = {
    name: string;
    dob: string;
    gender: string;
    classOfStudy: string;
    place: string;
    schoolOrCollege: string;
};

type SuggestCareersInput = {
    personality: Record<string, string>;
    interest: Record<string, string>;
    cognitiveAbilities: Record<string, string>;
    selfReportedSkills: Record<string, string>;
    cvq: Record<string, string>;
}

type GenerateGoalsInput = {
    careerSelections: string[];
    studentProfile: string;
    timeframes: string[];
}

type MentorInput = {
    messages: MentorMessage[];
    studentProfile: string;
}


export async function createUserDocument(user: { uid: string; email: string | null, username: string, phone: string }) {
    try {
        const userDocRef = adminDb.collection("users").doc(user.uid);

        // Check if username already exists
        const usernameQuery = await adminDb.collection("users").where("username", "==", user.username).limit(1).get();
        if (!usernameQuery.empty) {
            throw new Error("Username is already taken. Please choose a different one.");
        }

        await userDocRef.set({
            uid: user.uid,
            email: user.email,
            username: user.username,
            phone: user.phone,
            createdAt: FieldValue.serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error creating user document:', error);
        // Check for specific Firestore errors if needed, e.g., permissions
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user document.';
        return { success: false, error: errorMessage };
    }
}

export async function getEmailForUsername(username: string): Promise<{ success: boolean; email?: string; error?: string }> {
    try {
        if (!username) {
            return { success: false, error: 'Username is required.' };
        }

        const usersRef = adminDb.collection('users');
        const snapshot = await usersRef.where('username', '==', username).limit(1).get();

        if (snapshot.empty) {
            return { success: false, error: 'Invalid username or password.' };
        }

        const userData = snapshot.docs[0].data();
        const userEmail = userData.email;

        if (!userEmail) {
            return { success: false, error: 'No valid email found for this user.' };
        }

        return { success: true, email: userEmail };

    } catch (error) {
        console.error('Error getting email for username:', error);
        return { success: false, error: 'An internal error occurred.' };
    }
}


export async function getCareerSuggestions(input: SuggestCareersInput & { userId: string, generalInfo: GeneralInfo }) {
    try {
        const userId = input.userId;
        if (!userId) throw new Error("User not authenticated.");

        const personalitySummary = `Summary of personality responses: ${JSON.stringify(input.personality)}`;
        const interestSummary = `Summary of interest responses: ${JSON.stringify(input.interest)}`;
        const cognitiveSummary = `Summary of cognitive & skills responses: ${JSON.stringify(input.cognitiveAbilities)}. Self-reported skills: ${JSON.stringify(input.selfReportedSkills)}`;
        const cvqSummary = `Summary of CVQ responses: ${JSON.stringify(input.cvq)}`;
        const selfReportedSkillsSummary = `Summary of self-reported skills: ${JSON.stringify(input.selfReportedSkills)}`;

        // Import the domain generation function
        const { generateCareerDomains } = await import('@/ai/flows/generate-career-domains');

        // 1. Generate career domains first
        const domains = await generateCareerDomains({
            personality: personalitySummary,
            interest: interestSummary,
            cognitiveAbilities: cognitiveSummary,
            selfReportedSkills: selfReportedSkillsSummary,
            cvq: cvqSummary,
        });

        // 2. Call the AI flow to get career suggestions
        const suggestions = await suggestCareers({
            personality: personalitySummary,
            interest: interestSummary,
            cognitiveAbilities: cognitiveSummary,
            selfReportedSkills: selfReportedSkillsSummary,
            cvq: cvqSummary,
        });

        // 3. Generate InsightX Report
        const insightXReport = generateInsightXReport({
            personality: input.personality,
            interest: input.interest,
            cognitiveAbilities: input.cognitiveAbilities,
        });

        // 4. Save assessment data, domains, suggestions, and InsightX report to the user's document
        const userDocRef = adminDb.collection("users").doc(userId);
        await userDocRef.set({
            assessment: {
                ...input,
                updatedAt: FieldValue.serverTimestamp(),
            },
            careerDomains: domains.domains,
            careerSuggestions: suggestions,
            insightXReport: insightXReport,
        }, { merge: true });

        // 5. Generate and save the summary report
        const reportDocRef = adminDb.collection("reports").doc(userId);

        const reportData = {
            userId: userId,
            assessmentSummary: {
                personality: personalitySummary,
                interest: interestSummary,
                cognitiveAbilities: cognitiveSummary,
                cvq: cvqSummary,
            },
            careerDomains: domains.domains,
            insightXReport: insightXReport,
            generatedAt: FieldValue.serverTimestamp(),
        };
        await reportDocRef.set(reportData, { merge: true });

        return { success: true, data: suggestions, domains: domains.domains, insightXReport };
    } catch (error) {
        console.error('Error getting career suggestions:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate career suggestions.';
        return { success: false, error: errorMessage };
    }
}

export async function getGeneratedGoals(input: GenerateGoalsInput & { userId: string }) {
    try {
        const userId = input.userId;
        if (!userId) throw new Error("User not authenticated.");

        const goals = await generateGoals({
            careerSelections: input.careerSelections,
            studentProfile: input.studentProfile,
            timeframes: input.timeframes,
        });

        const userDocRef = adminDb.collection("users").doc(userId);
        await userDocRef.update({
            goalPlan: goals,
        });

        return { success: true, data: goals };
    } catch (error) {
        console.error('Error generating goals:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate goals.';
        return { success: false, error: errorMessage };
    }
}

export async function sendParentQuiz(data: { email?: string, phone?: string, studentId: string }) {
    console.log('Simulating sending parent quiz for student:', data.studentId);
    if (!data.email && !data.phone) {
        return { success: false, error: 'No contact information provided.' };
    }
    // In a real app, you would use a unique token for the student.
    const quizLink = `/parent-quiz?studentId=${data.studentId}`;
    console.log(`(Pretend) Sending link ${quizLink} to parent with contact:`, { email: data.email, phone: data.phone });

    return { success: true, message: 'Parent quiz has been sent successfully!' };
}

export async function saveParentQuizAnswers(data: { studentId: string, answers: Record<string, string> }) {
    try {
        const { studentId, answers } = data;
        if (!studentId || !answers) {
            throw new Error('Missing student ID or answers for parent quiz.');
        }

        const answersCollectionRef = adminDb.collection('parentAnswers');
        await answersCollectionRef.add({
            studentId,
            answers,
            submittedAt: FieldValue.serverTimestamp(),
        });

        return { success: true, message: 'Answers saved successfully.' };
    } catch (error) {
        console.error('Error saving parent quiz answers:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save parent quiz answers.';
        return { success: false, error: errorMessage };
    }
}


export async function getMentorResponse(input: MentorInput & { userId: string }) {
    try {
        const userId = input.userId;
        if (!userId) throw new Error("User not authenticated.");

        const response = await getSocraticResponse({
            messages: input.messages,
            studentProfile: input.studentProfile,
        });

        const userDocRef = adminDb.collection("users").doc(userId);
        const userMessage = input.messages[input.messages.length - 1];

        // Check if the chat history exists, if not, create it before updating
        const userDoc = await userDocRef.get();
        if (!userDoc.exists || !userDoc.data()?.mentorChat) {
            await userDocRef.set({ mentorChat: [] }, { merge: true });
        }

        // Atomically add both the user's message and the model's response
        await userDocRef.update({
            mentorChat: FieldValue.arrayUnion(userMessage, { role: 'model', content: response })
        });

        return { success: true, data: response };
    } catch (error) {
        console.error('Error getting mentor response:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to get mentor response.';
        return { success: false, error: errorMessage };
    }
}

export async function getUserData(userId: string) {
    try {
        if (!userId) {
            return { success: false, error: "User not authenticated." };
        }
        const userDocRef = adminDb.collection("users").doc(userId);
        const docSnap = await userDocRef.get();

        if (docSnap.exists) {
            // Firestore admin SDK returns Timestamps, which are not directly serializable
            // for client components. We need to convert them.
            const data = docSnap.data();
            if (data) {
                // A simple and safe way to convert all timestamps in a nested object
                const serializableData = JSON.parse(JSON.stringify(data, (key, value) => {
                    // Check if it's a Firestore Timestamp-like object
                    if (value && typeof value === 'object' && value.hasOwnProperty('_seconds') && value.hasOwnProperty('_nanoseconds')) {
                        return new Date(value._seconds * 1000 + value._nanoseconds / 1000000).toISOString();
                    }
                    if (value && value.toDate) { // Fallback for actual Timestamp objects if they slip through
                        return value.toDate().toISOString();
                    }
                    return value;
                }));
                return { success: true, data: serializableData };
            }
            return { success: true, data: null };
        } else {
            return { success: true, data: null };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data.';
        return { success: false, error: errorMessage };
    }
}

export async function getAppData(docId: string) {
    try {
        const appDataRef = adminDb.collection("app_data").doc(docId);
        const docSnap = await appDataRef.get();

        if (docSnap.exists) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: false, error: `Document ${docId} not found.` };
        }
    } catch (error) {
        console.error('Error fetching app data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch app data.';
        return { success: false, error: errorMessage };
    }
}


export async function generateAndSaveCareerReport(userId: string) {
    try {
        if (!userId) {
            return { success: false, error: "User not authenticated." };
        }

        // Get user's career data
        const userDocRef = adminDb.collection("users").doc(userId);
        const docSnap = await userDocRef.get();

        if (!docSnap.exists) {
            return { success: false, error: "User data not found." };
        }

        const userData = docSnap.data();

        if (!userData?.careerSuggestions && !userData?.careerDomains) {
            return { success: false, error: "Please complete the assessment first." };
        }

        // Prepare input for AI
        const { generateCareerReport } = await import('@/ai/flows/generate-career-report');

        const reportInput = {
            careerDomains: userData.careerDomains || [],
            careerSuggestions: userData.careerSuggestions || [],
            studentProfile: JSON.stringify({
                personality: userData.assessment?.personality || {},
                interest: userData.assessment?.interest || {},
                cognitiveAbilities: userData.assessment?.cognitiveAbilities || {},
                skills: userData.assessment?.selfReportedSkills || {},
            }),
        };

        // Generate report using Groq AI
        console.log('[Report Generation] Calling Groq AI to generate career report...');
        const report = await generateCareerReport(reportInput);

        // Save report to Firestore
        await userDocRef.set({
            careerReport: {
                ...report,
                generatedAt: FieldValue.serverTimestamp(),
                status: 'ready',
            }
        }, { merge: true });

        console.log('[Report Generation] Career report generated and saved successfully');

        return { success: true, data: report };
    } catch (error) {
        console.error('Error generating career report:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate career report.';
        return { success: false, error: errorMessage };
    }
}

