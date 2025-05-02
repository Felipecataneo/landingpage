// src/app/api/chat/route.ts
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

// Certifique-se de que a sua chave de API está em uma variável de ambiente
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json(); // Espera um array de mensagens [{ role: 'user', content: '...' }, ...]

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // Verifique se há mensagens duplicadas próximas no histórico
        const cleanMessages = removeDuplicateMessages(messages);

        const chatCompletion = await groq.chat.completions.create({
            messages: cleanMessages,
            model: "llama-3.3-70b-versatile", // Escolha o modelo desejado (llama-3.3-70b-versatile, etc.)
            temperature: 0.7,
            max_tokens: 1024,
            stream: true, // Importante para streaming
        });

        // Criar o stream para o frontend
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Processa cada chunk da resposta do chatCompletion
                    for await (const chunk of chatCompletion) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(new TextEncoder().encode(content));
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error('Erro durante o streaming:', error);
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-transform',
                'X-Content-Type-Options': 'nosniff'
            },
        });

    } catch (error) {
        console.error('Erro ao chamar a API Groq:', error);
        return NextResponse.json({ error: 'Failed to get response from chatbot' }, { status: 500 });
    }
}

// Função para remover mensagens duplicadas sequenciais no histórico
function removeDuplicateMessages(messages: any[]) {
    if (messages.length <= 1) return messages;
    
    const result = [messages[0]];
    
    for (let i = 1; i < messages.length; i++) {
        const currentMsg = messages[i];
        const prevMsg = messages[i - 1];
        
        // Se a mensagem atual tem o mesmo papel e conteúdo que a anterior, pule-a
        if (currentMsg.role === prevMsg.role && currentMsg.content === prevMsg.content) {
            continue;
        }
        
        result.push(currentMsg);
    }
    
    return result;
}