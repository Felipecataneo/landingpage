// ================================================
// FILE: src/app/projects/criar/page.tsx
// ================================================
'use client';

import React from 'react';
import { StudioProvider } from '@/providers/studio-provider';
import MainView from '@/app/components/main-view';

// REMOVE import styles if no longer needed for container styling
// import styles from './projectPage.module.scss';

export default function CriarPage() {
  return (
    <StudioProvider>
      {/* Add padding or margin here if the Appgen UI is too close to the header/footer */}
      {/* Example: <div className="pt-20 pb-20"> */}
        <MainView />
      {/* Example: </div> */}
    </StudioProvider>
  );
}