'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './style.module.scss';
import Project from './components/project';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/useMediaQuery';


interface ProjectData {
  title: string;
  src: string;
  color: string;
  href: string;
}

const projects: ProjectData[] = [
  {
    title: "Sites",
    src: "/images/sites.jpg",
    color: "#000000",
    href: "/projects/sites"
  },
  {
    title: "Chatbots",
    src: "/images/bot.jpg",
    color: "#8C8C8C",
    href: "/projects/chatbots"
  },
  {
    title: "Soluções em IA",
    src: "/images/ai.jpg",
    color: "#EFE8D3",
    href: "/projects/ai"
  },
  {
    title: "Vamos Criar Juntos",
    src: "/images/criar.jpg",
    color: "#706D63",
    href: "/projects/criar"
  }
]

const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
  closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }
}

// Animação específica para mobile (centralizada na tela)
const mobileAnimation = {
  initial: { opacity: 0, scale: 0.8, x: "-50%", y: "-50%" },
  enter: { opacity: 1, scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } },
  closed: { opacity: 0, scale: 0.8, x: "-50%", y: "-50%", transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] } }
}

interface ModalState {
  active: boolean;
  index: number;
}

export default function Projects() {
  const [modal, setModal] = useState<ModalState>({ active: false, index: 0 })
  const { active, index } = modal;
  const modalContainer = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLDivElement>(null);
  
  // Detectar tamanho da tela
  const isMobile = useMediaQuery('(max-width: 768px)');

  let xMoveContainer = useRef<gsap.QuickToFunc | null>(null);
  let yMoveContainer = useRef<gsap.QuickToFunc | null>(null);
  let xMoveCursor = useRef<gsap.QuickToFunc | null>(null);
  let yMoveCursor = useRef<gsap.QuickToFunc | null>(null);
  let xMoveCursorLabel = useRef<gsap.QuickToFunc | null>(null);
  let yMoveCursorLabel = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    // Configuração inicial das animações apenas para desktop
    if (!isMobile) {
      // Move Container
      xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" })
      yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" })
      // Move cursor
      xMoveCursor.current = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" })
      yMoveCursor.current = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" })
      // Move cursor label
      xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" })
      yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" })
    }
  }, [isMobile])

  const moveItems = (x: number, y: number) => {
    if (!isMobile) {
      xMoveContainer.current?.(x)
      yMoveContainer.current?.(y)
      xMoveCursor.current?.(x)
      yMoveCursor.current?.(y)
      xMoveCursorLabel.current?.(x)
      yMoveCursorLabel.current?.(y)
    }
  }
  
  const manageModal = (active: boolean, index: number, x: number, y: number) => {
    if (!isMobile) {
      moveItems(x, y);
    }
    
    // Atualizar o estado do modal com o index correto, independente se for mobile ou desktop
    setModal({ active, index });

    // Em dispositivos móveis, prevenir scroll quando o modal estiver ativo
    if (isMobile) {
      if (active) {
        document.body.classList.add(styles.modalOpen);
      } else {
        document.body.classList.remove(styles.modalOpen);
      }
    }
  }

  // Handle touch para móvel - agora preserva o índice do projeto clicado
  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    // Impedir o comportamento padrão para evitar problemas no iOS
    e.preventDefault();
    e.stopPropagation();
    
    // Importante: usar o índice correto do projeto tocado
    manageModal(true, index, window.innerWidth / 2, window.innerHeight / 2);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Fechar o modal - usado quando queremos navegar para outra página
    // ou quando o usuário abandona o preview
    e.preventDefault();
    e.stopPropagation();
    
    manageModal(false, index, 0, 0);
  };

  return (
    <main 
      onMouseMove={(e) => { 
        if (!isMobile) moveItems(e.clientX, e.clientY) 
      }} 
      className={styles.projects}
      id="projects"
    >
      <div className={styles.body}>
        {
          projects.map((project, i) => {
            return (
              <Project 
                index={i} 
                title={project.title} 
                manageModal={manageModal}
                key={i}
                href={project.href}
                onTouchStart={(e) => handleTouchStart(i, e)}
                onTouchEnd={handleTouchEnd}
              />
            )
          })
        }
      </div>

      {/* Renderizar modal com a animação específica para cada dispositivo */}
      <motion.div
        ref={modalContainer}
        variants={isMobile ? mobileAnimation : scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
        className={`${styles.modalContainer} ${isMobile ? styles.modalContainerMobile : ''}`}
      >
        <div 
          style={{ top: index * -100 + "%" }} 
          className={styles.modalSlider}
        >
          {
            projects.map((project, i) => {
              const { src, color } = project
              return (
                <div 
                  className={styles.modal} 
                  style={{ backgroundColor: color }} 
                  key={`modal_${i}`}
                >
                  <Image
                    src={src}
                    width={isMobile ? 200 : 300}
                    height={0}
                    alt={project.title}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              )
            })
          }
        </div>
      </motion.div>

      {/* Cursores apenas para desktop */}
      {!isMobile && (
        <>
          <motion.div
            ref={cursor}
            className={styles.cursor}
            variants={scaleAnimation}
            initial="initial"
            animate={active ? "enter" : "closed"}
          ></motion.div>
          <motion.div
            ref={cursorLabel}
            className={styles.cursorLabel}
            variants={scaleAnimation}
            initial="initial"
            animate={active ? "enter" : "closed"}
          >Veja</motion.div>
        </>
      )}
    </main>
  )
}