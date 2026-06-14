'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Hammer, Compass, Cpu, HelpCircle, Newspaper, MessageSquare, ShieldAlert, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('techsol_admin_session_pwd');
      setIsAdminLoggedIn(!!token);
    }
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/about', label: 'About Us', icon: HelpCircle },
    { href: '/services', label: 'Services', icon: Hammer },
    { href: '/products', label: 'Products', icon: Cpu },
    { href: '/blogs', label: 'Blogs', icon: Newspaper },
    { href: '/contact', label: 'Contact Us', icon: MessageSquare },
  ];

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shrink-0 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 group transition-opacity duration-150 hover:opacity-90"
        >
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3 text-xs lg:text-sm font-semibold tracking-wide text-slate-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`py-2 px-3 transition-colors uppercase font-mono tracking-wider hover:text-amber-600 hover:bg-slate-50 ${
                  isActive ? 'text-amber-600 bg-amber-50/50' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {isAdminLoggedIn && (
            <Link 
              href="/admin-techsol"
              className="text-white bg-slate-950 px-4 py-2 hover:bg-amber-600 uppercase font-mono text-[10px] tracking-widest transition-all ml-1"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <div className="flex md:hidden">
          <button
            onClick={handleToggle}
            type="button"
            className="p-2.5 bg-slate-50 text-slate-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Elegant Mobile Navigation Slider Backdrop and Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Blurry Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleToggle}
              className="fixed inset-0 bg-black z-45 md:hidden"
            />

            {/* Sliding Panel Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-slate-950 text-white shadow-2xl z-50 p-6 flex flex-col justify-between md:hidden"
            >
              <div className="space-y-6">
                
                {/* Drawer Top Header section */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-5">
                  <Logo size="sm" className="brightness-125 saturate-110" />
                  <button
                    onClick={handleToggle}
                    className="p-2 text-slate-400 hover:text-white bg-slate-900"
                    aria-label="Close menu"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Vertical menu navigation links */}
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-amber-500 font-extrabold block mb-3 pl-1.5">
                    Operations Corridors
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {navLinks.map((link, idx) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                        >
                          <Link
                            href={link.href}
                            onClick={handleToggle}
                            className={`flex items-center gap-3.5 py-3 px-3.5 text-xs font-mono tracking-widest uppercase transition-all duration-200 border ${
                              isActive
                                ? 'bg-amber-600 border-amber-600 text-white font-extrabold'
                                : 'bg-slate-900 border-slate-900 hover:border-amber-500/50 text-slate-300 hover:text-white'
                            }`}
                          >
                            <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                            <span>{link.label}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Bottom Panel Footer */}
              <div className="space-y-4 border-t border-slate-900 pt-5 pr-1">
                {isAdminLoggedIn && (
                  <Link
                    href="/admin-techsol"
                    onClick={handleToggle}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-mono uppercase text-xs font-black tracking-widest py-3.5 text-center flex items-center justify-center gap-2 transition-all duration-155"
                  >
                    <KeyRound className="h-4 w-4 shrink-0 text-white" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="flex items-center gap-2 select-none justify-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none inline-block animate-pulse"></span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">
                    Secure Kathmandu HQ Line Connected
                  </span>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
