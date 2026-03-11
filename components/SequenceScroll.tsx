"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const MAX_FRAMES = 240; // Number of images in sequence

function getFramePath(index: number) {
  // Pad with leading zeros (e.g., 001, 012, 192)
  const paddedIndex = index.toString().padStart(3, "0");
  return `/sequence/ezgif-frame-${paddedIndex}.jpg`;
}

export function SequenceScroll({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload Images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= MAX_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === MAX_FRAMES) {
          setIsLoaded(true);
        }
      };
      // In case of error (e.g. missing frame), we still count it
      // so it doesn't block rendering forever
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === MAX_FRAMES) {
          setIsLoaded(true);
        }
      }
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Framer Motion scroll hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress (0 to 1) to frame index (0 to MAX_FRAMES - 1)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, MAX_FRAMES - 1]);

  // Render logic
  const renderFrame = (index: number) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return; // Wait until valid

    // Draw image covering the canvas (like object-fit: cover)
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;

    ctx.clearRect(0, 0, cw, ch);
    // Add smoothing for high-end look
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, x, y, w, h);
  };

  // Draw first frame when loaded
  useEffect(() => {
    if (isLoaded) {
      renderFrame(0);
    }
  }, [isLoaded]);

  // Update canvas when frameIndex changes
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (isLoaded) {
      // Use math.round to snap to nearest integer for the frame array
      renderFrame(Math.round(latest));
    }
  });

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      if (isLoaded) {
        renderFrame(Math.round(frameIndex.get()));
      }
    };
    
    // Initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, frameIndex]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-black">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        
        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500">
            <span className="text-white/70 font-mono tracking-widest text-sm uppercase animate-pulse">
              Preloading Sequence...
            </span>
          </div>
        )}
      </div>

      {/* Children Overlay */}
      {children && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}
