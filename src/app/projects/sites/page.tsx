'use client';

import React, { useEffect, useState } from 'react';
import HorizontalScroll from '@/components/HorizontalScroll'; // Seu componente de scroll horizontal
import ScrollVideoComponent from '@/components/ScrollVideoComponent'; // Seu componente de scroll de vídeo

// Defina o breakpoint. Ex: 768px para md (Tailwind)
const MOBILE_BREAKPOINT = 768;

export default function SitesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // Para evitar hydration mismatch

  useEffect(() => {
    // Esta função só será chamada no cliente
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Verifica no mount inicial
    checkDevice();
    setHasMounted(true); // Marcar que o componente montou no cliente

    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []); // Array de dependências vazio para rodar apenas no mount e unmount

  // Para evitar hydration mismatch com o SSR/SSG.
  // O servidor pode não saber o tamanho da tela, então esperamos a montagem no cliente.
  if (!hasMounted) {
    // Pode retornar um loader, ou null, ou uma versão padrão (ex: desktop)
    // se um flash breve for aceitável.
    // Para este caso, retornar null ou um placeholder é mais seguro contra hydration errors.
    // Ou, como HorizontalScroll é o default para desktop, podemos renderizá-lo
    // e ele será substituído se for mobile no cliente.
    // Vamos optar por renderizar o default (desktop) para evitar uma tela vazia.
    // return null; // Ou <LoadingSpinner />
    // Se você quiser evitar qualquer flash, renderize null e depois o componente correto.
    // Se um flash rápido do HorizontalScroll em mobile (antes de trocar pro video) for aceitável,
    // pode-se omitir o `if (!hasMounted)` e inicializar `isMobile` com um valor padrão que
    // provavelmente será o do desktop.
    // Ex: useState(typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false);
    // No entanto, o padrão com `hasMounted` é mais robusto.
  }

  return (
    <>
      {/* Conteúdo que aparece ANTES do scroll principal */}
      {/* <Header /> por exemplo */}

      {isMobile && hasMounted ? (
        <ScrollVideoComponent videoSrc="/videos/video.mp4" />
      ) : hasMounted ? ( // Renderiza HorizontalScroll se não for mobile E já montou
        <HorizontalScroll />
      ) : (
        // Fallback enquanto !hasMounted (opcional, pode ser null ou um loader)
        // Para evitar layout shift, pode-se renderizar o HorizontalScroll por default
        // já que é a experiência para telas maiores, e o ajuste para mobile ocorre no cliente.
        // Se hasMounted for falso, o SSR/primeira renderização pode mostrar HorizontalScroll.
        // Este bloco é se você retornou null no `if (!hasMounted)`
        <div className="w-screen h-screen bg-black flex items-center justify-center">
            {/* <p className="text-white">Carregando...</p> */}
            {/* Ou renderize o HorizontalScroll aqui como default */}
            <HorizontalScroll /> 
        </div>
      )}
      
      {/* Conteúdo que aparece APÓS o scroll principal (Horizontal ou Vídeo) */}
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
          Esta página é apenas o começo de uma jornada criativa. Na Apollo Creations, cada clique revela uma nova possibilidade, cada seção foi pensada para inspirar, surpreender e mostrar do que somos capazes.
          Nossos projetos vão além do visual — eles entregam desempenho, inovação e resultados reais.
          Explore o site e descubra como unimos design, tecnologia e estratégia para transformar ideias em experiências digitais impactantes.
          Seu próximo projeto pode começar por aqui.
          </p>
        </div>
      </div>
    </>
  );
}