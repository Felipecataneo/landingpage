'use client';

import React from 'react';
import { StudioProvider } from '@/providers/studio-provider';
import MainView from '@/app/components/main-view';

export default function CriarPage() {
  return (
    <StudioProvider>
      <div className="pt-2 pb-20 w-screen min-h-screen overflow-hidden relative bg-gradient-to-br from-gray-800 via-black to-gray-700">
        {/* Elementos de gradiente para criar efeito similar ao SCSS */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,255,255,0.05),transparent)] animate-pulse opacity-40 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.05),transparent)] animate-pulse opacity-40 pointer-events-none"></div>
        
        {/* Conteúdo principal */}
        <div className="relative z-10">
          <MainView />
        </div>
      </div>
    </StudioProvider>
  );
}