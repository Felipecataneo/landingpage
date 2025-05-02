import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useTransform, useScroll } from 'framer-motion';

// Componente de Partículas para efeitos
interface ParticleEffectProps {
  color: string;
  active: boolean;
  position: { x: number; y: number };
}

const ParticleEffect = ({ color, active, position }: ParticleEffectProps) => {
  const particleCount = 12;
  const particles = Array.from({ length: particleCount });
  
  return (
    <AnimatePresence>
      {active && (
        <div className="absolute" style={{ 
          top: position.y, 
          left: position.x,
          pointerEvents: 'none',
          zIndex: 100
        }}>
          {particles.map((_, i) => {
            const angle = (i / particleCount) * 360;
            const distance = Math.random() * 80 + 20;
            
            return (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  top: 0,
                  left: 0,
                }}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, Math.cos(angle * (Math.PI / 180)) * distance],
                  y: [0, Math.sin(angle * (Math.PI / 180)) * distance],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  times: [0, 0.4, 1]
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ParticleEffect;