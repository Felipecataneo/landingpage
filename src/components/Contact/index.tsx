import { useRef, useEffect, useState } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import Rounded from '../../common/RoundedButton';
import { useScroll, motion, useTransform } from 'framer-motion';
import Magnetic from '../../common/Magnetic';

export default function Contact() {
    const [isMobile, setIsMobile] = useState(false);
    const container = useRef(null);
    
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
    
    return (
        <motion.div 
            style={{ y }} 
            ref={container} 
            className={styles.contact}
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
                        <Rounded backgroundColor={"#0F4C5C"} className={styles.button}>
                            <p>Entre em contato</p>
                        </Rounded>
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
                    <Rounded>
                        <p>felipecataneo@hotmail.com</p>
                    </Rounded>
                    <Rounded>
                        <p>+55 (18)981168691</p>
                    </Rounded>
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
                                <p>Linkedin</p>
                            </Magnetic>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}