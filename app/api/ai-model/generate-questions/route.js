import { NextResponse } from 'next/server';

// Add proper Next.js API route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req) {
  try {
    const { role, level, skills, numQuestions = 5 } = await req.json();

    // Check for required fields
    if (!role || !level || !skills) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for OpenRouter API key
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      console.error('OpenRouter API key is not configured');
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    // Construct the prompt
    const prompt = `Generate ${numQuestions} technical interview questions for a ${level} ${role} position. 
    Required skills: ${skills.join(', ')}.
    Format each question as a JSON object with 'question' and 'answer' fields.
    Return only the JSON array of questions.`;

    // Make request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000',
        'X-Title': 'Interview Scheduler'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus:beta',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the response content as JSON
    let questions;
    try {
      questions = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing OpenRouter response:', error);
      throw new Error('Invalid response format from OpenRouter');
    }

    // Validate the questions format
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format received');
    }

    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !q.answer) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error in generate-questions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate questions' },
      { status: 500 }
    );
  }
} 