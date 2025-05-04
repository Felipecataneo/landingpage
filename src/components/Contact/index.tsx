import { useRef, useEffect, useState } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import Rounded from '../../common/RoundedButton';
import { useScroll, motion, useTransform } from 'framer-motion';
import Magnetic from '../../common/Magnetic';
import ParticleEffect from './ParticleEffect'; 

export default function Contact() {
    const [isMobile, setIsMobile] = useState(false);
    const container = useRef(null);
    const [showParticlesEmail, setShowParticlesEmail] = useState(false);
    const [showParticlesPhone, setShowParticlesPhone] = useState(false);
    const [particlePosEmail, setParticlePosEmail] = useState({ x: 0, y: 0 });
    const [particlePosPhone, setParticlePosPhone] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);
    
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    });
    
    // Adjust animation values based on screen size
    const xValue = isMobile ? 50 : 100;
    const yStartValue = isMobile ? -300 : -500;
    const rotateStartValue = isMobile ? 100 : 120;
    
    const x = useTransform(scrollYProgress, [0, 1], [0, xValue]);
    const y = useTransform(scrollYProgress, [0, 1], [yStartValue, 0]);
    const rotate = useTransform(scrollYProgress, [0, 1], [rotateStartValue, 90]);

    // email logic compartilhado
    const sendEmail = () => {
        window.location.href = "mailto:felipecataneo@hotmail.com";
    };
    
    // cada botão controla a partícula de forma independente
    const handleEmailClickTop = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setParticlePosEmail({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setShowParticlesEmail(true);
        setTimeout(() => setShowParticlesEmail(false), 900);
        sendEmail();
    };
    
    const handleEmailClickNav = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setParticlePosEmail({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setShowParticlesEmail(true);
        setTimeout(() => setShowParticlesEmail(false), 900);
        sendEmail();
    };
  
    
    const handlePhoneClick = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setParticlePosPhone({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setShowParticlesPhone(true);
        setTimeout(() => setShowParticlesPhone(false), 900);
        window.location.href = "https://wa.me/5518981168691";
    };
    
    
    return (
        <motion.div 
            style={{ y }} 
            ref={container} 
            className={styles.contact}
            id="contact"
        >
            <div className={styles.body}>
                <div className={styles.title}>
                    <span>
                        <div className={styles.imageContainer}>
                            <Image 
                                fill={true}
                                alt={"image"}
                                src={`/images/background.jpg`}
                            />
                        </div>
                        <h2>Vamos Trabalhar</h2>
                    </span>
                    <h2>juntos!</h2>
                    <motion.div style={{ x }} className={styles.buttonContainer}>
                        <div className="relative" onClick={handleEmailClickTop}>
                            <Rounded backgroundColor={"#0F4C5C"} className={styles.button}>
                            <p>Entre em contato</p>
                            </Rounded>
                            <ParticleEffect
                            color="#0F4C5C"
                            active={showParticlesEmail}
                            position={particlePosEmail}
                            />
                        </div>
                    </motion.div>
                    {!isMobile && (
                        <motion.svg 
                            style={{ rotate, scale: isMobile ? 1.5 : 2 }} 
                            width="9" 
                            height="9" 
                            viewBox="0 0 9 9" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z" fill="white"/>
                        </motion.svg>
                    )}
                </div>
                <div className={styles.nav}>
                    <div className="relative" onClick={handleEmailClickNav}>
                        <Rounded>
                        <p>felipecataneo@hotmail.com</p>
                        </Rounded>
                        <ParticleEffect
                        color="#0F4C5C"
                        active={showParticlesEmail}
                        position={particlePosEmail}
                        />
                    </div>

                    <div className="relative" onClick={handlePhoneClick}>
                        <Rounded>
                        <p>+55 (18)981168691</p>
                        </Rounded>
                        <ParticleEffect
                        color="#0F4C5C"
                        active={showParticlesPhone}
                        position={particlePosPhone}
                        />
                    </div>
                </div>

                <div className={styles.info}>
                    <div>
                        <span>
                            <h3>Versão</h3>
                            <p>2025</p>
                        </span>
                    </div>
                    <div>
                        <span>
                            <h3>Rede Social</h3>
                            <Magnetic>
                                <a
                                    href="https://www.linkedin.com/in/felipe-biava-cataneo-b66a7625/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <p>Linkedin</p>
                                </a>
                            </Magnetic>

                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}