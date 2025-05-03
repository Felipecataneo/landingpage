'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to disable SSR for the Three.js component
const InversionLens = dynamic(() => import('@/components/InversionLens'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <div className="text-gray-600">Carregando efeito...</div>
    </div>
  )
});

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-screen overflow-hidden relative bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Background glow effects */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 pointer-events-none z-0 animate-pulse-slow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,255,255,0.05),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.05),transparent)]"></div>
      </div>
      
      {/* Main content container */}
      <main className="relative z-10 flex flex-col items-center w-full">
        {/* Hero section with InversionLens */}
        <div className="w-screen h-[70vh] relative overflow-hidden flex items-center justify-center bg-black">
          <InversionLens
            src="/image3.jpg"
            className="w-full h-full cursor-pointer"
            initialRadius={0.35}
            turbulenceIntensity={0.1}
            animationSpeed={0.7}
          />

        </div>
        
        {/* About Us section with title positioned to overlap the image */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-8 -mt-24">
          {/* Title overlaps the image */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center mb-16 drop-shadow-lg">
            Sobre Nós
          </h1>
          
          {/* Content container with styling similar to projectDetailPage */}
          <div className="text-white py-12 px-4 md:px-12 flex flex-col items-center text-justify">
            {/* Text content placeholder - will be replaced with actual content */}
            <div className="prose prose-lg prose-invert max-w-3xl mx-auto">
              <p className="text-lg md:text-xl mb-6">
              Na Apollo Creations, acreditamos que a tecnologia pode transformar o mundo, uma criação de cada vez. Somos uma equipe apaixonada por inovação, especializada em construir soluções digitais personalizadas para empresas e empreendedores que buscam se destacar no universo digital.
              </p>
              
              <p className="text-lg md:text-xl mb-6">
              Desde a criação de sites modernos e dinâmicos até o desenvolvimento de chatbots inteligentes e soluções poderosas baseadas em LLM (Large Language Models), nossa missão é tornar cada projeto único e impactante. Acreditamos que cada cliente merece uma abordagem personalizada, que combine criatividade, tecnologia de ponta e resultados tangíveis.
              </p>
              
              <p className="text-lg md:text-xl mb-6">
              Nossa jornada começa com uma simples ideia: entender suas necessidades e transformar essas ideias em experiências digitais que não apenas atendem às expectativas, mas as superam. Com uma equipe talentosa e apaixonada, trabalhamos de perto com nossos clientes para criar soluções inovadoras, escaláveis e que realmente fazem a diferença.
              </p>
              
              <p className="text-lg md:text-xl">
              Se você procura uma parceria que combine expertise, inovação e um compromisso com o sucesso do seu projeto, a Apollo Creations é o lugar certo para você.
              </p>
            </div>
          </div>
        </div>
        

      </main>
    </div>
  );
}