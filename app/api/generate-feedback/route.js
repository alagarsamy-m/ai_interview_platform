import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { position, questions, answers } = await request.json();

        if (!position || !questions || !answers) {
            return NextResponse.json(
                { error: 'Position, questions, and answers are required' },
                { status: 400 }
            );
        }

        const prompt = `Review ${position} interview. Q&A: ${questions.map((q, i) => `Q${i+1}:${q.question} A:${answers[i]||'none'}`).join(' ')}. JSON: {"o":"","s":[],"i":[],"t":"","c":"","r":""}`;

        console.log('Sending prompt to OpenRouter:', prompt);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL,
                'X-Title': 'Interview Scheduler'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages: [
                    {
                        role: 'system',
                        content: 'Generate feedback.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 200
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenRouter API Error:', errorData);
            return NextResponse.json(
                { error: `OpenRouter API error: ${errorData}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('OpenRouter Response:', data);

        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response format from OpenRouter');
        }

        let feedback;
        try {
            const content = data.choices[0].message.content;
            const parsed = JSON.parse(content);
            
            // Transform the feedback to match our expected format
            feedback = {
                overallAssessment: parsed.o,
                strengths: parsed.s,
                areasForImprovement: parsed.i,
                technicalKnowledge: parsed.t,
                communicationSkills: parsed.c,
                finalRecommendation: parsed.r
            };
        } catch (error) {
            console.error('Error parsing feedback:', error);
            throw new Error('Failed to parse feedback from response');
        }

        return NextResponse.json({ feedback });
    } catch (error) {
        console.error('Error in generate-feedback:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 