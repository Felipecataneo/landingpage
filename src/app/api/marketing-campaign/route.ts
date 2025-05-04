// src/app/api/marketing-campaign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Make sure to define this in your .env file
});

// POST handler for the marketing campaign generation
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { product, targetAudience } = await request.json();

    // Validate input
    if (!product || !targetAudience) {
      return NextResponse.json(
        { error: 'Product and target audience are required' },
        { status: 400 }
      );
    }

    const prompt = `Crie uma campanha de marketing para o produto "${product}" direcionada ao público "${targetAudience}". Forneça o nome da campanha, um slogan, os canais de divulgação recomendados e uma descrição envolvente.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em marketing que cria campanhas criativas e eficazes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;

    // Return the generated marketing campaign
    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Erro ao gerar a campanha de marketing:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar a campanha de marketing.' },
      { status: 500 }
    );
  }
}