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
}

const projects: ProjectData[] = [
  {
    title: "Sites",
    src: "/images/sites.jpg",
    color: "#000000"
  },
  {
    title: "Chatbots",
    src: "/images/bot.jpg",
    color: "#8C8C8C"
  },
  {
    title: "Soluções em IA",
    src: "/images/ai.jpg",
    color: "#EFE8D3"
  },
  {
    title: "Vamos Criar Juntos",
    src: "/images/criar.jpg",
    color: "#706D63"
  }
]

const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
  closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }
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
    // Configuração inicial das animações
    //Move Container
    xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" })
    yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" })
    //Move cursor
    xMoveCursor.current = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" })
    yMoveCursor.current = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" })
    //Move cursor label
    xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" })
    yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" })
  }, [])

  const moveItems = (x: number, y: number) => {
    if (!isMobile) {
      xMoveContainer.current!(x)
      yMoveContainer.current!(y)
      xMoveCursor.current!(x)
      yMoveCursor.current!(y)
      xMoveCursorLabel.current!(x)
      yMoveCursorLabel.current!(y)
    } else {
      // Em dispositivos móveis, centralizar o modal na tela
      if (modalContainer.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        xMoveContainer.current!(windowWidth / 2)
        yMoveContainer.current!(windowHeight / 2)
        xMoveCursor.current!(windowWidth / 2)
        yMoveCursor.current!(windowHeight / 2)
        xMoveCursorLabel.current!(windowWidth / 2)
        yMoveCursorLabel.current!(windowHeight / 2)
      }
    }
  }
  
  const manageModal = (active: boolean, index: number, x: number, y: number) => {
    moveItems(x, y)
    setModal({ active, index })
  }

  // Detectar eventos de toque para dispositivos móveis
  const handleTouchStart = (index: number) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    manageModal(true, index, windowWidth / 2, windowHeight / 2);
  }

  const handleTouchEnd = (index: number) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    manageModal(false, index, windowWidth / 2, windowHeight / 2);
  }

  return (
    <main 
      onMouseMove={(e) => { 
        if (!isMobile) moveItems(e.clientX, e.clientY) 
      }} 
      className={styles.projects}
    >
      <div className={styles.body}>
        {
          projects.map((project, index) => {
            return (
              <Project 
                index={index} 
                title={project.title} 
                manageModal={manageModal}
                key={index}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={() => handleTouchEnd(index)}
              />
            )
          })
        }
      </div>

      <>
        <motion.div 
          ref={modalContainer} 
          variants={scaleAnimation} 
          initial="initial" 
          animate={active ? "enter" : "closed"} 
          className={styles.modalContainer}
        >
          <div style={{ top: index * -100 + "%" }} className={styles.modalSlider}>
            {
              projects.map((project, index) => {
                const { src, color } = project
                return <div className={styles.modal} style={{ backgroundColor: color }} key={`modal_${index}`}>
                  <Image
                    src={src}
                    width={isMobile ? 200 : 300}
                    height={0}
                    alt="image"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              })
            }
          </div>
        </motion.div>
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
        ></motion.div>
      </>
    </main>
  )
}