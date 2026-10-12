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
  Loader, 
  Star,
  Quote,
  CheckCircle2,
  Cookie,
  CupSoda,
  Milk,
  Flame,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import HeroSlider from '@/components/HeroSlider';

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
    home_about_image_url: 'https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-1_sczwle.png',
    home_industry_title_1: 'Bakery & Confectionery',
    home_industry_desc_1: 'Breads, cakes, biscuits, cookies, pastries, chocolates, and candies — we supply flavours and functional ingredients that deliver consistent taste and texture at scale.',
    home_industry_title_2: 'Beverages',
    home_industry_desc_2: 'Soft drinks, juices, energy drinks, flavoured water, traditional Nepali drinks — our liquid and powder flavours ensure clean, vibrant taste profiles.',
    home_industry_title_3: 'Dairy & Ice Cream',
    home_industry_desc_3: 'Flavoured milk, yoghurt, paneer, butter, ice cream, and kulfi — our dairy-specific flavour range is optimized for heat stability and cold temperature performance.',
    home_industry_title_4: 'Snacks & Namkeen',
    home_industry_desc_4: 'Chips, extruded snacks, nuts, popcorn, and puffed products — our savoury seasoning blends deliver the bold tastes Nepali consumers love.',
    trust_strip_text: "Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal",
    home_slider_image_1: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-1_sczwle.png",
    home_slider_image_2: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-2_neenae.png",
    home_slider_image_3: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-2_neenae.png",
    home_slider_image_4: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880284/techsol_sllider-3_pos1nv.jpg",
    home_slider_image_5: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880284/techsol_sllider-3_pos1nv.jpg",
    home_about_section_image: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-1_sczwle.png",
    home_about_section_heading: "Your Premier Partner in Food Flavour & Production Science",
    home_about_section_text: "Techsol International bridges the gap between premium global ingredient science and Nepal's burgeoning food manufacturing industry. Operating from Koteshwor-Tinkune in Kathmandu, we supply high-grade food flavours, compound seasonings, and specialized recipe formulations to major confectionery, beverage, dairy, and snack brands across Nepal.",
    home_about_section_subtext: "Beyond world-class ingredients, we provide professional mechanical and plant engineering consulting. From automated optical sorting setups to turnkey flour mills and liquid packaging lines, we help local food processors optimize layouts, reduce overheads, and scale output cleanly.",
    stats_products: "500+",
    stats_partners: "100+",
    stats_expertise: "10+ Years",
    home_about_section_image_text: "",
  });

  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [b2bProducts, setB2bProducts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const CACHE_KEY = 'techsol_home_data_cache';
    const CACHE_TTL = 300000; // 5 minutes cache lifetime in milliseconds

    function hydrateData(result: any) {
      if (result.cms) {
        const mapped = {
          home_hero_title: "Nepal's Trusted Partner for Food Flavours & Industry Solutions",
          home_hero_subtitle: "We supply premium food flavours, functional ingredients, and machine consulting services to food manufacturers across Nepal — helping you create products that people love, at every scale.",
          home_hero_description: "Flavour Your World. Fuel Your Industry.",
          home_spice_tech_badge: "Who We Are",
          home_spice_tech_title: "Your Complete Flavour & Food Solutions Partner in Nepal",
          home_spice_tech_description: "Techsol International was founded with a single purpose — to bridge the gap between world-class food ingredient technology and Nepal's growing food and beverage manufacturing industry. Based in Nepal, we are a dedicated supplier of premium food flavours, functional ingredients, and spice solutions. Beyond products, we also provide machine consulting services to help food manufacturers set up, optimize, and scale their production lines with confidence.",
          home_about_badge: "A Complete Range",
          home_about_title: "A Complete Range of Flavours & Ingredients for Every Application",
          home_about_description: "From sweet to savoury, dairy to bakery — our product portfolio covers the full spectrum of food flavouring and functional ingredient needs for Nepal's food manufacturers.",
          home_about_image_url: 'https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-1_sczwle.png',
          home_industry_title_1: 'Bakery & Confectionery',
          home_industry_desc_1: 'Breads, cakes, biscuits, cookies, pastries, chocolates, and candies — we supply flavours and functional ingredients that deliver consistent taste and texture at scale.',
          home_industry_title_2: 'Beverages',
          home_industry_desc_2: 'Soft drinks, juices, energy drinks, flavoured water, traditional Nepali drinks — our liquid and powder flavours ensure clean, vibrant taste profiles.',
          home_industry_title_3: 'Dairy & Ice Cream',
          home_industry_desc_3: 'Flavoured milk, yoghurt, paneer, butter, ice cream, and kulfi — our dairy-specific flavour range is optimized for heat stability and cold temperature performance.',
          home_industry_title_4: 'Snacks & Namkeen',
          home_industry_desc_4: 'Chips, extruded snacks, nuts, popcorn, and puffed products — our savoury seasoning blends deliver the bold tastes Nepali consumers love.',
          trust_strip_text: "Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal",
          home_slider_image_1: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-1_sczwle.png",
          home_slider_image_2: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-2_neenae.png",
          home_slider_image_3: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-2_neenae.png",
          home_slider_image_4: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880284/techsol_sllider-3_pos1nv.jpg",
          home_slider_image_5: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880284/techsol_sllider-3_pos1nv.jpg",
          home_about_section_image: "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-1_sczwle.png",
          home_about_section_heading: "Your Premier Partner in Food Flavour & Production Science",
          home_about_section_text: "Techsol International bridges the gap between premium global ingredient science and Nepal's burgeoning food manufacturing industry. Operating from Koteshwor-Tinkune in Kathmandu, we supply high-grade food flavours, compound seasonings, and specialized recipe formulations to major confectionery, beverage, dairy, and snack brands across Nepal.",
          home_about_section_subtext: "Beyond world-class ingredients, we provide professional mechanical and plant engineering consulting. From automated optical sorting setups to turnkey flour mills and liquid packaging lines, we help local food processors optimize layouts, reduce overheads, and scale output cleanly.",
          stats_products: "500+",
          stats_partners: "100+",
          stats_expertise: "10+ Years",
          home_about_section_image_text: "",
        };
        result.cms.forEach((item: any) => {
          if (item.key in mapped) {
            mapped[item.key as keyof typeof mapped] = item.value;
          }
        });
        setCms(mapped);
      }
      if (result.services) {
        setServices(result.services);
      }
      if (result.products) {
        setProducts(result.products);
      }
      if (result.b2b_products) {
        setB2bProducts(result.b2b_products);
      }
      if (result.testimonials) {
        setTestimonials(result.testimonials);
      }
    }

    async function loadAllContent() {
      try {
        // 1. Try reading from cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            hydrateData(data);
            setLoadingCms(false);
            
            // Stale-While-Revalidate: fetch in background silently to update the cache
            fetch('/api/content')
              .then((res) => res.json())
              .then((result) => {
                if (result.success) {
                  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result }));
                }
              })
              .catch(() => {});
            return;
          }
        }

        // 2. Load fresh from API if no cache or expired
        const res = await fetch('/api/content');
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result }));
            hydrateData(result);
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
      
      {/* 1. MAIN HERO FULL-WIDTH SLIDER SECTION */}
      <div className="relative w-full border-b border-slate-900 overflow-hidden">
        <HeroSlider 
          images={[
            cms.home_slider_image_1,
            cms.home_slider_image_2,
            cms.home_slider_image_3,
            cms.home_slider_image_4,
            cms.home_slider_image_5,
          ].filter(Boolean)}
        >
          <div className="w-full min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] flex flex-col justify-center py-16 sm:py-24 px-6 sm:px-12 lg:px-20 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:max-w-[60%] lg:mr-[40%] text-left space-y-6 sm:space-y-8"
            >
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-amber-500 rounded-none inline-block animate-pulse"></span>
                <h2 className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase text-amber-500 font-mono bg-amber-950/40 border border-amber-500/20 px-2.5 py-1 backdrop-blur-sm">
                  Flavour Your World. Fuel Your Industry.
                </h2>
              </div>
              
              {loadingCms ? (
                <div className="space-y-4">
                  <div className="h-14 bg-slate-800/50 animate-pulse w-3/4"></div>
                  <div className="h-8 bg-slate-800/50 animate-pulse w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight uppercase drop-shadow-sm">
                    {cms.home_hero_title}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-xl text-slate-250 max-w-2xl leading-relaxed font-sans font-medium text-slate-200 drop-shadow-sm">
                    {cms.home_hero_subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-amber-400 max-w-lg leading-relaxed font-mono uppercase tracking-wider">
                    {cms.home_hero_description}
                  </p>
                </div>
              )}
              
              {/* CTA Action Buttons (Minimum 44x44px touch target) */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  id="cta-explore-products"
                  href="/products"
                  className="min-h-[48px] bg-amber-500 text-slate-950 hover:bg-white hover:scale-[1.02] transition-all duration-200 px-6 sm:px-10 py-3.5 sm:py-4 font-black text-xs sm:text-sm rounded-lg tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  id="cta-req-quote"
                  href="/contact"
                  className="min-h-[48px] border-2 border-white/90 text-white hover:bg-white/15 hover:border-white hover:scale-[1.02] transition-all duration-200 px-6 sm:px-10 py-3.5 sm:py-4 font-black text-xs sm:text-sm rounded-lg tracking-wider uppercase flex items-center justify-center text-center backdrop-blur-sm"
                >
                  Request a Quote
                </Link>
              </div>

              {/* Supporting Stat Badges (Crisp Light Theme Elevation) */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-8 border-t border-white/20 max-w-xl text-[10px] sm:text-xs font-mono font-bold">
                <div className="flex items-center gap-2.5 p-3.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-md">
                  <span className="text-amber-600 text-lg sm:text-xl">🏭</span>
                  <div className="leading-tight">
                    <span className="block text-slate-900 font-black text-sm sm:text-base">{cms.stats_products || "500+"}</span>
                    <span className="text-slate-600 text-[8px] sm:text-[9px] block uppercase font-semibold">Products Supplied</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-md">
                  <span className="text-amber-600 text-lg sm:text-xl">🤝</span>
                  <div className="leading-tight">
                    <span className="block text-slate-900 font-black text-sm sm:text-base">{cms.stats_partners || "100+"}</span>
                    <span className="text-slate-600 text-[8px] sm:text-[9px] block uppercase font-semibold">Industry Partners</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-md">
                  <span className="text-amber-600 text-lg sm:text-xl">⚗️</span>
                  <div className="leading-tight">
                    <span className="block text-slate-900 font-black text-sm sm:text-base">{cms.stats_expertise || "10+ Years"}</span>
                    <span className="text-slate-600 text-[8px] sm:text-[9px] block uppercase font-semibold">Of Expertise</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </HeroSlider>
      </div>

      {/* 2. DYNAMIC TRUST STRIP / MARQUEE */}
      <div className="bg-amber-500 text-slate-950 font-mono text-[10px] sm:text-xs font-black py-4 uppercase border-b border-slate-200 overflow-hidden relative select-none shrink-0 tracking-wider">
        <div className="w-full overflow-hidden flex whitespace-nowrap">
          <div className="animate-marquee flex gap-16 shrink-0 pr-16 items-center">
            <span>{cms.trust_strip_text || "Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal"}</span>
            <span className="text-slate-950/40">✦</span>
            <span>{cms.trust_strip_text || "Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal"}</span>
            <span className="text-slate-950/40">✦</span>
            <span>{cms.trust_strip_text || "Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal"}</span>
            <span className="text-slate-950/40">✦</span>
          </div>
        </div>
      </div>

      {/* 3. NEW STUNNING ABOUT US HOMEPAGE SECTION (Replaces "Who We Are" and "A Complete Range") */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-slate-200 relative overflow-hidden" id="homepage-about-us-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Exquisite Image Visualizer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 h-[350px] sm:h-[450px] bg-slate-100 overflow-hidden relative border border-slate-200 shadow-sm rounded-xl group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={cms.home_about_section_image || "https://res.cloudinary.com/dzi8j5wjd/image/upload/v1783880285/techsol-slider-1_sczwle.png"}
              alt="Techsol Spices Food Quality Testing Lab" 
              className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent"></div>
            {cms.home_about_section_image_text && (
              <div className="absolute bottom-6 left-6 text-white font-mono text-[10px] tracking-widest uppercase font-extrabold bg-amber-600 px-3.5 py-2 rounded-md">
                {cms.home_about_section_image_text}
              </div>
            )}
          </motion.div>

          {/* Right Side: Elegant Story Copy */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono block">
              About Techsol International
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">
              {cms.home_about_section_heading || "Your Premier Partner in Food Flavour & Production Science"}
            </h2>
            <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans font-medium">
              {cms.home_about_section_text || "Techsol International bridges the gap between premium global ingredient science and Nepal's burgeoning food manufacturing industry. Operating from Koteshwor-Tinkune in Kathmandu, we supply high-grade food flavours, compound seasonings, and specialized recipe formulations to major confectionery, beverage, dairy, and snack brands across Nepal."}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
              {cms.home_about_section_subtext || "Beyond world-class ingredients, we provide professional mechanical and plant engineering consulting. From automated optical sorting setups to turnkey flour mills and liquid packaging lines, we help local food processors optimize layouts, reduce overheads, and scale output cleanly."}
            </p>

            <div className="pt-4 flex items-center gap-6">
              <Link href="/about" className="min-h-[44px] inline-flex items-center bg-slate-900 hover:bg-amber-600 text-white font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-lg transition-colors duration-200">
                View more
              </Link>
              <Link href="/contact" className="min-h-[44px] inline-flex items-center text-xs font-bold tracking-wider text-slate-900 hover:text-amber-600 uppercase transition-all gap-1.5">
                <span>Speak with an Advisor</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. MARKET OPERATIONS: INDUSTRIES WE SERVE ACROSS NEPAL (Flawless, High-Contrast Design with Full-Opacity Photography) */}
      <section className="bg-slate-50/70 py-20 px-4 sm:px-8 border-b border-slate-200" id="homepage-industries-section">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header Block with Clear Editorial Hierarchy */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-800 text-[11px] font-bold uppercase tracking-[0.25em] font-mono px-3 py-1 rounded-full border border-amber-200/80">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Market Operations
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
                Industries We Serve Across Nepal
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                We deploy specialized food flavours, high-potency functional ingredients, and turnkey processing setups across Nepal&apos;s leading food and beverage manufacturing sectors.
              </p>
            </div>

            {/* Quick Link Button */}
            <div className="shrink-0 flex items-center gap-2">
              <Link
                href="/products"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-xs"
              >
                <span>Browse Full Range</span>
                <ArrowRight className="h-4 w-4 text-amber-600" />
              </Link>
            </div>
          </div>

          {/* Grid Layout of Flawless, Crisp Cards with Full-Fidelity Images & Zero Washed-Out Overlays */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sector 1: Bakery & Confectionery */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Crisp Photography Container (100% Opacity, No milky overlays) */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
                  alt="Bakery and Confectionery Flavour Solutions Nepal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                {/* Floating Category Pill */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-600">01</span>
                  <span className="text-[10px] font-mono font-bold text-slate-900 uppercase">Bakery</span>
                </div>
                {/* Sector Icon Badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-amber-600 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <Cookie className="h-4 w-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-lg text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                    {cms.home_industry_title_1 || 'Bakery & Confectionery'}
                  </h4>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {cms.home_industry_desc_1 || 'Breads, cakes, biscuits, cookies, pastries, chocolates, and candies — flavours and functional ingredients delivering consistent taste and oven-rise at scale.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Bake-Stable Aromas</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Emulsifiers</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Vanillin & Cocoa</span>
                  </div>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors group-hover:gap-2 duration-200"
                  >
                    <span>View Bakery Solutions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Sector 2: Beverages */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Crisp Photography Container */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800"
                  alt="Beverage Flavour Concentrates Nepal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                {/* Floating Category Pill */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-600">02</span>
                  <span className="text-[10px] font-mono font-bold text-slate-900 uppercase">Beverages</span>
                </div>
                {/* Sector Icon Badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-amber-600 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <CupSoda className="h-4 w-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-lg text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                    {cms.home_industry_title_2 || 'Beverages & Soft Drinks'}
                  </h4>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {cms.home_industry_desc_2 || 'Soft drinks, juices, energy drinks, flavoured water, and syrups — clear liquid concentrates and spray-dried powder flavours ensuring crisp, vibrant profiles.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Citrus & Tropical</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Cloudifying Agents</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Water Soluble</span>
                  </div>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors group-hover:gap-2 duration-200"
                  >
                    <span>View Beverage Solutions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Sector 3: Dairy & Ice Cream */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Crisp Photography Container */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800"
                  alt="Dairy and Ice Cream Solutions Nepal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                {/* Floating Category Pill */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-600">03</span>
                  <span className="text-[10px] font-mono font-bold text-slate-900 uppercase">Dairy</span>
                </div>
                {/* Sector Icon Badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-amber-600 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <Milk className="h-4 w-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-lg text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                    {cms.home_industry_title_3 || 'Dairy & Ice Cream'}
                  </h4>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {cms.home_industry_desc_3 || 'Flavoured milk, yoghurt, paneer, butter, ice cream, and kulfi — optimized for cold temperature stability and rich, authentic mouthfeel across batch runs.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Freeze-Thaw Stable</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Kulfi & Cardamom</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Dairy Stabilizers</span>
                  </div>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors group-hover:gap-2 duration-200"
                  >
                    <span>View Dairy Solutions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Sector 4: Snacks & Namkeen */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Crisp Photography Container */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800"
                  alt="Snacks and Namkeen Seasonings Nepal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                {/* Floating Category Pill */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-600">04</span>
                  <span className="text-[10px] font-mono font-bold text-slate-900 uppercase">Snacks</span>
                </div>
                {/* Sector Icon Badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-amber-600 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <Flame className="h-4 w-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-lg text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                    {cms.home_industry_title_4 || 'Snacks & Namkeen'}
                  </h4>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {cms.home_industry_desc_4 || 'Chips, extruded snacks, bhujia, popcorn, and puffed products — savoury seasoning blends and spice concentrates delivering bold, authentic taste.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Extrusion Blends</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Nepali Masala Profiles</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">Oil-Soluble Notes</span>
                  </div>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors group-hover:gap-2 duration-200"
                  >
                    <span>View Snack Seasonings</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Regional Industrial Connectivity Ribbon */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Active Industrial Corridors & Nationwide Supply
                </h5>
                <p className="text-xs text-slate-600">
                  Direct stock deliveries and on-site food technologist consultations available in Biratnagar, Bhairahawa, Birgunj, Nepalgunj, Pokhara, and Kathmandu Valley.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors text-center inline-flex items-center justify-center gap-2"
              >
                <span>Request Custom Samples</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. INDUSTRIAL TESTIMONIALS SLIDER */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-slate-200" id="homepage-testimonials-section">
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

                {/* Left and Right navigation buttons (Minimum 44x44px touch targets) */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handlePrevTestimonial}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border border-slate-200 text-slate-800 hover:text-amber-600 hover:border-amber-500 rounded-lg shadow-xs transition-all cursor-pointer"
                    aria-label="Previous testimonial"
                    id="testimonial-prev-btn"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                  <span className="text-[11px] font-mono font-semibold text-slate-500 px-2 min-w-[45px] text-center select-none">
                    {activeTestimonialIndex + 1} / {testimonials.length}
                  </span>
                  <button
                    onClick={handleNextTestimonial}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border border-slate-200 text-slate-800 hover:text-amber-600 hover:border-amber-500 rounded-lg shadow-xs transition-all cursor-pointer"
                    aria-label="Next testimonial"
                    id="testimonial-next-btn"
                  >
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            // Spinner/Placeholder fallback
            <div className="text-center py-10 bg-slate-50 border border-slate-150 text-slate-400 text-xs font-mono">
              Fetching operators validation Appraisals...
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
