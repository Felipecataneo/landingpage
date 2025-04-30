// ================================================
// FILE: src/app/projects/criar/page.tsx
// ================================================
import React from 'react';
// You might import specific styles or components later
import styles from './projectPage.module.scss'; // Example style import

export default function CriarPage() {
  return (
     <div className={styles.projectDetailPage}>
      {/* Add project specific content here */}
      <h1 className={styles.title}>Detalhes do Projeto: Vamos Criar Juntos</h1>
      <p className={styles.description}>
        Acreditamos na colaboração para construir algo único. Nesta seção, mostramos exemplos de projetos
        onde a parceria com o cliente foi fundamental para o sucesso, desde a concepção até a entrega final.
      </p>
      {/* Add images, case studies, testimonials, etc. */}
       <div className={styles.imageContainer}>
        <img src="/images/criar.jpg" alt="Project Criar" className={styles.projectImage} />
      </div>
      {/* Add more sections as needed */}
    </div>
  );
}

