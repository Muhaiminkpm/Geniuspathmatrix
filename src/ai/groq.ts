'use server';

/**
 * Groq API client for AI generation
 * Uses the Groq API with moonshotai/kimi-k2-instruct-0905 model
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const MODEL_NAME = 'moonshotai/kimi-k2-instruct-0905';

interface GroqChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface GroqChatCompletionRequest {
    model: string;
    messages: GroqChatMessage[];
    temperature?: number;
    response_format?: { type: 'json_object' };
}

interface GroqChatCompletionResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

/**
 * Generate text using Groq model
 */
export async function generateText(prompt: string): Promise<string> {
    try {
        const requestBody: GroqChatCompletionRequest = {
            model: MODEL_NAME,
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
        };

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            throw new Error(`Groq API request failed: ${response.status} - ${errorText}`);
        }

        const data: GroqChatCompletionResponse = await response.json();
        const text = data.choices[0]?.message?.content;

        if (!text) {
            throw new Error('No content in Groq API response');
        }

        return text;
    } catch (error: any) {
        console.error('Groq Text Generation Error:', error);
        throw error;
    }
}

/**
 * Generate JSON using Groq model with structured output
 */
export async function generateJSON<T>(prompt: string, schema: any): Promise<T> {
    try {
        // Add JSON formatting instruction to the prompt
        const jsonPrompt = `${prompt}\n\nIMPORTANT: You MUST respond with a valid JSON object that matches the expected schema. Do not include any markdown formatting, code blocks, or additional text. Only return the raw JSON object.`;

        const requestBody: GroqChatCompletionRequest = {
            model: MODEL_NAME,
            messages: [
                { role: 'user', content: jsonPrompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        };

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            throw new Error(`Groq API request failed: ${response.status} - ${errorText}`);
        }

        const data: GroqChatCompletionResponse = await response.json();
        const text = data.choices[0]?.message?.content;

        if (!text) {
            throw new Error('No content in Groq API response');
        }

        // Parse and validate JSON
        const parsedData = JSON.parse(text) as T;
        return parsedData;
    } catch (error: any) {
        console.error('Groq JSON Generation Error:', error);

        // Log to file for debugging
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'debug-error.log');
        const timestamp = new Date().toISOString();
        const errorMessage = `[${timestamp}] Error in generateJSON: ${error.message}\nStack: ${error.stack}\nPrompt Preview: ${prompt.slice(0, 100)}...\n\n`;

        try {
            fs.appendFileSync(logPath, errorMessage);
        } catch (e) {
            console.error('Failed to write to log file:', e);
        }

        throw error;
    }
}
