'use client'
import Image from 'next/image'
import styles from './style.module.scss'
import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { slideUp } from './animation';
import { motion } from 'framer-motion';

export default function Home() {

  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;
  let direction = -1;
  
  // Estado para armazenar a largura da janela
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Atualizar a largura da janela quando a tela for redimensionada
  useEffect(() => {
    // Só executa no cliente
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Ajuste a distância de animação com base no tamanho da tela
    const slideDistance = windowWidth < 768 ? "-300px" : "-500px";
    
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: e => direction = e.direction * -1
      },
      x: slideDistance,
    })
    requestAnimationFrame(animate);
  }, [windowWidth]) // Re-executar quando a largura da janela mudar

  const animate = () => {
    if(xPercent < -100){
      xPercent = 0;
    }
    else if(xPercent > 0){
      xPercent = -100;
    }
    gsap.set(firstText.current, {xPercent: xPercent})
    gsap.set(secondText.current, {xPercent: xPercent})
    requestAnimationFrame(animate);
    // Ajuste a velocidade de animação com base no tamanho da tela
    const speed = windowWidth < 768 ? 0.05 : 0.1;
    xPercent += speed * direction;
  }

  return (
    <motion.main variants={slideUp} initial="initial" animate="enter" className={styles.landing}>
      <Image 
        src="/images/background.jpg"
        fill={true}
        alt="background"
        priority
        sizes="100vw"
        quality={90}
      />
      <div className={styles.sliderContainer}>
        <div ref={slider} className={styles.slider}>
          <p ref={firstText}>Apollo Creations -</p>
          <p ref={secondText}>Apollo Creations -</p>
        </div>
      </div>

    </motion.main>
  )
}