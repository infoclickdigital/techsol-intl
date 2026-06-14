'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, BookOpen, Clock, Loader } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  read_time: string;
  image_url?: string;
}

const STATIC_ARTICLES: Article[] = [
  {
    id: 'optical-sorting-nepal',
    category: 'Milling Technology',
    title: "The Economics of Smart Optical Sorting in Nepal's Agribusinesses",
    excerpt: 'Manual seed sorting and secondary winnowing represent hefty labor bills across agricultural processing sectors. This research provides a thorough analysis of color sorter ROI and contaminant safety limits in local rice, lentil, and bean mills.',
    content: '',
    date: 'June 01, 2026',
    author: 'Er. R. K. Shrestha (Senior Plant Engineer)',
    read_time: '6 min read',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'decentralized-wheat-milling',
    category: 'Factory Layouts',
    title: 'Decentralized Wheat Flour Milling: Scalability for Rural Municipalities',
    excerpt: 'Establishing smaller 2 TPH wheat flour plants in central agricultural clusters reduces secondary freight charges across hill terrains. This guide reviews roller config models designed to grind high-quality Atta and Maida flour in co-op mills.',
    content: '',
    date: 'May 14, 2026',
    author: 'Abhushit Chaudhary (Project Lead)',
    read_time: '5 min read',
    image_url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'industrial-plc-logics',
    category: 'Automation Logic',
    title: 'Implementing PLC Logic Boards in Food Processing Lines',
    excerpt: 'A technical analysis detailing system integrations using SCADA systems. We review sensor networks, electric safety clamping loops, and remote panel control calibrations required to avoid high voltage power surges across Terai industrial estates.',
    content: '',
    date: 'April 20, 2026',
    author: 'Dr. S. K. Upadhyaya (Automation Advisor)',
    read_time: '8 min read',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
  }
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/content?scope=blogs');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data.length > 0) {
            // Map keys
            const mapped = result.data.map((b: any) => ({
              id: b.id,
              title: b.title,
              excerpt: b.excerpt,
              content: b.content,
              category: b.category,
              date: b.date,
              author: b.author,
              read_time: b.read_time,
              image_url: b.image_url,
            }));
            setBlogs(mapped);
          } else {
            setBlogs(STATIC_ARTICLES);
          }
        } else {
          setBlogs(STATIC_ARTICLES);
        }
      } catch (err) {
        console.error('Error loading dynamic blogs:', err);
        setBlogs(STATIC_ARTICLES);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono">
            Blogs & Publications
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Industrial Insights & Research
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            A comprehensive publication desk reviewing mechanical developments, local plant performance metrics, and factory engineering practices in Nepal.
          </p>
        </div>

        {/* Featured Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-slate-200 bg-white hover:border-slate-800 transition-colors duration-200 rounded-none relative overflow-hidden shadow-xs">
          <div className="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between gap-8 z-10 bg-white">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 font-bold px-2.5 py-1">
                Featured Publication
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Evaluating CCD Camera Accuracies Under High Dust Conditions
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                Flour and rice milling plants induce volatile ambient dust load. This report reviews state-of-the-art aspirator integrations and dual air blast cycles that secure clean camera lenses, maintaining 99.98% color sorting accuracy.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-amber-600" /> Er. R. K. Shrestha</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-amber-600" /> June 05, 2026</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-amber-600" /> 10 min read</span>
            </div>
          </div>
          
          <div className="lg:col-span-4 bg-slate-900 text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 relative min-h-[220px]">
            {/* Background design */}
            <div className="absolute inset-0 opacity-[0.10] select-none pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="white" strokeWidth="1">
                <circle cx="50" cy="50" r="40" />
                <path d="M10 50 H90 M50 10 V90" />
              </svg>
            </div>
            
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 font-mono z-10">
              Key Focus Areas
            </h3>
            <ul className="space-y-3 pt-6 lg:pt-0 font-semibold text-xs text-slate-350 z-10">
              <li className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-amber-500" /> Pneumatic Ejector Lifespans</li>
              <li className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-amber-500" /> Roll fluting patterns for mills</li>
              <li className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-amber-500" /> Modbus telemetry integrations</li>
            </ul>
            <div className="text-[10px] font-mono text-slate-500 uppercase pt-6 lg:pt-0 z-10">
              Docs Dept @ Techsol
            </div>
          </div>
        </div>

        {/* Post Grid Section */}
        {loading ? (
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 py-12">
            <Loader className="h-4 w-4 animate-spin text-amber-600" />
            <span>Parsing dynamic blog entries...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((art) => (
              <article
                key={art.id}
                className="bg-white border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-800 transition-colors duration-200 rounded-none h-full shadow-xs"
              >
                <div className="space-y-6">
                  {/* Article visual thumbnail slot */}
                  <Link href={`/blogs/${art.id}`} className="block h-[160px] w-full bg-slate-100 overflow-hidden border border-slate-100 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'}
                      alt={art.title}
                      className="w-full h-full object-cover opacity-100 hover:scale-102 transition-all duration-300"
                    />
                  </Link>

                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    {art.category}
                  </span>
                  
                  <Link href={`/blogs/${art.id}`} className="block group">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-amber-600 transition-colors">
                      {art.title}
                    </h3>
                  </Link>
                  
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-4">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{art.date}</span>
                    <span>{art.read_time}</span>
                  </div>
                  <Link href={`/blogs/${art.id}`} className="text-xs font-bold text-amber-600 hover:text-slate-900 transition-colors flex items-center gap-1 select-none cursor-pointer w-fit">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
