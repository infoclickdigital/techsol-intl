'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Cpu, Factory, Zap, Settings, ShieldCheck, Loader, CheckCircle2, ArrowRight } from 'lucide-react';
import RequestQuoteModal from '@/components/RequestQuoteModal';

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

export default function SingleServicePage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        const id = params.id as string;
        const res = await fetch('/api/content?scope=services');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data.length > 0) {
            const found = result.data.find((s: any) => s.id === id);
            if (found) {
              setService(found);
              return;
            }
          }
        }
        const staticMatch = STATIC_SERVICES.find(s => s.id === id);
        if (staticMatch) {
          setService(staticMatch);
        }
      } catch (e) {
        console.error('Error loading service detail:', e);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] text-xs font-mono text-slate-400 gap-2">
        <Loader className="h-6 w-6 animate-spin text-amber-500" />
        <span>Fetching service blueprints...</span>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
        <h2 className="text-lg font-black text-slate-900 uppercase">Service Blueprint Not Found</h2>
        <Link href="/services" className="bg-slate-900 text-white text-[10px] font-mono tracking-widest uppercase px-5 py-3 font-bold">
          Return to Services
        </Link>
      </div>
    );
  }

  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="h-7 w-7 text-amber-600" />;
      case 'Factory': return <Factory className="h-7 w-7 text-amber-600" />;
      case 'Zap': return <Zap className="h-7 w-7 text-amber-600" />;
      case 'Settings': return <Settings className="h-7 w-7 text-amber-600" />;
      default: return <ShieldCheck className="h-7 w-7 text-amber-600" />;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div>
          <Link 
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Back to Services</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Service Image banner panel */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-4">
            <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'}
                alt={service.title}
                className="w-full h-full object-cover grayscale opacity-95 hover:grayscale-0 transition-opacity"
              />
              <div className="absolute top-4 left-4 bg-slate-950/90 text-white font-mono text-[9px] px-3 py-1.5 uppercase tracking-widest">
                Blueprinted Line
              </div>
            </div>
          </div>

          {/* Service Core layout */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white border border-slate-200">
                  {getIcon(service.icon_name)}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-600 block">
                    Engineering Services Briefing
                  </span>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 uppercase tracking-tight">
                    {service.title}
                  </h1>
                </div>
              </div>
              
              <div className="bg-white border-l-2 border-slate-950 p-4 text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                {service.description}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans pt-1">
                {service.details}
              </p>
            </div>

            {/* Structured action panel */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 space-y-4">
              <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                Standard Deployment Scope & Deliverables
              </h4>
              <ul className="text-xs text-slate-300 divide-y divide-slate-800 font-sans space-y-2">
                <li className="pt-2 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                  <span>On-site mechanical evaluation, grounding tests, and vibration calibration diagnostics.</span>
                </li>
                <li className="pt-2 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                  <span>Logical integration mapping with active Siemens/Amron SCADA host telemetry boards.</span>
                </li>
                <li className="pt-2 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                  <span>3-Month continuous maintenance support with instant engineering dispatch from Kathmandu hubs.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setQuoteOpen(true)}
                className="bg-slate-950 text-white hover:bg-amber-600 transition-colors font-mono font-bold text-xs tracking-widest uppercase py-4 px-8 rounded-none inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Request Custom Service Quote</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      <RequestQuoteModal 
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        itemName={service.title}
        itemType="service"
      />
    </div>
  );
}
