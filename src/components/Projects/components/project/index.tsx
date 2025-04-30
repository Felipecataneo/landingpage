'use client';
import React from 'react';
import styles from './style.module.scss';
import Link from 'next/link';

interface ProjectProps {
    index: number;
    title: string;
    manageModal: (active: boolean, index: number, x: number, y: number) => void;
    onTouchStart?: () => void;
    onTouchEnd?: () => void;
}

export default function Project({ index, title, manageModal, onTouchStart, onTouchEnd }: ProjectProps) {
    return (
        <Link 
            href="/" 
            className={styles.project} 
            onMouseEnter={(e) => { 
                manageModal(true, index, e.clientX, e.clientY);
            }}
            onMouseLeave={(e) => {
                manageModal(false, index, e.clientX, e.clientY);
            }}
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