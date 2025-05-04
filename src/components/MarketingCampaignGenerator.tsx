"use client";
import React, { useState } from 'react';

export default function MarketingCampaignGenerator() {
  const [product, setProduct] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [campaign, setCampaign] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCampaign = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/marketing-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, targetAudience }),
      });

      const data = await response.json();
      setCampaign(data.response);
    } catch (error) {
      console.error('Erro ao gerar a campanha de marketing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-900/30 p-6 md:p-8 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Gerador de Campanhas com IA
      </h2>
      
      <p className="text-gray-300 mb-8 text-base md:text-lg">
        Experimente o poder da inteligência artificial para criar campanhas de marketing personalizadas.
        Informe o produto e público-alvo para receber uma estratégia completa em segundos.
      </p>
      
      <div className="flex flex-col gap-4 w-full">
        <input
          className="w-full p-3 rounded-lg border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
          placeholder="Nome do produto"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        
        <input
          className="w-full p-3 rounded-lg border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
          placeholder="Público-alvo"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        />
        
        <button
          className={`mt-2 py-3 px-6 rounded-lg font-medium ${
            loading || !product || !targetAudience
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transform hover:-translate-y-1'
          } text-white transition-all duration-300 flex justify-center`}
          onClick={generateCampaign}
          disabled={loading || !product || !targetAudience}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            'Criar Campanha'
          )}
        </button>
      </div>
      
      {campaign && (
        <div className="mt-8 bg-gray-800/60 border border-gray-700/50 p-6 rounded-lg shadow-lg animate-fadeIn">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Campanha Gerada:</h3>
          <div className="text-gray-200 whitespace-pre-wrap text-left">{campaign}</div>
        </div>
      )}
    </div>
  );
}