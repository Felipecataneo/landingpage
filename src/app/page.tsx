'use client';

import Projects from '@/components/Projects';
import Landing from '@/components/Landing';
import Description from '@/components/Description';
import Contact from '@/components/Contact';
import SlidingImages from '@/components/SlidingImages';

export default function Home() {
  

  return (
    <main >
      <Landing />
      <Description />
      <Projects />
      <SlidingImages />
      <Contact />

    </main>
  );
}
