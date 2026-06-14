'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowLeft,
  ArrowUpRight,
  Cpu, 
  Factory, 
  ShieldCheck, 
  Zap, 
  Settings, 
  User, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Phone, 
  Loader, 
  Star,
  Quote,
  Flame,
  CheckCircle2,
  Milestone
} from 'lucide-react';
import { motion } from 'motion/react';

// Lightweight count-up animation for stats numbers
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function Home() {
  const [loadingCms, setLoadingCms] = useState(true);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // Dynamic CMS Text for Page Sections
  const [cms, setCms] = useState({
    home_hero_title: "Nepal's Trusted Partner for Food Flavours & Industry Solutions",
    home_hero_subtitle: "We supply premium food flavours, functional ingredients, and machine consulting services to food manufacturers across Nepal — helping you create products that people love, at every scale.",
    home_hero_description: "Flavour Your World. Fuel Your Industry.",
    home_spice_tech_badge: "Who We Are",
    home_spice_tech_title: "Your Complete Flavour & Food Solutions Partner in Nepal",
    home_spice_tech_description: "Techsol International was founded with a single purpose — to bridge the gap between world-class food ingredient technology and Nepal's growing food and beverage manufacturing industry. Based in Nepal, we are a dedicated supplier of premium food flavours, functional ingredients, and spice solutions. Beyond products, we also provide machine consulting services to help food manufacturers set up, optimize, and scale their production lines with confidence.",
    home_about_badge: "A Complete Range",
    home_about_title: "A Complete Range of Flavours & Ingredients for Every Application",
    home_about_description: "From sweet to savoury, dairy to bakery — our product portfolio covers the full spectrum of food flavouring and functional ingredient needs for Nepal's food manufacturers.",
    home_about_image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=650',
    home_industry_title_1: 'Bakery & Confectionery',
    home_industry_desc_1: 'Breads, cakes, biscuits, cookies, pastries, chocolates, and candies — we supply flavours and functional ingredients that deliver consistent taste and texture at scale.',
    home_industry_title_2: 'Beverages',
    home_industry_desc_2: 'Soft drinks, juices, energy drinks, flavoured water, traditional Nepali drinks — our liquid and powder flavours ensure clean, vibrant taste profiles.',
    home_industry_title_3: 'Dairy & Ice Cream',
    home_industry_desc_3: 'Flavoured milk, yoghurt, paneer, butter, ice cream, and kulfi — our dairy-specific flavour range is optimized for heat stability and cold temperature performance.',
    home_industry_title_4: 'Snacks & Namkeen',
    home_industry_desc_4: 'Chips, extruded snacks, nuts, popcorn, and puffed products — our savoury seasoning blends deliver the bold tastes Nepali consumers love.',
    trust_strip_text: "Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal",
  });

  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [b2bProducts, setB2bProducts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    async function loadAllContent() {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            // Hydrate CMS config
            if (result.cms) {
              const mapped = { ...cms };
              result.cms.forEach((item: any) => {
                if (item.key in mapped) {
                  mapped[item.key as keyof typeof cms] = item.value;
                }
              });
              setCms(mapped);
            }
            // Hydrate services
            if (result.services) {
              setServices(result.services);
            }
            // Hydrate products
            if (result.products) {
              setProducts(result.products);
            }
            // Hydrate B2B products
            if (result.b2b_products) {
              setB2bProducts(result.b2b_products);
            }
            // Hydrate testimonials
            if (result.testimonials) {
              setTestimonials(result.testimonials);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching home dynamic data:', err);
      } finally {
        setLoadingCms(false);
      }
    }
    loadAllContent();
  }, []);

  const handlePrevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id="home-layout-container" className="flex flex-col flex-1 select-text overflow-x-hidden">
      
      {/* 1. MAIN HERO GRID (Swiss Editorial Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-slate-200 border-b border-slate-200">
        
        {/* Left Side: Hero Title (Columns 1-8) */}
        <section className="col-span-1 lg:col-span-8 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden min-h-[420px] lg:min-h-[500px]">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 space-y-6"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-amber-600 rounded-none inline-block animate-pulse"></span>
              <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-amber-600 font-mono">
                Flavour Your World. Fuel Your Industry.
              </h2>
            </div>
            
            {loadingCms ? (
              <div className="space-y-4">
                <div className="h-12 bg-slate-100 animate-pulse w-3/4"></div>
                <div className="h-6 bg-slate-100 animate-pulse w-1/2"></div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight uppercase">
                  {cms.home_hero_title}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-slate-700 max-w-xl leading-relaxed font-sans font-medium">
                  {cms.home_hero_subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed font-mono uppercase">
                  {cms.home_hero_description}
                </p>
              </>
            )}
            
            <div className="flex flex-wrap gap-3 pt-3">
              <Link
                id="cta-explore-products"
                href="/products"
                className="bg-slate-900 text-white hover:bg-amber-600 transition-all duration-200 px-5 sm:px-8 py-3.5 sm:py-4 font-black text-xs sm:text-sm rounded-none tracking-widest uppercase flex items-center gap-2 cursor-pointer border border-transparent"
              >
                <span>Explore Our Products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                id="cta-req-quote"
                href="/contact"
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-100 transition-all duration-200 px-5 sm:px-8 py-3.5 sm:py-4 font-black text-xs sm:text-sm rounded-none tracking-widest uppercase text-center"
              >
                Request a Quote
              </Link>
            </div>

            {/* Supporting Stat Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 max-w-lg text-[10px] sm:text-xs font-mono font-bold text-slate-800">
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-100">
                <span className="text-amber-600 text-base">🏭</span>
                <div className="leading-tight">
                  <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">500+</span>
                  <span className="text-slate-450 text-[9px] block uppercase font-medium">Products Supplied</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-100">
                <span className="text-amber-600 text-base">🤝</span>
                <div className="leading-tight">
                  <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">100+</span>
                  <span className="text-slate-450 text-[9px] block uppercase font-medium">Industry Partners</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-100">
                <span className="text-amber-550 text-base">⚗️</span>
                <div className="leading-tight">
                  <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">10+ Years</span>
                  <span className="text-slate-450 text-[9px] block uppercase font-medium">Of Expertise</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Graphical vector grid behind header */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none select-none">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor">
              <path d="M0 0 L100 100 M20 0 L100 80 M40 0 L100 60 M0 20 L80 100 M0 40 L60 100" strokeWidth="0.5"/>
            </svg>
          </div>
        </section>

        {/* Right Side: Key Services list (Columns 9-12) */}
        <section className="col-span-1 lg:col-span-4 bg-slate-950 text-white p-6 sm:p-12 flex flex-col justify-between gap-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex justify-between items-baseline mb-8 pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 font-mono">
                Key Offerings
              </h3>
              <Link href="/services" className="text-[10px] font-mono text-slate-400 hover:text-amber-500 hover:underline uppercase">
                View All
              </Link>
            </div>
            
            <div className="space-y-6">
              {services.length > 0 ? (
                services.slice(0, 3).map((srv, index) => {
                  return (
                    <div key={srv.id || index} className="group border-l-2 border-slate-800 hover:border-amber-500 pl-4 transition-all duration-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-amber-400 transition-colors uppercase block truncate">
                          {srv.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 shrink-0 ml-2">0{index+1}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                        {srv.description}
                      </p>
                    </div>
                  );
                })
              ) : (
                // Fallbacks
                <>
                  <div className="group border-l-2 border-slate-800 hover:border-amber-500 pl-4 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-amber-400 transition-colors uppercase block">Flavour Sourcing</span>
                      <span className="text-xs font-mono text-slate-600">01</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                      Premium powder & liquid flavours mapped precisely to international safety standards.
                    </p>
                  </div>

                  <div className="group border-l-2 border-slate-800 hover:border-amber-500 pl-4 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-amber-400 transition-colors uppercase block">Custom Blends & Seasonings</span>
                      <span className="text-xs font-mono text-slate-600">02</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                      Tailor-made spice compounds calibrated specifically for the Nepalese and South Asian palates.
                    </p>
                  </div>

                  <div className="group border-l-2 border-slate-800 hover:border-amber-500 pl-4 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-amber-400 transition-colors uppercase block">Machine Consulting Services</span>
                      <span className="text-xs font-mono text-slate-600">03</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                      Comprehensive plant design layouts, vendor sourcing, and capacity optimization audits.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats Segment with dynamic count-up animations */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 mt-4 font-mono select-none">
            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-500">
                <AnimatedCounter value={500} />+
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">Products Supplied</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-500">
                <AnimatedCounter value={10} />+
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">Years serving Nepal</div>
            </div>
          </div>
        </section>

      </div>

      {/* 2. DYNAMIC TRUST STRIP / MARQUEE */}
      <div className="bg-amber-500 text-slate-950 font-mono text-[10px] sm:text-xs font-black py-4 uppercase border-b border-slate-900 overflow-hidden relative select-none shrink-0 tracking-wider">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          <div className="flex gap-12 shrink-0">
            <span>🏭 {cms.trust_strip_text || "Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal"}</span>
            <span>✦ Tinkune Kathmandu HQ</span>
            <span>🤝 100+ Partners</span>
            <span>✦ Certified Quality Labs</span>
            <span>⚗️ 10+ Years</span>
            <span>✦ Pan-Nepal Supply Network</span>
          </div>
          <div className="flex gap-12 shrink-0">
            <span>🏭 {cms.trust_strip_text || "Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal"}</span>
            <span>✦ Tinkune Kathmandu HQ</span>
            <span>🤝 100+ Partners</span>
            <span>✦ Certified Quality Labs</span>
            <span>⚗️ 10+ Years</span>
            <span>✦ Pan-Nepal Supply Network</span>
          </div>
        </div>
      </div>

      {/* NEW: EXPERT B2B SPICES & FLAVOUR AUTOMATION ENGINE SHOWCASE WITH PRODUCTS GRID */}
      <section className="bg-slate-950 text-white py-16 px-4 sm:px-8 border-b border-slate-900 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor">
            <line x1="10" y1="0" x2="10" y2="100" strokeWidth="0.1" />
            <line x1="30" y1="0" x2="30" y2="100" strokeWidth="0.1" />
            <line x1="50" y1="0" x2="50" y2="100" strokeWidth="0.1" />
            <line x1="70" y1="0" x2="70" y2="100" strokeWidth="0.1" />
            <line x1="90" y1="0" x2="90" y2="100" strokeWidth="0.1" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Header detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 block animate-pulse"></span>
                <span className="text-[10px] font-mono font-black uppercase text-amber-500 tracking-[0.25em]">
                  {cms.home_spice_tech_badge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-slate-100">
                {cms.home_spice_tech_title}
              </h2>
            </div>
            <div className="lg:col-span-4 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans border-l border-slate-800 pl-4 py-1">
              {cms.home_spice_tech_description}
            </div>
          </div>

          {/* Dynamic B2B products list instead of hardcoded features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {b2bProducts.length > 0 ? (
              b2bProducts.map((prod, idx) => (
                <motion.div 
                  key={prod.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/80 p-6 space-y-5 transition-all duration-300 flex flex-col justify-between group min-h-[350px]"
                >
                  <div className="space-y-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={prod.image_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400'} 
                      alt={prod.name} 
                      className="w-full h-40 object-cover grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono font-bold text-amber-500 tracking-widest uppercase block">
                        &raquo; {prod.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-black uppercase text-white group-hover:text-amber-400 transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[10px] uppercase font-mono text-slate-500 leading-tight">
                    <div className="flex justify-between items-start gap-2">
                      <span>Standard Application:</span>
                      <span className="text-amber-500 text-right font-bold font-sans low-case">{prod.application || 'Varies on sector load'}</span>
                    </div>
                    <div className="pt-2 text-right">
                      <Link 
                        href={`/products/${prod.id}`}
                        className="text-amber-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest"
                      >
                        Technical Sheet &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty list state helper
              <div className="col-span-3 text-center py-10 bg-slate-900 border border-slate-800 text-slate-500 text-xs font-mono">
                Loading compounded B2B ingredients catalog from secure database desk...
              </div>
            )}
          </div>

          {/* Connect Ribbon */}
          <div className="bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs sm:text-sm font-sans font-medium text-slate-300 text-center md:text-left">
              Need custom layout blueprint specs formulated for Spice Mills or Volumetric Packagers?
            </span>
            <Link
              href="/contact"
              className="bg-amber-600 hover:bg-amber-700 text-white font-mono uppercase text-xs tracking-wider px-6 py-3 font-bold flex items-center gap-2"
            >
              <span>Connect with Plant Engineers</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC ABOUT SECTION ON HOMEPAGE */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono block">
              {cms.home_about_badge}
            </span>
            <h3 className="text-2xl sm:text-3.5xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight">
              {cms.home_about_title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              {cms.home_about_description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[10px] sm:text-xs pt-2 text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Grade 1 Technical Certification</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>24/7 Troubleshooting Dispatch</span>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/about" className="text-xs font-black tracking-widest text-slate-950 uppercase inline-flex items-center gap-2 hover:text-amber-600 transition-colors">
                <span>Discover corporate blueprint</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Photo banner replacement for About */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 h-[320px] bg-slate-100 overflow-hidden relative border border-slate-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={cms.home_about_image_url || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=650'}
              alt="Industrial Erection" 
              className="w-full h-full object-cover brightness-95 opacity-90 contrast-105"
            />
            <div className="absolute bottom-5 left-5 bg-slate-950/90 text-amber-500 font-mono text-[10px] px-3.5 py-1.5 tracking-wider uppercase font-extrabold select-none">
              Ingredients & Flavour Solutions
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. INDUSTRIES THAT WE SERVE */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 font-mono block">
              Market Penetration
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Industries We Serve Across Nepal
            </h3>
            <p className="text-xs sm:text-sm text-slate-450 font-sans leading-relaxed">
              Our setups are deployed inside the primary industrial corridors including Biratnagar, Bhairahawa, Birgunj, Nepalgunj, and the Kathmandu Valley.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sector 1 */}
            <div className="bg-slate-950 p-6 border border-slate-800 space-y-4 hover:border-amber-500 transition-colors duration-200">
              <span className="text-xs font-mono text-amber-500">SECTION 01</span>
              <h4 className="font-bold text-base uppercase text-white">{cms.home_industry_title_1}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {cms.home_industry_desc_1}
              </p>
            </div>

            {/* Sector 2 */}
            <div className="bg-slate-950 p-6 border border-slate-800 space-y-4 hover:border-amber-500 transition-colors duration-200">
              <span className="text-xs font-mono text-amber-500">SECTION 02</span>
              <h4 className="font-bold text-base uppercase text-white">{cms.home_industry_title_2}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {cms.home_industry_desc_2}
              </p>
            </div>

            {/* Sector 3 */}
            <div className="bg-slate-950 p-6 border border-slate-800 space-y-4 hover:border-amber-500 transition-colors duration-200">
              <span className="text-xs font-mono text-amber-500">SECTION 03</span>
              <h4 className="font-bold text-base uppercase text-white">{cms.home_industry_title_3}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {cms.home_industry_desc_3}
              </p>
            </div>

            {/* Sector 4 */}
            <div className="bg-slate-950 p-6 border border-slate-800 space-y-4 hover:border-amber-500 transition-colors duration-200">
              <span className="text-xs font-mono text-amber-500">SECTION 04</span>
              <h4 className="font-bold text-base uppercase text-white">{cms.home_industry_title_4}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {cms.home_industry_desc_4}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INDUSTRIAL TESTIMONIALS SLIDER */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono block">
              Client Appraisals
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              What Factory Operators Say
            </h3>
          </div>

          {/* Sliding Carousel Box */}
          {testimonials.length > 0 ? (
            <div className="relative bg-amber-50/40 p-6 sm:p-12 border border-amber-100/80 space-y-6 flex flex-col justify-between overflow-hidden">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-amber-200/50 stroke-1 pointer-events-none" />
              
              <div className="flex gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>

              <motion.div 
                key={activeTestimonialIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 min-h-[140px] flex flex-col justify-center"
              >
                <p className="text-sm sm:text-base lg:text-lg text-slate-800 leading-relaxed font-serif font-medium italic pr-5">
                  &ldquo;{testimonials[activeTestimonialIndex]?.quote}&rdquo;
                </p>
              </motion.div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  {testimonials[activeTestimonialIndex]?.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={testimonials[activeTestimonialIndex].image_url} 
                      alt={testimonials[activeTestimonialIndex].name}
                      className="w-10 h-10 object-cover grayscale border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-900 text-amber-500 font-black flex items-center justify-center text-md select-none">
                      {testimonials[activeTestimonialIndex]?.name[0] || 'T'}
                    </div>
                  )}
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">
                      {testimonials[activeTestimonialIndex]?.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {testimonials[activeTestimonialIndex]?.designation}, {testimonials[activeTestimonialIndex]?.company}
                    </span>
                  </div>
                </div>

                {/* Left and Right navigation buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handlePrevTestimonial}
                    className="p-2 sm:p-2.5 bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-slate-800 transition-all cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-450 px-2 min-w-[45px] text-center select-none">
                    {activeTestimonialIndex + 1} / {testimonials.length}
                  </span>
                  <button
                    onClick={handleNextTestimonial}
                    className="p-2 sm:p-2.5 bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-slate-800 transition-all cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            // Spinner/Placeholder fallback
            <div className="text-center py-10 bg-slate-50 border border-slate-150 text-slate-405 text-xs font-mono">
              Fetching operators validation Appraisals...
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
