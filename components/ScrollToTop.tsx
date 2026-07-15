'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          id="scroll-to-top-button"
          className="fixed bottom-6 right-6 z-40 p-3 bg-slate-950 text-white hover:bg-amber-500 hover:text-slate-950 transition-all duration-200 shadow-xl border border-white/10 group cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-150" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
