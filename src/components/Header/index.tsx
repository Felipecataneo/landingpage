'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import Nav from './nav';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Rounded from '../../common/RoundedButton';
import Magnetic from '../../common/Magnetic';

export default function index() {
    const header = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const pathname = usePathname();
    const button = useRef(null);
    
    // Verificar se estamos na página principal
    const isHomePage = pathname === '/';
    
    // Verificar largura da tela (para responsividade)
    const [isMobile, setIsMobile] = useState(false);
    
    // Detectar tamanho da tela
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        // Verificar na inicialização
        checkMobile();
        
        // Verificar quando a janela for redimensionada
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
      if(isActive) setIsActive(false);
    }, [pathname]);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        // Comportamento só para página inicial
        if (isHomePage) {
            gsap.to(button.current, {
                scrollTrigger: {
                    trigger: document.documentElement,
                    start: 0,
                    end: window.innerHeight,
                    onLeave: () => {gsap.to(button.current, {scale: 1, duration: 0.25, ease: "power1.out"})},
                    onEnterBack: () => {gsap.to(button.current, {scale: 0, duration: 0.25, ease: "power1.out", onComplete: () => setIsActive(false)})}
                }
            });
        } else if (isMobile) {
            // Para outras páginas em mobile, mostrar botão imediatamente
            gsap.to(button.current, {
                scale: 1,
                duration: 0.25, 
                ease: "power1.out"
            });
        }
    }, [pathname, isHomePage, isMobile]);

    return (
        <>
        <div ref={header} className={`${styles.header} ${!isHomePage ? styles.headerOtherPages : ''}`}>
            <div className={styles.logo}>
                <p className={styles.copyright}>©</p>
                <div className={styles.name}>
                    <p className={styles.apollo}>Apollo</p>
                    <p className={styles.creations}>Creations</p>
                    <p className={styles.snellenberg}>Aproveite!</p>
                </div>
            </div>
            <div className={styles.nav}>
                <Magnetic>
                    <div className={styles.el}>
                        <a href="/#projects">Projetos</a>
                        <div className={styles.indicator}></div>
                    </div>
                </Magnetic>
                <Magnetic>
                    <div className={styles.el}>
                        <a href="/about">Sobre</a>
                        <div className={styles.indicator}></div>
                    </div>
                </Magnetic>
                <Magnetic>
                    <div className={styles.el}>
                        <a href="/#contact">Contato</a>
                        <div className={styles.indicator}></div>
                    </div>
                </Magnetic>
            </div>
        </div>
        <div 
            ref={button} 
            className={`${styles.headerButtonContainer} ${!isHomePage || isMobile ? styles.otherPage : ''}`}
        >
            <Rounded onClick={() => {setIsActive(!isActive)}} className={`${styles.button}`}>
                <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
            </Rounded>
        </div>
        <AnimatePresence mode="wait">
            {isActive && <Nav />}
        </AnimatePresence>
        </>
    );
}