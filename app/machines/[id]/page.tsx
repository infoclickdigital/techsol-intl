'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Cpu, ArrowUpRight, Loader, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import RequestQuoteModal from '@/components/RequestQuoteModal';

interface Machine {
  id: string;
  category: string;
  name: string;
  description: string;
  specs: Record<string, string>;
  capacity: string;
  power: string;
  image_url?: string;
}

const STATIC_MACHINES: Machine[] = [
  {
    id: 'rice-mill-1',
    category: 'milling',
    name: 'Techsol Elite Rice Miller 1500',
    description: 'High-yield multi-stage horizontal whitener and polisher. Drastically minimizes grain breakage while preserving the husk integrity.',
    capacity: '15.0 - 20.0 Metric Tons / Hr',
    power: '45 kW High-torque Phase 3 Motors',
    specs: {
      'Separation Grade': 'Grade 1 Certified',
      'Roll Speed': '850 RPM calibrated',
      'Aspirator Capacity': '65 m³/min High-volume',
    },
    image_url: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=600'
  }
];

export default function SingleMachinePage() {
  const params = useParams();
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    async function loadMachine() {
      try {
        const id = params.id as string;
        const res = await fetch('/api/content?scope=products');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data.length > 0) {
            const found = result.data.find((p: any) => p.id === id);
            if (found) {
              let parsedSpecs = {};
              try {
                parsedSpecs = typeof found.specs === 'string' ? JSON.parse(found.specs) : found.specs || {};
              } catch (e) {
                console.error('Error parsing specs:', e);
              }
              setMachine({
                id: found.id,
                category: found.category,
                name: found.name,
                description: found.description,
                capacity: found.capacity,
                power: found.power,
                specs: parsedSpecs,
                image_url: found.image_url,
              });
              return;
            }
          }
        }
        
        // Static lookup fallback
        const staticFound = STATIC_MACHINES.find(m => m.id === id);
        if (staticFound) {
          setMachine(staticFound);
        } else {
          // If totally missing, fetch matching item from full list
          const defaultItems = [
            {
              id: 'flour-milling-1',
              category: 'milling',
              name: 'Precision Wheat Flour Milling Roller Mill',
              description: 'State-of-the-art dual and quadruple rolling mill assemblies. Ideal for manufacturing high-quality Maida, Sooji, and Atta flour.',
              capacity: '10.0 - 12.0 Tons / Hr',
              power: '37 kW High-efficiency Phase 3 Units',
              specs: { 'Feed Controller': 'Variable Speed Magnetic Feedback', 'Roll Dimensions': 'Ø 250mm x 1000mm length' },
              image_url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=600'
            },
            {
              id: 'optical-sorter-1',
              category: 'sorting',
              name: 'AeroSort Multi-Chroma Optical CCD Sorter',
              description: 'High-resolution Japanese CCD 5400-pixel camera arrays tracking defective colors, specs, and contaminants down to 0.01mm structures.',
              capacity: '4.5 - 6.0 Tons / Hr input grain',
              power: '2.5 kW Ultra efficient + Air Supply',
              specs: { 'Camera Resolution': '5400px Multi-chromatic CCD', 'Ejector Lifetime': '15 Billion cycles' },
              image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
            },
            {
              id: 'liquid-packer-1',
              category: 'packing',
              name: 'SpeedPack Linear Liquid Processing & Filler',
              description: 'Automatic volumetric liquid filling technology, perfectly calibrated for juices, mineral water, dairy, and edible oils.',
              capacity: '4000 - 6000 Bottles / Hr',
              power: '7.5 kW Intelligent Servo Drive',
              specs: { 'Nozzles': '8-Head Rotary System', 'Filling Precision': '±0.5% calibrated' },
              image_url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600'
            },
            {
              id: 'factory-auto-1',
              category: 'automation',
              name: 'Industrial PLC Plant Control Console',
              description: 'Central monitoring control console configured with high-slick SCADA boards. Integrates seamlessly with all milling assemblies on-site.',
              capacity: 'Unified Control (Max 24 lines)',
              power: '0.8 kW Panel + Telemetry sensors',
              specs: { 'Controller Core': 'Siemens S7-1500 Modular Line', 'HMI Panel': '15-inch Tempered Touch Vector Panel' },
              image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
            }
          ];
          const foundMatch = defaultItems.find(x => x.id === id);
          if (foundMatch) {
            setMachine(foundMatch);
          }
        }
      } catch (err) {
        console.error('Error loading machine page details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMachine();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] text-xs font-mono text-slate-400 gap-2">
        <Loader className="h-6 w-6 animate-spin text-amber-500" />
        <span>Syncing technical design blueprints...</span>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-600" />
        <h2 className="text-lg font-black text-slate-900 uppercase">Mechanical Blueprint Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">The machinery ID catalog lookup returned empty. It might be archived or migrated.</p>
        <Link href="/machines" className="bg-slate-900 text-white text-[10px] font-mono tracking-widest uppercase px-5 py-3 font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div>
          <Link 
            href="/machines"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Back to Machinery</span>
          </Link>
        </div>

        {/* Hero split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Big Photo Wrapper */}
          <div className="lg:col-span-6 bg-white border border-slate-200 p-3 sm:p-4 rounded-none shadow-xs">
            <div className="relative aspect-video sm:aspect-square w-full bg-slate-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={machine.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'}
                alt={machine.name}
                className="w-full h-full object-cover opacity-100 hover:scale-101 transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-slate-900 text-white text-[9px] font-mono font-black uppercase tracking-widest px-3 py-1.5">
                CLASS: {machine.category}
              </div>
            </div>
          </div>

          {/* Info Description & Metrics Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-amber-600 block">
                Technical Plant Specifications
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-950 tracking-tight uppercase leading-tight">
                {machine.name}
              </h1>
              <span className="inline-block bg-slate-100 font-mono text-[9px] text-slate-500 px-2.5 py-1 uppercase tracking-wider">
                ID: TSX-{machine.id.toUpperCase()}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans border-l-2 border-slate-900 pl-4 py-1.5">
              {machine.description}
            </p>

            {/* Direct specs list */}
            <div className="bg-white border border-slate-200 p-6 space-y-4 rounded-none">
              <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                Factory Parameters & Calibration
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1 bg-slate-50 p-3 border-l border-amber-600">
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Yield Output</span>
                  <span className="text-slate-900 font-extrabold block text-sm">{machine.capacity}</span>
                </div>

                <div className="space-y-1 bg-slate-50 p-3 border-l border-slate-900">
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Power Rating</span>
                  <span className="text-slate-900 font-extrabold block text-sm">{machine.power}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Detailed Components Mapping</span>
                <div className="border border-slate-100 divide-y divide-slate-100 text-xs font-mono">
                  {Object.entries(machine.specs || {}).map(([key, val]) => (
                    <div key={key} className="flex p-2.5 justify-between bg-slate-50/30">
                      <span className="text-slate-500 font-semibold">{key}</span>
                      <span className="text-slate-900 font-extrabold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Request Quote Call to action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setQuoteOpen(true)}
                className="bg-slate-950 text-white hover:bg-amber-600 transition-colors font-mono font-bold text-xs tracking-widest uppercase py-4 px-8 rounded-none inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Initialize Technical Quote</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-2 pl-2 text-[10px] text-slate-400 font-mono uppercase">
                <Shield className="h-4 text-amber-600 shrink-0" />
                <span>15 Years Local Support Guarantee</span>
              </div>
            </div>

          </div>

        </div>

        {/* Quality Standards framework */}
        <div className="bg-slate-900 text-white p-8 sm:p-10 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-md font-bold uppercase tracking-widest text-amber-500 font-mono">
              Operational Maintenance & On-Site Installation Standards
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-350">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-extrabold uppercase font-mono text-[11px]">
                <CheckCircle className="h-4 w-4 text-amber-500" />
                <span>72h Stress testing</span>
              </div>
              <p>Every horizontal whitening, optical sortation, and linear filling machine undergoes a rigorous 72-hour trial run inside our Kathmandu warehouses prior to packaging and dispatch.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-extrabold uppercase font-mono text-[11px]">
                <CheckCircle className="h-4 w-4 text-amber-500" />
                <span>Smart SCADA Mapping</span>
              </div>
              <p>We provide unified Modbus, Profinet, and OPC UA data registers, allowing plant management teams to monitor processing metrics dynamically on smart centralized remote screens.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-extrabold uppercase font-mono text-[11px]">
                <CheckCircle className="h-4 w-4 text-amber-500" />
                <span>Local Tinkune Support</span>
              </div>
              <p>Critical mechanical pieces, high-slick chutes, camera valves, and pneumatic assemblies remain fully stocked in Tinkune-32 Kathmandu to guarantee near-instantaneous field servicing.</p>
            </div>
          </div>
        </div>

      </div>

      <RequestQuoteModal 
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        itemName={machine.name}
        itemType="machine"
      />
    </div>
  );
}
