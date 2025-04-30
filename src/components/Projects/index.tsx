// ================================================
// FILE: src/components/Projects/index.tsx
// ================================================
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
  href: string; // Added href
}

const projects: ProjectData[] = [
  {
    title: "Sites",
    src: "/images/sites.jpg",
    color: "#000000",
    href: "/projects/sites" // Added href
  },
  {
    title: "Chatbots",
    src: "/images/bot.jpg",
    color: "#8C8C8C",
    href: "/projects/chatbots" // Added href
  },
  {
    title: "Soluções em IA",
    src: "/images/ai.jpg",
    color: "#EFE8D3",
    href: "/projects/ai" // Added href
  },
  {
    title: "Vamos Criar Juntos",
    src: "/images/criar.jpg",
    color: "#706D63",
    href: "/projects/criar" // Added href
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
      // The modal positioning on mobile needs careful consideration if you want it fixed.
      // This current logic centers it based on mouse/touch position, which isn't ideal for mobile.
      // A fixed modal overlay might be better for mobile UX, but keeping the existing centering for now.
      if (modalContainer.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // Note: QuickTo is designed for elements following the cursor, not fixed positioning.
        // For a fixed mobile modal, you'd likely use CSS classes or direct state/style updates
        // rather than QuickTo with window center coordinates.
         // Example QuickTo usage here would follow where the *touch* occurred, not center the modal.
         // Let's refine this slightly for mobile: the modal should just appear centered or as an overlay.
         // We will remove the QuickTo for mobile modal positioning and rely on CSS for its placement when active.
      }
    }
  }
  
  const manageModal = (active: boolean, index: number, x: number, y: number) => {
     // Only move items on desktop
    if (!isMobile) {
       moveItems(x, y);
    }
    setModal({ active, index });

     // On mobile, if modal is active, perhaps prevent body scroll or apply a fixed class
     if (isMobile) {
        if (active) {
           // Add a class to body to fix position or handle overlay
           document.body.classList.add(styles.modalOpen); // Need to define this style
        } else {
           // Remove the class
           document.body.classList.remove(styles.modalOpen);
        }
     }
  }

    // Handle touch start for mobile modal preview
    const handleTouchStart = (index: number, e: React.TouchEvent) => {
        // Prevent default touch behavior to potentially stop scroll
        e.preventDefault();
        // On touch start, show modal. Positioning might be simple CSS fixed/centered.
        manageModal(true, index, e.touches[0].clientX, e.touches[0].clientY);
    };

    // Handle touch end for mobile modal preview
    const handleTouchEnd = (index: number, e: React.TouchEvent) => {
        // On touch end, hide modal
        manageModal(false, index, 0, 0); // Pass dummy coords
    };


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
                href={project.href} // Pass href here
                // Pass touch handlers to Project component
                onTouchStart={(e) => handleTouchStart(index, e)}
                onTouchEnd={(e) => handleTouchEnd(index, e)}
              />
            )
          })
        }
      </div>

      {/* Render modal and cursors only if not on mobile or if the modal is active */}
      {(!isMobile || active) && (
        <>
            {/* For mobile, modal positioning should be handled by CSS when active */}
            <motion.div
                ref={modalContainer}
                variants={isMobile ? { // Simplified animation for mobile
                  initial: { opacity: 0 },
                  enter: { opacity: 1, transition: { duration: 0.3 } },
                  closed: { opacity: 0, transition: { duration: 0.3 } }
                } : scaleAnimation} // Use scale animation for desktop
                initial="initial"
                animate={active ? "enter" : "closed"}
                className={`${styles.modalContainer} ${isMobile && active ? styles.modalContainerMobileActive : ''}`} // Add active mobile class
            >
                <div style={{ top: isMobile ? '0%' : index * -100 + "%" }} className={styles.modalSlider}> {/* Mobile slider might not need translation */}
                    {
                        projects.map((project, index) => {
                            const { src, color } = project
                            return <div className={styles.modal} style={{ backgroundColor: color }} key={`modal_${index}`}>
                                <Image
                                    src={src}
                                    width={isMobile ? 200 : 300} // Adjust image size for mobile
                                    height={0} // height="auto" is preferred but requires specific setup or is default with width
                                    alt="image"
                                    style={{ maxWidth: '100%', height: 'auto' }} // Maintain aspect ratio
                                />
                            </div>
                        })
                    }
                </div>
            </motion.div>

            {/* Cursors are typically desktop-only */}
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
                    >Veja</motion.div> {/* Added label text */}
                </>
            )}
        </>
      )}
    </main>
  )
}