// ================================================
// FILE: src/app/projects/ai/page.tsx
// ================================================
import React from 'react';
// You might import specific styles or components later
import styles from './projectPage.module.scss'; // Example style import

export default function AiPage() {
  return (
     <div className={styles.projectDetailPage}>
      {/* Add project specific content here */}
      <h1 className={styles.title}>Detalhes do Projeto: Soluções em IA</h1>
      <p className={styles.description}>
        Explore o futuro com nossas soluções personalizadas em Inteligência Artificial.
        Oferecemos desde análise de dados avançada até sistemas de automação inteligente para impulsionar a inovação no seu negócio.
      </p>
      {/* Add images, case studies, testimonials, etc. */}
       <div className={styles.imageContainer}>
        <img src="/images/ai.jpg" alt="Project AI" className={styles.projectImage} />
      </div>
      {/* Add more sections as needed */}
    </div>
  );
}
