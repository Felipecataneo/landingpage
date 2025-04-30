import styles from './style.module.scss';
import { useInView, motion, Variants } from 'framer-motion';
import { useRef } from 'react';
import { slideUp, opacity } from './animation';
import Rounded from '../../common/RoundedButton';

export default function index() {

    const phrase = "Nosso time não apenas entrega designs estonteantes, mas também implementa chatbots com inteligência artificial para engajar seus visitantes de forma inteligente e eficaz. ";
    const description = useRef(null);
    const isInView = useInView(description)
    return (
        <div ref={description} className={styles.description}>
            <div className={styles.body}>
                <p>
                {
                    phrase.split(" ").map( (word, index) => {
                        return <span key={index} className={styles.mask}>
                            <motion.span 
                                variants={slideUp as Variants} 
                                custom={index} 
                                animate={isInView ? "open" : "closed"} 
                                key={index}
                            >{word}</motion.span>
                        </span>
                    })
                }
                </p>
                <motion.p 
                    variants={opacity as Variants} 
                    animate={isInView ? "open" : "closed"}
                ></motion.p>
                <div data-scroll data-scroll-speed={0.1}>
                    <Rounded className={styles.button}>
                        <p>Sobre nós</p>
                    </Rounded>
                </div>
            </div>
        </div>
    )
}