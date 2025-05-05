'use client';

import React, { useEffect, useState } from 'react';
import HorizontalScroll from '@/components/HorizontalScroll';

export default function SitesPage() {
  
 

  return (
    <>
    <HorizontalScroll />
    <div className="relative w-screen min-h-screen overflow-hidden flex items-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Efeito de pulso animado usando Tailwind */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_top_left,rgba(13,255,255,0.05),transparent),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.05),transparent)] opacity-40 animate-pulse pointer-events-none"></div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="relative z-10 py-32 px-8 max-w-7xl mx-auto text-white flex flex-col items-center text-center">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] mb-8 font-bold tracking-wide text-white">
            Detalhes do Projeto: Sites
          </h1>
          
          <p className="text-[clamp(1.1rem,2.5vw,1.5rem)] leading-relaxed mb-16 text-gray-200 max-w-4xl text-justify">
            Aqui você encontrará informações detalhadas sobre nossos projetos de criação de sites.
            Exploramos as melhores práticas de design e desenvolvimento para criar experiências web incríveis e responsivas.
            Veja exemplos, tecnologias utilizadas e o impacto de nossos sites para os clientes.
          </p>
        </div>
      </div>
    
    </>
    
    
  );
}
