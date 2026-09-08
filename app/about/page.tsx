'use client';

import React, { useState, useEffect } from 'react';
import { Target, Eye, CheckCircle2, Loader, Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [cms, setCms] = useState({
    about_hero_title: 'Our Heritage & Vision',
    about_hero_subtitle: "Partnering with Nepal's food manufacturers to elevate taste, lock in premium quality, and consult on production excellence.",
    about_story: "Techsol International was established with a singular vision: to support Nepal's food and agro-industrial sector with high-quality ingredients, premium food flavours, and expert machine consulting services. Since 2011, we have grown to become a dedicated supplier of premium food flavours, functional ingredients, namkeen spice seasonings, and bakery solutions. We partner closely with local manufacturers from our bases in Tinkune, Kathmandu, helping scale production lines and formulate delicious, consumer-loved products.",
    about_mission: "To supply premium ingredients and state-of-the-art consulting services that empower Nepal's food manufacturers to create high-quality, delicious, and market-ready products with complete technical confidence.",
    about_vision: "To lead Nepal's food and beverage sector towards complete self-sufficiency and high-export potential by delivering world-class flavor science and turnkey production design solutions.",
    about_operational_framework: "Techsol International provides certified food-grade, safe, and highly calibrated flavor formulations and production layouts that comply with global hygiene and manufacturing standards.",
    about_cert_1_title: 'Government Grade 1',
    about_cert_1_desc: 'Certified for handling multi-TPH heavy milling erections.',
    about_cert_2_title: 'ISO 9001:2015 Standards',
    about_cert_2_desc: 'All CCD cameras and air manifolds compliant with global safety.',
    home_industry_title_1: 'Bakery & Confectionery',
    home_industry_desc_1: 'Breads, cakes, biscuits, cookies, pastries, chocolates, and candies — we supply flavours and functional ingredients that deliver consistent taste and texture at scale.',
    home_industry_title_2: 'Beverages',
    home_industry_desc_2: 'Soft drinks, juices, energy drinks, flavoured water, traditional Nepali drinks — our liquid and powder flavours ensure clean, vibrant taste profiles.',
    home_industry_title_3: 'Dairy & Ice Cream',
    home_industry_desc_3: 'Flavoured milk, yoghurt, paneer, butter, ice cream, and kulfi — our dairy-specific flavour range is optimized for heat stability and cold temperature performance.',
    home_industry_title_4: 'Snacks & Namkeen',
    home_industry_desc_4: 'Chips, extruded snacks, nuts, popcorn, and puffed products — our savoury seasoning blends deliver the bold tastes Nepali consumers love.',
  });
  
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  useEffect(() => {
    const CACHE_KEY = 'techsol_home_data_cache';
    const CACHE_TTL = 300000; // 5 minutes in ms

    function hydrateAboutData(result: any) {
      if (result.cms) {
        setCms((prev) => {
          const mapped = { ...prev };
          result.cms.forEach((item: any) => {
            if (item.key in mapped) {
              mapped[item.key as keyof typeof prev] = item.value;
            }
          });
          return mapped;
        });
      }
      if (result.team) {
        setTeamMembers(result.team);
      }
      if (result.testimonials) {
        setTestimonials(result.testimonials);
      }
    }

    async function loadAboutData() {
      try {
        // 1. Check local cache first for lightning fast instant loading
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            hydrateAboutData(data);
            setLoading(false);
            
            // Stale-While-Revalidate background sync
            fetch('/api/content')
              .then(res => res.json())
              .then(result => {
                if (result.success) {
                  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result }));
                }
              })
              .catch(() => {});
            return;
          }
        }

        // 2. Fetch fresh from endpoint if no cache or expired
        const [cmsRes, teamRes, allRes] = await Promise.all([
          fetch('/api/content?scope=cms'),
          fetch('/api/content?scope=team'),
          fetch('/api/content')
        ]);
        
        let fetchedData: any = {};
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          if (cmsData.success && cmsData.data) {
            fetchedData.cms = cmsData.data;
          }
        }
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          if (teamData.success && teamData.data) {
            fetchedData.team = teamData.data;
          }
        }
        if (allRes.ok) {
          const allData = await allRes.json();
          if (allData.success) {
            fetchedData.testimonials = allData.testimonials;
            // Also store back to full cache
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: allData }));
          }
        }

        hydrateAboutData(fetchedData);
      } catch (err) {
        console.error('Error loading about pages CMS data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAboutData();
  }, []);

  const handlePrevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* About Hero Section */}
        <div id="about-hero-header" className="border-b border-slate-200 pb-8 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono">
            Corporate Identity
          </span>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader className="h-5 w-5 animate-spin text-amber-600" />
              <span className="text-xs font-mono text-slate-450">Fetching corporate registry...</span>
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                {cms.about_hero_title}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-500 max-w-3xl leading-relaxed">
                {cms.about_hero_subtitle}
              </p>
            </>
          )}
        </div>

        {/* Story Section & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-slate-900"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                Our Genesis & Growth
              </h3>
            </div>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans first-letter:text-4xl first-letter:font-black first-letter:text-amber-600 first-letter:mr-3 first-letter:float-left">
              {cms.about_story}
            </p>

            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h4 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest">
                Our Team
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {teamMembers.length > 0 ? (
                  teamMembers.map((member) => (
                    <div key={member.id} className="p-3 bg-slate-50 border border-slate-200 flex gap-3 items-center rounded-none group hover:border-amber-500 transition-colors">
                      <div className="w-12 h-12 shrink-0 bg-slate-200 overflow-hidden border border-slate-150">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={member.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'} 
                          alt={member.name}
                          className="w-full h-full object-cover opacity-100 transition-all duration-200"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-1 font-sans">
                        <span className="font-extrabold text-slate-900 block text-xs uppercase group-hover:text-amber-600 transition-colors">
                          {member.name}
                        </span>
                        <span className="text-slate-500 font-mono text-[9px] block uppercase leading-none">
                          {member.position}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallbacks
                  <>
                    <div className="border-l-2 border-amber-600 pl-3 py-1.5 bg-slate-50 font-mono">
                      <span className="font-extrabold text-slate-950 block">Er. R. K. Shrestha</span>
                      <span className="text-slate-400 text-[10px]">Senior Plant Designer & Co-founder</span>
                    </div>
                    <div className="border-l-2 border-amber-600 pl-3 py-1.5 bg-slate-50 font-mono">
                      <span className="font-extrabold text-slate-950 block">Abhushit Chaudhary</span>
                      <span className="text-slate-400 text-[10px]">Corporate Project Director</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Graphical Side-block: ISO & Certifications */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-10 space-y-8 flex flex-col justify-between min-h-[300px]">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 font-mono">
                Operational Framework
              </h4>
              <p className="text-xs text-slate-350 leading-relaxed">
                {cms.about_operational_framework}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-white block">{cms.about_cert_1_title || 'Government Grade 1'}</span>
                  <span className="text-slate-400">{cms.about_cert_1_desc || 'Certified for handling multi-TPH heavy milling erections.'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-white block">{cms.about_cert_2_title || 'ISO 9001:2015 Standards'}</span>
                  <span className="text-slate-400">{cms.about_cert_2_desc || 'All CCD cameras and air manifolds compliant with global safety.'}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] uppercase font-mono text-slate-500 pt-4">
              TECHSOL International Corp
            </div>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-12">
          
          {/* Mission Card */}
          <div className="bg-white border border-slate-200 p-6 sm:p-10 space-y-4 hover:border-slate-800 transition-colors duration-200 rounded-none shadow-xs">
            <div className="p-3 bg-amber-50 w-fit">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 font-mono">
              Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
              {cms.about_mission}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white border border-slate-200 p-6 sm:p-10 space-y-4 hover:border-slate-800 transition-colors duration-200 rounded-none shadow-xs">
            <div className="p-3 bg-slate-900 text-white w-fit">
              <Eye className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 font-mono">
              Our Vision
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
              {cms.about_vision}
            </p>
          </div>

        </div>

        {/* REPLACEMENT 1: INDUSTRIES WE SERVE ACCROSS NEPAL (Bento Cards with Images) */}
        <div className="border-t border-slate-200 pt-16 space-y-12" id="about-industries-section">
          <div className="text-center md:text-left space-y-3 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono block">
              Market Operations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              Industries We Serve Across Nepal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
              We supply specialized ingredients, customized powder formulations, and automated hardware setups across all key industrial corridors.
            </p>
          </div>

          {/* Bento card set for About page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Bakery Card */}
            <div className="relative h-[280px] bg-slate-950 border border-slate-200 overflow-hidden group flex flex-col justify-end p-6">
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400"
                  alt="Bakery Industry"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-[8px] font-mono text-amber-500 font-bold block">01 / BAKERY</span>
                <h4 className="font-extrabold text-base uppercase text-white tracking-wide">{cms.home_industry_title_1}</h4>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Consistent textures, sweet notes, and certified emulsifiers for major biscuit and cake plants.
                </p>
              </div>
            </div>

            {/* Beverage Card */}
            <div className="relative h-[280px] bg-slate-950 border border-slate-200 overflow-hidden group flex flex-col justify-end p-6">
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
                  alt="Beverage Industry"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-[8px] font-mono text-amber-500 font-bold block">02 / BEVERAGE</span>
                <h4 className="font-extrabold text-base uppercase text-white tracking-wide">{cms.home_industry_title_2}</h4>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Premium heat-stable liquid concentrates, citric profiles, and customized cloudifying agents.
                </p>
              </div>
            </div>

            {/* Dairy Card */}
            <div className="relative h-[280px] bg-slate-950 border border-slate-200 overflow-hidden group flex flex-col justify-end p-6">
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400"
                  alt="Dairy Industry"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-[8px] font-mono text-amber-500 font-bold block">03 / DAIRY</span>
                <h4 className="font-extrabold text-base uppercase text-white tracking-wide">{cms.home_industry_title_3}</h4>
                <p className="text-[10px] text-slate-300 leading-tight">
                  High cold-temp performance flavorings, stabilizer systems, and automated packager setups.
                </p>
              </div>
            </div>

            {/* Snacks Card */}
            <div className="relative h-[280px] bg-slate-950 border border-slate-200 overflow-hidden group flex flex-col justify-end p-6">
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400"
                  alt="Snacks Industry"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-[8px] font-mono text-amber-500 font-bold block">04 / SNACKS</span>
                <h4 className="font-extrabold text-base uppercase text-white tracking-wide">{cms.home_industry_title_4}</h4>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Bold seasoning salts, custom spice compound powders, and automated optical food sorting.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* REPLACEMENT 2: TESTIMONIALS SLIDER FOR ABOUT US PAGE */}
        {testimonials.length > 0 && (
          <div className="border-t border-slate-200 pt-16 space-y-10" id="about-testimonials-section">
            <div className="text-center md:text-left space-y-3 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono block">
                Verification Appraisals
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
                Endorsements from {"Nepal's"} Food Operators
              </h2>
            </div>

            <div className="relative bg-white p-6 sm:p-10 border border-slate-200 space-y-6 flex flex-col justify-between overflow-hidden">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-slate-100 stroke-1 pointer-events-none" />
              
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
                transition={{ duration: 0.25 }}
                className="space-y-4 min-h-[120px] flex flex-col justify-center"
              >
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif font-medium italic pr-5">
                  &ldquo;{testimonials[activeTestimonialIndex]?.quote}&rdquo;
                </p>
              </motion.div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
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

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevTestimonial}
                    className="p-2 bg-slate-50 border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-slate-800 transition-all cursor-pointer"
                    aria-label="Previous appraisal"
                    id="about-testimonial-prev"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400 min-w-[40px] text-center select-none">
                    {activeTestimonialIndex + 1} / {testimonials.length}
                  </span>
                  <button
                    onClick={handleNextTestimonial}
                    className="p-2 bg-slate-50 border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-slate-800 transition-all cursor-pointer"
                    aria-label="Next appraisal"
                    id="about-testimonial-next"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
