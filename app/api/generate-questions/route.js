import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { position, type } = await request.json();

        if (!position || !type) {
            return NextResponse.json(
                { error: 'Position and type are required' },
                { status: 400 }
            );
        }

        const prompt = `Generate 5 interview questions for a ${position} position. Interview type: ${type}. Return only a JSON array of questions, no other text.`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                'X-Title': 'Interview Scheduler'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that generates interview questions.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            return NextResponse.json(
                { error: `OpenRouter API error: ${errorData}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response received from OpenRouter');
        }

        let questions;
        try {
            const content = data.choices[0].message.content;
            questions = JSON.parse(content);
            
            if (!Array.isArray(questions)) {
                throw new Error('Response is not an array');
            }
        } catch (error) {
            throw new Error('Failed to parsing questions from response');
        }

        return NextResponse.json({ questions });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 