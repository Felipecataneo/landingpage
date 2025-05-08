"use client";
import React, { useEffect, useRef, useState } from 'react';

interface ScrollVideoProps {
  videoSrc: string;
}

// Defina a altura do "scroll track" para o vídeo.
// Quanto maior, mais rolagem será necessária para percorrer o vídeo.
// Ex: 300vh significa que 3x a altura da tela de rolagem = duração total do vídeo.
const SCROLL_TRACK_HEIGHT_VH = 300; // Ajuste conforme necessário (ex: 300 = 3x viewport height)

const ScrollVideoComponent: React.FC<ScrollVideoProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Container que define a "duração" da rolagem
  const stickyVideoWrapperRef = useRef<HTMLDivElement>(null); // Container que segura o vídeo fixo

  const [progress, setProgress] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState<number | null>(null);
  const [videoDuration, setVideoDuration] = useState(8); // Fallback, será atualizado

  const phrases = [
    "Presença digital com propósito",
    "Design que comunica",
    "Resultados que aparecem"
  ];

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleMetadata = () => {
        if (videoElement.duration && isFinite(videoElement.duration)) {
          setVideoDuration(videoElement.duration);
        }
      };
      videoElement.addEventListener('loadedmetadata', handleMetadata);
      // Se metadados já carregados
      if (videoElement.readyState >= videoElement.HAVE_METADATA) {
        handleMetadata();
      }
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleMetadata);
      };
    }
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || !videoRef.current || !stickyVideoWrapperRef.current) return;

      const scrollContainer = scrollContainerRef.current;
      const video = videoRef.current;
      
      // Posição do topo do container de rolagem em relação ao topo da viewport
      const { top: scrollContainerTop, height: scrollContainerHeight } = scrollContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // A distância total que pode ser rolada dentro do scrollContainer para controlar o vídeo
      // O vídeo fica sticky, então a rolagem efetiva é a altura do container menos a altura da viewport
      // (porque quando o fundo do container atinge o fundo da viewport, o vídeo deve estar em 100%)
      const scrollableDistance = scrollContainerHeight - viewportHeight;

      if (scrollableDistance <= 0) { // Caso o container seja menor ou igual à viewport
        setProgress(scrollContainerTop <=0 ? 1 : 0); // Ou está totalmente visível ou já passou
        return;
      }

      // Quanto do scrollContainer já passou "para cima" da viewport.
      // Quando scrollContainerTop é 0, currentScroll is 0.
      // Quando scrollContainerTop é -scrollableDistance, currentScroll é scrollableDistance.
      let currentScroll = -scrollContainerTop;
      
      let scrollProgress = 0;
      if (currentScroll <= 0) { // Acima do início da "trilha de rolagem"
        scrollProgress = 0;
      } else if (currentScroll >= scrollableDistance) { // Abaixo do fim da "trilha de rolagem"
        scrollProgress = 1;
      } else {
        scrollProgress = currentScroll / scrollableDistance;
      }
      
      setProgress(scrollProgress);
      
      if (video) {
        video.currentTime = scrollProgress * videoDuration;
      }
      
      // Controlar as frases com base no progresso
      // Ajuste os ranges para corresponder à sensação desejada
      const phraseTriggerPoints = {
        start: [0.05, 0.38, 0.71], // Quando a frase DEVE aparecer
        end: [0.28, 0.61, 0.94]    // Quando a frase DEVE desaparecer
      };

      let activePhrase = null;
      for (let i = 0; i < phrases.length; i++) {
        if (scrollProgress > phraseTriggerPoints.start[i] && scrollProgress < phraseTriggerPoints.end[i]) {
          activePhrase = i;
          break;
        }
      }
      setCurrentPhrase(activePhrase);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Chamar uma vez para inicializar a posição correta

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [videoDuration, phrases.length]); // Adicionar phrases.length se a quantidade de frases for dinâmica

  return (
    // Este é o container que define a altura total da "trilha de rolagem" para o vídeo
    <div 
      ref={scrollContainerRef} 
      className="relative w-full" // Largura total
      style={{ height: `${SCROLL_TRACK_HEIGHT_VH}vh` }} // Altura dinâmica baseada na constante
    >
      {/* Este container segura o vídeo e o faz ficar "sticky" (fixo na tela) */}
      <div ref={stickyVideoWrapperRef} className="sticky top-0 w-screen h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover" // object-cover mantém o aspecto e preenche
          src={videoSrc}
          muted
          playsInline
          preload="metadata" // Ajuda a carregar a duração mais rápido
        />
        
        {/* Overlay para as frases */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-4">
            {currentPhrase !== null && (
              <p 
                className="text-white text-2xl md:text-4xl lg:text-5xl font-bold transition-opacity duration-500 ease-in-out"
                style={{ 
                  opacity: 1, // A lógica de aparição já está no currentPhrase
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
                }}
              >
                {phrases[currentPhrase]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideoComponent;