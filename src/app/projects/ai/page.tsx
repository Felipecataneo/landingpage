// ================================================
// FILE: src/app/projects/ai/page.tsx
// ================================================
import React from 'react';
import styles from './projectPage.module.scss';
import MarketingCampaignGenerator from '@/components/MarketingCampaignGenerator';

export default function AiPage() {
  return (
    <div className={styles.projectDetailPageWrapper}>
      <div className={styles.projectDetailPage}>
        <h1 className={styles.title}>
          Inteligência Artificial Aplicada
        </h1>
        
        <p className={styles.description}>
          Explore o futuro com nossas soluções personalizadas em Inteligência Artificial.
          Oferecemos desde análise de dados avançada até sistemas de automação inteligente para impulsionar a inovação no seu negócio.
          Abaixo, você pode experimentar uma das nossas aplicações práticas de IA - 
          um gerador de campanhas de marketing que cria estratégias personalizadas com base no produto e público-alvo informados.
        </p>
        
        <div className="w-full mb-8">
          <MarketingCampaignGenerator />
        </div>
      </div>
    </div>
  );
}