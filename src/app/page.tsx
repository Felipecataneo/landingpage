'use client';

import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion';
import Projects from '@/components/Projects';
import Landing from '@/components/Landing';
import Description from '@/components/Description';
import Contact from '@/components/Contact';
import SlidingImages from '@/components/SlidingImages';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect( () => {
    (
      async () => {
          const LocomotiveScroll = (await import('locomotive-scroll')).default
          const locomotiveScroll = new LocomotiveScroll();

          setTimeout( () => {
            setIsLoading(false);
            document.body.style.cursor = 'default'
            window.scrollTo(0,0);
          }, 2000)
      }
    )()
  }, [])

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
