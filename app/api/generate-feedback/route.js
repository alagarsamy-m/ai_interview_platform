import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { position, questions, answers } = await request.json();

        console.log('Feedback generation request:', { position, questionsCount: questions?.length, answersCount: answers?.length });

        if (!position || !questions || !answers) {
            console.error('Missing required fields:', { position: !!position, questions: !!questions, answers: !!answers });
            return NextResponse.json(
                { error: 'Position, questions, and answers are required' },
                { status: 400 }
            );
        }

        if (!Array.isArray(questions) || !Array.isArray(answers)) {
            console.error('Invalid data types:', { questionsType: typeof questions, answersType: typeof answers });
            return NextResponse.json(
                { error: 'Questions and answers must be arrays' },
                { status: 400 }
            );
        }

        const prompt = `Review ${position} interview. Q&A: ${questions.map((q, i) => `Q${i+1}:${q.question} A:${answers[i]||'none'}`).join(' ')}. JSON: {"o":"","s":[],"i":[],"t":"","c":"","r":""}`;

        console.log('Sending prompt to OpenRouter:', prompt);

        if (!process.env.OPENROUTER_API_KEY) {
            console.error('OPENROUTER_API_KEY is not set');
            return NextResponse.json(
                { error: 'OpenRouter API key not configured' },
                { status: 500 }
            );
        }

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
            console.error('Invalid OpenRouter response format:', data);
            throw new Error('Invalid response format from OpenRouter');
        }

        let feedback;
        try {
            const content = data.choices[0].message.content;
            console.log('Raw feedback content:', content);
            
            const parsed = JSON.parse(content);
            console.log('Parsed feedback:', parsed);
            
            // Transform the feedback to match our expected format
            feedback = {
                overallAssessment: parsed.o || 'No overall assessment provided',
                strengths: Array.isArray(parsed.s) ? parsed.s : ['No strengths identified'],
                areasForImprovement: Array.isArray(parsed.i) ? parsed.i : ['No areas for improvement identified'],
                technicalKnowledge: parsed.t || 'No technical knowledge assessment provided',
                communicationSkills: parsed.c || 'No communication skills assessment provided',
                finalRecommendation: parsed.r || 'No final recommendation provided'
            };
        } catch (error) {
            console.error('Error parsing feedback:', error);
            console.error('Raw content that failed to parse:', data.choices[0].message.content);
            throw new Error('Failed to parse feedback from response');
        }

        console.log('Final feedback object:', feedback);
        return NextResponse.json({ feedback });
    } catch (error) {
        console.error('Error in generate-feedback:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 