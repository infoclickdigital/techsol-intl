'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Clock, Loader, AlertTriangle, BookOpen } from 'lucide-react';

interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
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
    content: "Food processing in Nepal is transitioning at an incredible pace. Traditional manual sorting of grains like rice, lentils, and black beans often suffers from high rates of error and severe biological containment issues. By implementing modern high-speed photoelectric optical CCD sorting arrays, Nepalese millers can achieve 99.98% purity.\r\n\r\n### Rapid Return on Investment\r\nOur financial analysis of setups across Terai corridors shows that manual sorting of a standard 5 TPH line demands up to 15 full-time laborers per shift. Color sorters completely replace this step, delivering a rapid 14-month full payback period. These savings are driven directly by reduced labor volumes, higher yield grading, and lower grain broken rates.\r\n\r\n### Technology Calibration\r\nEach AeroSort multi-chromatic camera array uses Japanese 5400px sensors tracking defect rates at 0.01mm structures. High-precision pneumatic ejectors then direct a fast blast of compressed air to knock defect grains into discharge chutes, while premium product is cleanly stored.",
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
    content: "Transportation costs across Nepal's challenging hilly topography represents up to 35% of the overall retail price of refined flour. Establishing smaller, localized milling clusters close to harvesting regions can revolutionize rural food security.\r\n\r\n### Compact Milling Architectures\r\nThis engineering paper outlines the setup of compact 2-5 TPH plants utilizing magnetic feed gates and variable high-speed roll settings. By shifting milling proximity away from borders and into local valley cooperatives, transport carbon offsets drop by 30%.\r\n\r\n### Product Standardization\r\nWith precise pneumatically clamped roller systems, local mills can process premium Atta and Maida flour that meets local quality control guidelines.",
    date: 'May 14, 2026',
    author: 'Abhushit Chaudhary (Project Lead)',
    read_time: '5 min read',
    image_url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=600'
  }
];

export default function SingleBlogPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const id = params.id as string;
        const res = await fetch('/api/content?scope=blogs');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data.length > 0) {
            const found = result.data.find((b: any) => b.id === id);
            if (found) {
              setArticle({
                id: found.id,
                category: found.category,
                title: found.title,
                excerpt: found.excerpt,
                content: found.content || found.excerpt, // Fallback to excerpt
                date: found.date,
                author: found.author,
                read_time: found.read_time,
                image_url: found.image_url,
              });
              return;
            }
          }
        }
        
        // Match static fallback
        const staticMatch = STATIC_ARTICLES.find(a => a.id === id);
        if (staticMatch) {
          setArticle(staticMatch);
        } else {
          // Extra defaults
          const extraDef = {
            id: 'industrial-plc-logics',
            category: 'Automation Logic',
            title: 'Implementing PLC Logic Boards in Food Processing Lines',
            excerpt: 'A technical analysis detailing system integrations using SCADA systems. We review sensor networks, electric safety clamping loops, and remote panel control calibrations required to avoid high voltage power surges across Terai industrial estates.',
            content: "Industrial power swings are an everyday operational reality for factories located in Nepalese industrial estates. This article explores proper electrical grounding and Siemens PLC integration schemas designed to safeguard modern mills. By monitoring input currents, automated cutoff contactors, and telemetry sensors via a central SCADA interface, factory supervisors can enjoy continuous operating loads and prevent catastrophic damage to expensive mechanical components.",
            date: 'April 20, 2026',
            author: 'Dr. S. K. Upadhyaya (Automation Advisor)',
            read_time: '8 min read',
            image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
          };
          if (id === extraDef.id) {
            setArticle(extraDef);
          }
        }
      } catch (e) {
        console.error('Error loading article detail:', e);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] text-xs font-mono text-slate-400 gap-2">
        <Loader className="h-6 w-6 animate-spin text-amber-500" />
        <span>Parsing publication sheets...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-600" />
        <h2 className="text-lg font-black text-slate-900 uppercase">Research Report Not Found</h2>
        <Link href="/blogs" className="bg-slate-900 text-white text-[10px] font-mono tracking-widest uppercase px-5 py-3 font-bold">
          Return to Blogs
        </Link>
      </div>
    );
  }

  // Format content body to support double carriage linebreaks
  const paragraphs = article.content.split('\n');

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation line */}
        <div>
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Back to Blogs</span>
          </Link>
        </div>

        {/* Detailed article card */}
        <article className="bg-white border border-slate-200 p-6 sm:p-10 lg:p-12 space-y-8 rounded-none shadow-xs">
          
          {/* Header section */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <span className="text-[10px] font-mono uppercase bg-slate-100 font-bold px-2.5 py-1 text-slate-600 inline-block">
              {article.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight uppercase">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-amber-600" />
                <span>{article.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span>{article.date}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>{article.read_time}</span>
              </span>
            </div>
          </div>

          {/* Big graphical header card banner */}
          {article.image_url && (
            <div className="aspect-video w-full overflow-hidden bg-slate-100 border border-slate-150">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover opacity-100"
              />
            </div>
          )}

          {/* Article Main Text body */}
          <div className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 pr-1">
            {paragraphs.map((para, pIdx) => {
              if (para.trim().startsWith('###')) {
                const headingText = para.replace('###', '').trim();
                return (
                  <h3 key={pIdx} className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-900 pt-4 pb-1">
                    {headingText}
                  </h3>
                );
              }
              if (!para.trim()) return null;
              return (
                <p key={pIdx}>
                  {para}
                </p>
              );
            })}
          </div>

          {/* Blog publication authority footer */}
          <div className="border-t border-slate-100 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-600" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Published by Techsol Research Department
              </span>
            </div>
            
            <Link 
              href="/contact"
              className="text-[10px] font-mono uppercase tracking-widest font-black text-amber-600 hover:text-slate-900 transition-colors"
            >
              Enquire About This Field Study &rarr;
            </Link>
          </div>

        </article>

      </div>
    </div>
  );
}
