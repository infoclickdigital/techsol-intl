'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSliderProps {
  images?: string[];
  intervalMs?: number;
  children?: React.ReactNode;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=1200', // Grain silos/towers
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200', // Engineering plant and grain silos
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=1200', // Large steel storage silos
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200', // Food ingredients spices
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200', // Automated food machinery plant
];

export default function HeroSlider({ 
  images = [], 
  intervalMs = 6500,
  children
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out any empty, null, or whitespace-only strings
  const validImages = (images && images.length > 0) 
    ? images.map(img => img?.trim()).filter(Boolean)
    : [];

  const finalImages = validImages.length > 0 ? validImages : DEFAULT_IMAGES;

  useEffect(() => {
    if (finalImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === finalImages.length - 1 ? 0 : prev + 1));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [finalImages.length, intervalMs]);

  // If index is out of bounds (e.g. after list shrinks), reset it
  useEffect(() => {
    if (currentIndex >= finalImages.length) {
      setCurrentIndex(0);
    }
  }, [finalImages.length, currentIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? finalImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === finalImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-slate-950 flex flex-col justify-center min-h-[580px] sm:min-h-[640px] lg:min-h-[720px]"
      id="hero-fullwidth-slider-container"
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={finalImages[currentIndex]}
              alt={`Techsol Industrial Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover brightness-[0.85] contrast-[1.02] saturate-[1.05] transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            {/* Premium Overlay: Softer left side gradient for maximum image brightness and readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-900/5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/15 pointer-events-none"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Content Overlaid on Front */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Navigation Controls (Clean modern industrial buttons) */}
      {finalImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-950/60 hover:bg-amber-500 hover:scale-105 border border-white/10 hover:border-amber-500 text-white transition-all rounded-none cursor-pointer z-20 hover:text-slate-950 shadow-lg"
            aria-label="Previous Slide"
            id="hero-slider-prev-btn"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-950/60 hover:bg-amber-500 hover:scale-105 border border-white/10 hover:border-amber-500 text-white transition-all rounded-none cursor-pointer z-20 hover:text-slate-950 shadow-lg"
            aria-label="Next Slide"
            id="hero-slider-next-btn"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Minimal Bottom Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {finalImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all rounded-none duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-10 bg-amber-500' : 'w-2.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                id={`hero-slider-dot-${idx}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
