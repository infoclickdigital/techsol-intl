'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  // Map sizes to height/width values
  const dimensions = {
    sm: { h: 32, w: 98 },
    md: { h: 44, w: 135 },
    lg: { h: 60, w: 184 },
    xl: { h: 80, w: 245 },
  };

  const dim = dimensions[size];

  return (
    <div className={`flex items-center select-none ${className}`} id="techsol-logo-wrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 405 132"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200"
        style={{ maxHeight: dim.h, maxWidth: dim.w }}
        aria-label="Techsol International"
      >
        <defs>
          <mask id="logo-swoosh-mask">
            {/* Keep the whole gear wheel base */}
            <rect x="0" y="0" width="500" height="150" fill="white" />
            {/* Subtract three custom curved transparent tracks to create slices across the gear */}
            <path d="M 220 40 C 265 24 305 24 345 35" stroke="black" strokeWidth="6.5" fill="none" strokeLinecap="round" />
            <path d="M 215 54 C 265 44 305 44 345 53" stroke="black" strokeWidth="6.5" fill="none" strokeLinecap="round" />
            <path d="M 218 68 C 265 65 305 66 342 77" stroke="black" strokeWidth="6.5" fill="none" strokeLinecap="round" />
          </mask>
        </defs>

        {/* ======================================================== */}
        {/* TECH (Corporate Blue - #0E62AC) */}
        {/* ======================================================== */}
        {/* Letter T */}
        <path d="M 15 20 H 51 V 31 H 39 V 80 H 27 V 31 H 15 Z" fill="#0E62AC" />

        {/* Letter E */}
        <path d="M 62 20 H 96 V 31 H 74 V 45 H 93 V 55 H 74 V 69 H 96 V 80 H 62 Z" fill="#0E62AC" />

        {/* Letter C */}
        <path d="M 144 20 H 112 A 10 10 0 0 0 102 30 V 70 A 10 10 0 0 0 112 80 H 144 V 69 H 114 V 31 H 144 Z" fill="#0E62AC" />

        {/* Letter H */}
        <path d="M 152 20 H 164 V 45 H 178 V 20 H 190 V 80 H 178 V 56 H 164 V 80 H 152 Z" fill="#0E62AC" />

        {/* ======================================================== */}
        {/* SOL (Vibrant Industrial Orange - #EE7022) */}
        {/* ======================================================== */}
        {/* Letter S */}
        <path d="M 234 34 H 222 C 222 27 218 23 212 23 C 206 23 202 26 202 30 C 202 36 210 38 218 40 C 228 43 236 46 236 56 C 236 66 226 77 212 77 C 198 77 192 70 192 62 H 204 C 204 67 208 70 214 70 C 220 70 224 67 224 63 C 224 58 218 56 210 54 C 200 51 192 47 192 38 C 192 28 201 20 214 20 C 227 20 234 28 234 34 Z" fill="#EE7022" />

        {/* Letter O with Dynamic Embedded Cogwheel Gear */}
        <g mask="url(#logo-swoosh-mask)">
          <g transform="translate(292, 50)">
            {/* Gear hub/rim */}
            <circle cx="0" cy="0" r="11" fill="none" stroke="#EE7022" strokeWidth="4.5" />
            <circle cx="0" cy="0" r="22.5" stroke="#EE7022" strokeWidth="5" fill="none" />
            {/* 12 gear teeth */}
            <g fill="#EE7022">
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(30)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(60)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(90)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(120)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(150)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(180)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(210)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(240)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(270)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(300)" />
              <path d="M -5 -27 L 5 -27 L 3.5 -20 L -3.5 -20 Z" transform="rotate(330)" />
            </g>
          </g>
        </g>

        {/* 3 Active Swooshes Overlying on Top */}
        {/* Top crescent swoosh */}
        <path d="M 235 40 C 270 24 308 24 345 35 C 308 28 270 29 235 40 Z" fill="#EE7022" />
        {/* Middle crescent swoosh */}
        <path d="M 230 54 C 270 44 308 44 345 53 C 308 48 270 49 230 54 Z" fill="#EE7022" />
        {/* Bottom crescent swoosh */}
        <path d="M 233 68 C 270 65 308 66 342 77 C 308 72 270 71 233 68 Z" fill="#EE7022" />

        {/* Letter L */}
        <path d="M 348 20 H 360 V 69 H 382 V 80 H 348 Z" fill="#EE7022" />

        {/* ======================================================== */}
        {/* SUBTEXT (Elegant Matte Charcoal/Grey) */}
        {/* ======================================================== */}
        <text
          x="15"
          y="114"
          textLength="367"
          lengthAdjust="spacing"
          fill="#5A626A"
          fontSize="24"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="500"
          className="select-none tracking-normal"
        >
          International Pvt. Ltd.
        </text>
      </svg>
    </div>
  );
}
