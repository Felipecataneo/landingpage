'use client';
import React, { useState } from 'react';
import styles from './style.module.scss';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';

interface ProjectProps {
    index: number;
    title: string;
    manageModal: (active: boolean, index: number, x: number, y: number) => void;
    href: string;
    onTouchStart?: (e: React.TouchEvent) => void;
    onTouchEnd?: (e: React.TouchEvent) => void;
}

export default function Project({ index, title, manageModal, href, onTouchStart, onTouchEnd }: ProjectProps) {
    // Detectar se é dispositivo móvel
    const isMobile = useMediaQuery('(max-width: 768px)');
    // Estado para controlar se o preview já foi visto
    const [previewShown, setPreviewShown] = useState(false);
    // Router para navegação programática
    const router = useRouter();

    // Função para lidar com cliques/toques
    const handleClick = (e: React.MouseEvent) => {
        if (isMobile && !previewShown) {
            // No primeiro clique no mobile, apenas mostrar preview e impedir navegação
            e.preventDefault();
            setPreviewShown(true);
        }
        // Em desktop ou segundo clique no mobile, permite a navegação padrão
    };

    // Função para lidar com toques
    const handleTouch = (e: React.TouchEvent) => {
        if (!previewShown) {
            // Primeiro toque - mostrar preview
            e.preventDefault();
            if (onTouchStart) onTouchStart(e);
            setPreviewShown(true);
        } else {
            // Segundo toque - navegar para a página
            if (onTouchEnd) onTouchEnd(e);
            router.push(href);
        }
    };

    // Reset preview state quando mouse sai (para desktop)
    const handleMouseLeave = (e: React.MouseEvent) => {
        manageModal(false, index, e.clientX, e.clientY);
        setPreviewShown(false);
    };

    return (
        
        <Link
            href={href}
            className={`${styles.project} ${previewShown ? styles.previewActive : ''}`}
            onClick={handleClick}
            onMouseEnter={(e) => {
                manageModal(true, index, e.clientX, e.clientY);
            }}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouch}
        >
            <div className={styles.projectTitle}>
                <h2>{title}</h2>
                <p>Criações</p>
            </div>
            {/* Instrução visual para segundo toque (apenas em mobile) */}
            {isMobile && previewShown && (
                <div className={styles.tapInstruction}>
                    Toque novamente para acessar
                </div>
            )}
        </Link>
    )
}