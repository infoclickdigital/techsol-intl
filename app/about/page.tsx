'use client';

import React, { useState, useEffect } from 'react';
import { Target, Award, ShieldAlert, CheckCircle2, Factory, Eye, Milestone, Loader } from 'lucide-react';

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [cms, setCms] = useState({
    about_hero_title: 'Our Heritage & Vision',
    about_hero_subtitle: "Partnering with Nepal's food manufacturers to elevate taste, lock in premium quality, and consult on production excellence.",
    about_story: "Techsol International was established with a singular vision: to support Nepal's food and agro-industrial sector with high-quality ingredients, premium food flavours, and expert machine consulting services. Since 2011, we have grown to become a dedicated supplier of premium food flavours, functional ingredients, namkeen spice seasonings, and bakery solutions. We partner closely with local manufacturers from our bases in Tinkune, Kathmandu, helping scale production lines and formulate delicious, consumer-loved products.",
    about_mission: "To supply premium ingredients and state-of-the-art consulting services that empower Nepal's food manufacturers to create high-quality, delicious, and market-ready products with complete technical confidence.",
    about_vision: "To lead Nepal's food and beverage sector towards complete self-sufficiency and high-export potential by delivering world-class flavor science and turnkey production design solutions.",
    about_operational_framework: "Techsol International provides certified food-grade, safe, and highly calibrated flavor formulations and production layouts that comply with global hygiene and manufacturing standards.",
    about_chronology: 'Charting fifteen years of technological integration, converting domestic agro-manufacturers into regional export leaders.',
    about_inspections: 'Every machinery setup, raw component, compressor, and sorter undergoes 72 hours of continuous-load trial testing before shipping from our Kathmandu hubs. We guarantee zero moisture leakage, anti-dust build, and exact calibration to fit your localized power grid requirements.'
  });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const [cmsRes, teamRes] = await Promise.all([
          fetch('/api/content?scope=cms'),
          fetch('/api/content?scope=team')
        ]);
        
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          if (cmsData.success && cmsData.data) {
            const mapped = { ...cms };
            cmsData.data.forEach((item: any) => {
              if (item.key in mapped) {
                mapped[item.key as keyof typeof cms] = item.value;
              }
            });
            setCms(mapped);
          }
        }

        if (teamRes.ok) {
          const teamData = await teamRes.json();
          if (teamData.success && teamData.data) {
            setTeamMembers(teamData.data);
          }
        }
      } catch (err) {
        console.error('Error loading about pages CMS data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAboutData();
  }, []);

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
              <span className="text-xs font-mono text-slate-400">Fetching corporate registry...</span>
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
                    <div key={member.id} className="p-3 bg-slate-50 border border-slate-200 flex gap-3 items-center rounded-none group hover:border-amber-550 transition-colors">
                      <div className="w-12 h-12 shrink-0 bg-slate-200 overflow-hidden border border-slate-150">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={member.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'} 
                          alt={member.name}
                          className="w-full h-full object-cover opacity-100 transition-all duration-200"
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
                  // Fallbacks in case seed has empty rows
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
                  <span className="font-bold text-white block">Government Grade 1</span>
                  <span className="text-slate-400">Certified for handling multi-TPH heavy milling erections.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-white block">ISO 9001:2015 Standards</span>
                  <span className="text-slate-400">All CCD cameras and air manifolds compliant with global safety.</span>
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

        {/* Dynamic Timeline Milestone Section */}
        <div className="border-t border-slate-200 pt-16 space-y-12">
          <div className="text-center md:text-left space-y-3 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono block">
              Historical Milestones
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              Chronology of Industrial Progress in Nepal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              {cms.about_chronology}
            </p>
          </div>

          <div className="relative border-l border-slate-200 ml-4 pl-8 space-y-10 py-2">
            
            <div className="relative">
              <div className="absolute -left-12 top-1 w-4 h-4 bg-amber-600 border-4 border-white"></div>
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-black text-amber-600">2011 &ndash; FOUNDATION</span>
                <h4 className="font-black text-slate-900 uppercase text-sm sm:text-base">Kathmandu Erection Facility Established</h4>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Techsol International is founded near Tinkune, Kathmandu, introducing the first localized technical support desk for photoelectric agricultural sorters in the country.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-12 top-1 w-4 h-4 bg-slate-900 border-4 border-white"></div>
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-black text-amber-600">2016 &ndash; MILL EXPANSION</span>
                <h4 className="font-black text-slate-900 uppercase text-sm sm:text-base">Pioneered Integrated Rice & Wheat Plants</h4>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Began full-workflow design and civil layout commissioning of heavy 5-10 TPH mills in Biratnagar and Bhairahawa corridors to support domestic grain self-sufficiency.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-12 top-1 w-4 h-4 bg-slate-900 border-4 border-white"></div>
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-black text-amber-600">2021 &ndash; CRYOGENIC ENGINEERING</span>
                <h4 className="font-black text-slate-900 uppercase text-sm sm:text-base">First Cryogenic Spice Mills in Kathmandu Valley</h4>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Developed customized cooling chambers utilizing liquid nitrogen to crush cardamom (alaichi) and ginger without degrading essential volatile oils.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-12 top-1 w-4 h-4 bg-amber-600 border-4 border-white animate-pulse"></div>
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-black text-amber-600">2026 &ndash; SMART AUTOMATION</span>
                <h4 className="font-black text-slate-900 uppercase text-sm sm:text-base">Centralized PLC-SCADA Logic Integration</h4>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Present-day rollout of smart sensors, enabling factory managers to monitor machine feeds, throughputs, temperature gauges, and sorting purity values directly via centralized management screens.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Corporate Certification & Values Badge */}
        <div className="bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
              Validation & Compliance
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Rigorous Engineering Inspections & Testing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {cms.about_inspections}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[10px] uppercase font-mono tracking-widest text-slate-400">
              <Milestone className="h-4 w-4 text-amber-500" />
              <span>Certified Plant layout operator &mdash; No: 9112-AG-NEPAL</span>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-full bg-linear-to-l from-slate-800/10 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
}
