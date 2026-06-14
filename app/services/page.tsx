'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, Factory, Zap, Settings, ShieldCheck, HelpCircle, ArrowRight, Loader } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  details: string;
  image_url?: string;
}

const STATIC_SERVICES: Service[] = [
  {
    id: 'service-sorting',
    title: 'Smart Optical Sorting Calibration',
    description: 'Our team provides high-chromic CCD optical sorting installation and precision calibration, ensuring 99.98% purity.',
    icon_name: 'Cpu',
    details: 'We customize the ejection sensitivity settings on-site to handle dynamic grain properties, such as locally farmed rice, pulses, and organic green tea leaves.',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'service-turnkey',
    title: 'Complete Turnkey Project Management',
    description: 'End-to-end industrial architecture, mechanical erection, civil foundation verification, and logical automation.',
    icon_name: 'Factory',
    details: 'From blueprinted plant flow diagrams to full production commissioning, we take complete structural accountability for modern factories across Nepal.',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'service-liquid',
    title: 'Liquid Processing & Filling Systems',
    description: 'High-speed linear and rotary volumetric liquid processing and packaging solutions.',
    icon_name: 'Zap',
    details: 'Designed with food-grade SUS316 clean components. Suitable for bottled Himalayan spring water, local edible oils, fruit beverage nectars, and packaging.',
    image_url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'service-milling',
    title: 'Grain Processing Plant Engineering',
    description: 'Designing and scaling industrial-grade high-yield flour mills and rice mills.',
    icon_name: 'Settings',
    details: 'We supply high-rigidity roller assemblies and vibro-destoners, along with pneumatic conveying routes that maximize hourly output and reduce ash content.',
    image_url: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'service-customer',
    title: '24/7 Operations & Maintenance',
    description: 'Local engineering support dispatched from our Kathmandu and Biratnagar offices.',
    icon_name: 'ShieldCheck',
    details: 'With localized stocks of critical spare parts (e.g. CCD cameras, high-slick modular chutes, pneumatic ejectors, PLC controllers), we guarantee zero plant downtime.',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'
  }
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/content?scope=services');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data.length > 0) {
            setServices(result.data);
          } else {
            setServices(STATIC_SERVICES);
          }
        } else {
          setServices(STATIC_SERVICES);
        }
      } catch (err) {
        console.error('Error loading services dynamically:', err);
        setServices(STATIC_SERVICES);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="h-6 w-6 text-amber-600" />;
      case 'Factory': return <Factory className="h-6 w-6 text-amber-600" />;
      case 'Zap': return <Zap className="h-6 w-6 text-amber-600" />;
      case 'Settings': return <Settings className="h-6 w-6 text-amber-600" />;
      default: return <ShieldCheck className="h-6 w-6 text-amber-600" />;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header segment */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono">
            Engineering Scope
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Services & Field Operations
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            From civil diagnostics to mechanical automation, our factory engineering services ensure consistent plant load capacity and maximum yield ratios.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 py-12">
            <Loader className="h-4 w-4 animate-spin text-amber-600" />
            <span>Retrieving project service blueprints...</span>
          </div>
        ) : (
          <div className="space-y-12">
            {services.map((srv, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={srv.id}
                  className={`bg-white border border-slate-200 grid grid-cols-1 lg:grid-cols-12 overflow-hidden hover:border-slate-800 transition-all duration-200 ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Text Details layout (Cols 1-7 or similar) */}
                  <div className={`p-8 sm:p-12 lg:col-span-7 flex flex-col justify-between space-y-8 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 rounded-none">
                          {getIcon(srv.icon_name)}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                          {srv.title}
                        </h2>
                      </div>
                      
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                        {srv.description}
                      </p>
                      
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {srv.details}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                      <div className="flex gap-2">
                        <Link
                          href="/contact"
                          className="bg-slate-900 hover:bg-amber-600 transition-all text-white font-black text-[10px] tracking-wider uppercase py-3 px-4 rounded-none inline-flex items-center gap-1.5"
                        >
                          <span>Schedule Inspection</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/services/${srv.id}`}
                          className="border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-black text-[10px] tracking-wider uppercase py-3 px-4 rounded-none inline-flex items-center gap-1.5"
                        >
                          <span>Details</span>
                        </Link>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        ID: TS-SERV-{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Image/Visual wrapper (Cols 8-12) */}
                  <div className={`h-[280px] lg:h-auto lg:col-span-5 relative bg-slate-100 overflow-hidden ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    {/* Cloudinary-ready fallback mockup image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={srv.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'}
                      alt={srv.title}
                      className="w-full h-full object-cover opacity-100 hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-xs text-amber-500 font-mono text-[9px] uppercase px-2 py-1 tracking-widest font-black">
                      Live Project
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
