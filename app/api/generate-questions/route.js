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

    const prompt = `Generate 5 ${type} interview questions for ${position}. Return ONLY a JSON array in this exact format, with no additional text or markdown:
[{"question": "Question text here", "type": "${type}"}]`;

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
            content: 'You are an expert interviewer. Return ONLY a JSON array of questions, with no additional text or formatting. Each question should be a complete sentence.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
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
    console.log('OpenRouter Response:', JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from OpenRouter');
    }

    const content = data.choices[0].message.content;
    console.log('Raw content from OpenRouter:', content);

    let questions;
    try {
      // Clean the content to extract just the JSON array
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('No JSON array found in content:', content);
        throw new Error('No JSON array found in response');
      }
      
      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON string:', jsonStr);
      
      // Parse the extracted JSON
      questions = JSON.parse(jsonStr);
      console.log('Parsed questions:', questions);

      // Validate the questions array
      if (!Array.isArray(questions)) {
        console.error('Response is not an array:', questions);
        throw new Error('Response is not an array');
      }

      if (questions.length === 0) {
        throw new Error('No questions generated');
      }

      // Transform and validate each question
      questions = questions.map((q, index) => {
        if (!q.question && !q.q) {
          console.error(`Question ${index + 1} is missing question text:`, q);
          throw new Error(`Question ${index + 1} is missing question text`);
        }
        return {
          question: q.question || q.q,
          type: q.type || q.t || type
        };
      });

      console.log('Final transformed questions:', questions);
    } catch (error) {
      console.error('Error parsing questions:', error);
      console.error('Failed content:', content);
      return NextResponse.json(
        { error: `Failed to generate questions: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error in generate-questions:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 