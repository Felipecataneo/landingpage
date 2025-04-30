// ================================================
// FILE: src/app/projects/sites/page.tsx
// ================================================
import React from 'react';
// You might import specific styles or components later
import styles from './projectPage.module.scss'; // Example style import

export default function SitesPage() {
  return (
    <div className={styles.projectDetailPage}>
      {/* Add project specific content here */}
      <h1 className={styles.title}>Detalhes do Projeto: Sites</h1>
      <p className={styles.description}>
        Aqui você encontrará informações detalhadas sobre nossos projetos de criação de sites.
        Exploramos as melhores práticas de design e desenvolvimento para criar experiências web incríveis e responsivas.
        Veja exemplos, tecnologias utilizadas e o impacto de nossos sites para os clientes.
      </p>
      {/* Add images, case studies, testimonials, etc. */}
      {/* Example placeholder image */}
      <div className={styles.imageContainer}>
        <img src="/images/sites.jpg" alt="Project Sites" className={styles.projectImage} />
      </div>
      {/* Add more sections as needed */}
    </div>
  );
}

