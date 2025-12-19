import { NextRequest, NextResponse } from 'next/server';

/**
 * SECURE API PROXY
 * This route handler runs on the server.
 * It uses the GROQ_API_KEY from environment variables,
 * so the key is NEVER sent to the user's browser.
 */
export async function POST(req: NextRequest) {
    try {
        const { messages, model = 'moonshotai/kimi-k2-instruct-0905' } = await req.json();

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model,
                messages: messages
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
