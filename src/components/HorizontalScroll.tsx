// app/components HorizontalScroll;.tsx (ou seu diretório preferido)
"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    image: "/site1.jpg",
    title: "Presença digital com propósito",
  },
  {
    image: "/site2.jpg",
    title: "Design que comunica.",
  },
  {
    image: "/site3.jpg",
    title: "Resultados que aparecem.",
  },
];

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768; // breakpoint do tailwind para sm/md
}

const HorizontalScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    const resize = () => setMobile(isMobile());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (mobile) {
      // Garante que todos os títulos estejam visíveis no mobile
      const titles = document.querySelectorAll(".hero-title");
      titles.forEach(title => {
        (title as HTMLElement).style.opacity = "1";
        (title as HTMLElement).style.transform = "translateY(0)";
      });
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const sections = gsap.utils.toArray<HTMLElement>(
      container.querySelectorAll(".panel")
    );
    gsap.set(container, { height: "100vh" });

    const scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + container.offsetWidth,
      },
    });

    sections.forEach((section, i) => {
      const title = section.querySelector(".hero-title");
      gsap.fromTo(
        title,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            containerAnimation: scrollTween,
            start: "left center",
            end: "right center",
            scrub: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [mobile]);

  return (
    <div
      ref={containerRef}
      className={
        mobile
          ? "flex flex-col w-screen h-auto overflow-x-hidden"
          : "relative flex w-[300vw] h-screen overflow-hidden"
      }
    >
      {slides.map((slide, i) => (
        <section
          key={i}
          className={
            'panel relative flex items-center justify-center ' +
            (mobile ? "w-full h-[65vh]" : "w-screen h-screen")
          }
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-black/40">
            <h1
              className={
                "hero-title text-white text-3xl md:text-7xl font-extrabold tracking-tighter text-center drop-shadow-2xl transition-all duration-500" +
                (mobile ? " opacity-100 !translate-y-0" : "")
              }
            >
              {slide.title}
            </h1>
          </div>
        </section>
      ))}
    </div>
  );
};

export default HorizontalScroll;