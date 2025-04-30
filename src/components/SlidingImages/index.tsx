import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import styles from './style.module.scss';
import Image from 'next/image';

const slider1 = [
    {
        color: "#e3e5e7",
        src: "11.jpg"
    },
    {
        color: "#d6d7dc",
        src: "12.jpg"
    },
    {
        color: "#e3e3e3",
        src: "13.jpg"
    },
    {
        color: "#21242b",
        src: "14.jpg"
    }
]

const slider2 = [
    {
        color: "#d4e3ec",
        src: "21.jpg"
    },
    {
        color: "#e5e0e1",
        src: "22.jpg"
    },
    {
        color: "#d7d4cf",
        src: "23.jpg"
    },
    {
        color: "#e1dad6",
        src: "24.jpg"
    }
]

export default function SlidingImages() {
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
        offset: ["start end", "end start"]
    });

    // Adjust the amount of movement based on screen size
    const x1Value = isMobile ? 100 : 150;
    const x2Value = isMobile ? -100 : -150;
    
    const x1 = useTransform(scrollYProgress, [0, 1], [0, x1Value]);
    const x2 = useTransform(scrollYProgress, [0, 1], [0, x2Value]);
    const height = useTransform(scrollYProgress, [0, 0.9], [isMobile ? 30 : 50, 0]);

    return (
        <div ref={container} className={styles.slidingImages}>
            <motion.div style={{x: x1}} className={styles.slider}>
                {
                    slider1.map((project, index) => {
                        return (
                            <div key={index} className={styles.project} style={{backgroundColor: project.color}}>
                                <div className={styles.imageContainer}>
                                    <Image 
                                        fill={true}
                                        alt={"image"}
                                        src={`/images/${project.src}`}
                                    />
                                </div>
                            </div>
                        );
                    })
                }
            </motion.div>
            <motion.div style={{x: x2}} className={styles.slider}>
                {
                    slider2.map((project, index) => {
                        return (
                            <div key={index} className={styles.project} style={{backgroundColor: project.color}}>
                                <div className={styles.imageContainer}>
                                    <Image 
                                        fill={true}
                                        alt={"image"}
                                        src={`/images/${project.src}`}
                                    />
                                </div>
                            </div>
                        );
                    })
                }
            </motion.div>
            <motion.div style={{height}} className={styles.circleContainer}>
                <div className={styles.circle}></div>
            </motion.div>
        </div>
    );
}