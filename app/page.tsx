"use client";

import { SequenceScroll } from "@/components/SequenceScroll";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function FadeInText({
  children,
  offsetStart,
  offsetEnd,
}: {
  children: React.ReactNode;
  offsetStart: number; // 0 to 1
  offsetEnd: number; // 0 to 1
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-20%" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="max-w-2xl mx-auto text-center"
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center z-10 pointers-event-none">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6"
        >
          THE SEQUENCE.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/50 tracking-widest font-mono uppercase"
        >
          Scroll to explore
        </motion.p>
      </section>

      {/* Scrollytelling Experience */}
      <SequenceScroll>
        {/* Story Overlays - These scroll normally over the pinned canvas */}
        <div className="h-[100vh]" /> {/* Offset past the canvas start */}
        
        <div className="h-[100vh] flex items-center justify-center">
          <FadeInText offsetStart={0.1} offsetEnd={0.3}>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-2xl">
              A Visual Odyssey
            </h2>
            <p className="text-xl text-white/70 drop-shadow-lg">
              Linked mathematically to your scroll progression.
            </p>
          </FadeInText>
        </div>

        <div className="h-[100vh] flex items-center justify-center">
          <FadeInText offsetStart={0.4} offsetEnd={0.6}>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-2xl">
              Frame by Frame
            </h2>
            <p className="text-xl text-white/70 drop-shadow-lg">
              Interpolating dynamically at 60fps for maximum fluidity.
            </p>
          </FadeInText>
        </div>

        <div className="h-[100vh] flex items-center justify-center">
          <FadeInText offsetStart={0.7} offsetEnd={0.9}>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-2xl">
              The End.
            </h2>
            <p className="text-xl text-white/70 drop-shadow-lg">
              A testament to Canvas and Motion.
            </p>
          </FadeInText>
        </div>
      </SequenceScroll>

      {/* Footer Section */}
      <footer className="h-[50vh] w-full bg-black flex items-center justify-center z-10 relative">
        <p className="text-white/30 font-mono tracking-widest uppercase text-sm">
          Experience designed with Next.js, Lens, & Framer Motion.
        </p>
      </footer>
    </main>
  );
}
