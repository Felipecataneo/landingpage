'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

// Defina o tipo para uma mensagem
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function ChatbotsPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Como posso ajudar você hoje?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamController, setStreamController] = useState<AbortController | null>(null);

  // Ref para rolar para a última mensagem
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeito para rolar para o final das mensagens quando uma nova é adicionada
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Limpar o controller quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (streamController) {
        streamController.abort();
      }
    };
  }, [streamController]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Abortar qualquer stream anterior se existir
    if (streamController) {
      streamController.abort();
    }

    // Criar um novo controller para esta requisição
    const controller = new AbortController();
    setStreamController(controller);

    const newUserMessage: Message = { role: 'user', content: inputMessage.trim() };
    
    // Adicionar a mensagem do usuário e uma mensagem vazia do assistente para o streaming
    setMessages(prevMessages => [
      ...prevMessages, 
      newUserMessage,
      { role: 'assistant', content: 'Pensando...' }
    ]);
    
    setInputMessage('');
    setIsLoading(true);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                messages: messages.concat(newUserMessage)  // Importante: usar concat em vez de spread para garantir uma nova cópia
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                // Atualiza a última mensagem para mostrar o erro
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
                    newMessages[newMessages.length - 1] = { 
                        role: 'assistant', 
                        content: `Erro ao obter resposta: ${response.status}` 
                    };
                }
                return newMessages;
            });
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Primeiro, atualiza a mensagem "Pensando..." para vazia
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            // Encontra a última mensagem (que deve ser o "Pensando...")
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
                newMessages[newMessages.length - 1] = { role: 'assistant', content: '' };
            }
            return newMessages;
        });

        // Agora processa o stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('Não foi possível obter o reader do stream');
        }

        let fullResponse = '';
        
        while (true) {
            const { value, done } = await reader.read();
            
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;
            
            // Atualiza a última mensagem com o texto acumulado até agora
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
                    newMessages[newMessages.length - 1] = { 
                        role: 'assistant', 
                        content: fullResponse
                    };
                }
                return newMessages;
            });
        }

    } catch (error) {
        // Verifica se é um erro de abort (usuário cancelou ou novo request foi iniciado)
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('Requisição cancelada');
            return;
        }
        
        console.error('Erro ao enviar mensagem:', error);
        
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            // Atualiza a última mensagem para mostrar o erro
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
                newMessages[newMessages.length - 1] = { 
                    role: 'assistant', 
                    content: 'Erro ao obter resposta. Por favor, tente novamente.'
                };
            }
            return newMessages;
        });
    } finally {
        setIsLoading(false);
        setStreamController(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 bg-fixed overflow-y-auto">
      {/* Efeito de glow no background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,255,255,0.05),transparent),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.05),transparent)] opacity-40 pointer-events-none animate-pulse"></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 px-4 py-40 max-w-6xl mx-auto text-white flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-wide">Detalhes do Projeto: Chatbots</h1>
        
        <p className="text-lg md:text-xl mb-16 leading-relaxed text-gray-200 max-w-4xl text-justify">
          Desenvolvemos chatbots inteligentes e eficientes para transformar a comunicação da sua empresa. 
          Nossas soluções permitem atendimento ao cliente 24 horas por dia, 7 dias por semana, com respostas rápidas, personalizadas e precisas, reduzindo o tempo de espera e aumentando a satisfação do usuário.
          <br /><br />
          Os chatbots também ajudam a automatizar tarefas repetitivas, como agendamentos, envio de informações, triagem de suporte e coleta de dados, liberando sua equipe para focar em atividades mais estratégicas.
          <br /><br />
          Além disso, integram-se perfeitamente com seus sistemas atuais — como CRMs, ERPs e plataformas de e-commerce — proporcionando uma experiência fluida e conectada entre os canais.
          <br /><br />
          Seja para vendas, suporte, RH ou qualquer outro setor, nossos chatbots utilizam inteligência artificial e processamento de linguagem natural para compreender e responder em linguagem humana, com alto nível de contexto e eficiência.
        </p>

        {/* Área do Chatbot */}
        <div className="w-full max-w-3xl mt-12 bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          {/* Área de mensagens */}
          <div className="flex-grow max-h-96 overflow-y-auto pr-2 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div key={index} 
                className={`p-3 rounded-lg max-w-[85%] break-words text-white 
                ${msg.role === 'user' ? 'self-end bg-blue-900/70' : 'self-start bg-purple-900/70'}`}>
                <div className="leading-relaxed">{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            <Input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Digite sua mensagem aqui..."
              className="flex-grow bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-sky-600/80 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-purple-800 text-white rounded-md cursor-pointer transition-colors hover:bg-purple-700 disabled:bg-purple-800/50 disabled:cursor-not-allowed h-9 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}