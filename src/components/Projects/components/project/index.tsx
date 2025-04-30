// ================================================
// FILE: src/components/Projects/components/project/index.tsx
// ================================================
'use client';
import React from 'react';
import styles from './style.module.scss';
import Link from 'next/link';

interface ProjectProps {
    index: number;
    title: string;
    manageModal: (active: boolean, index: number, x: number, y: number) => void;
    href: string; // Added href prop
    onTouchStart?: (e: React.TouchEvent) => void; // Added touch props
    onTouchEnd?: (e: React.TouchEvent) => void;
}

export default function Project({ index, title, manageModal, href, onTouchStart, onTouchEnd }: ProjectProps) {
    return (
        <Link
            href={href} // Use the passed href
            className={styles.project}
            onMouseEnter={(e) => {
                // Only show modal on hover on non-mobile
                 // isMobile check is done inside manageModal now, but can be explicit here too
                manageModal(true, index, e.clientX, e.clientY);
            }}
            onMouseLeave={(e) => {
                // Only hide modal on mouse leave on non-mobile
                 // isMobile check is done inside manageModal now, but can be explicit here too
                manageModal(false, index, e.clientX, e.clientY);
            }}
            // Pass touch handlers down
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className={styles.projectTitle}>
                <h2>{title}</h2>
                <p>Criações</p>
            </div>
        </Link>
    )
}