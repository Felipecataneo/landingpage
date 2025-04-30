import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';

interface MagneticProps {
    children: React.ReactNode;
}

export default function Magnetic({ children }: MagneticProps) {
    const magnetic = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const mouseMoveHandler = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const rect = magnetic.current?.getBoundingClientRect();
            if (rect) {
                const { height, width, left, top } = rect;
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);
                xTo(x * 0.35);
                yTo(y * 0.35);
            }
        };

        const mouseLeaveHandler = () => {
            xTo(0);
            yTo(0);
        };

        magnetic.current?.addEventListener("mousemove", mouseMoveHandler);
        magnetic.current?.addEventListener("mouseleave", mouseLeaveHandler);

        return () => {
            magnetic.current?.removeEventListener("mousemove", mouseMoveHandler);
            magnetic.current?.removeEventListener("mouseleave", mouseLeaveHandler);
        };
    }, []);

    return (
        <div ref={magnetic} style={{ display: "inline-block" }}>
            {children}
        </div>
    );
}