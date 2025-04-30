// ================================================
// FILE: src/app/projects/chatbots/page.tsx
// ================================================
import React from 'react';
// You might import specific styles or components later
import styles from './projectPage.module.scss'; // Example style import

export default function ChatbotsPage() {
  return (
     <div className={styles.projectDetailPage}>
      {/* Add project specific content here */}
      <h1 className={styles.title}>Detalhes do Projeto: Chatbots</h1>
      <p className={styles.description}>
        Construímos chatbots inteligentes e eficientes para otimizar a comunicação da sua empresa.
        Saiba como nossas soluções podem melhorar o atendimento ao cliente, automatizar tarefas e integrar-se aos seus sistemas existentes.
      </p>
      {/* Add images, case studies, testimonials, etc. */}
       <div className={styles.imageContainer}>
        <img src="/images/bot.jpg" alt="Project Chatbots" className={styles.projectImage} />
      </div>
      {/* Add more sections as needed */}
    </div>
  );
}

