'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, Factory, Zap, Settings, ArrowUpRight, Loader, Eye } from 'lucide-react';
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
  },
  {
    id: 'flour-milling-1',
    category: 'milling',
    name: 'Precision Wheat Flour Milling Roller Mill',
    description: 'State-of-the-art dual and quadruple rolling mill assemblies. Ideal for manufacturing high-quality Maida, Sooji, and Atta flour.',
    capacity: '10.0 - 12.0 Tons / Hr',
    power: '37 kW High-efficiency Phase 3 Units',
    specs: {
      'Feed Controller': 'Variable Speed Magnetic Feedback',
      'Roll Dimensions': 'Ø 250mm x 1000mm length',
      'Adjustment Method': 'Pneumatic Roller Clamping',
    },
    image_url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'optical-sorter-1',
    category: 'sorting',
    name: 'AeroSort Multi-Chroma Optical CCD Sorter',
    description: 'High-resolution Japanese CCD 5400-pixel camera arrays tracking defective colors, specs, and contaminants down to 0.01mm structures.',
    capacity: '4.5 - 6.0 Tons / Hr input grain',
    power: '2.5 kW Ultra efficient + Air Supply',
    specs: {
      'Camera Resolution': '5400px Multi-chromatic CCD',
      'Ejector Lifetime': '15 Billion cycles response logic',
      'Chute Layout': '64 channels high-slick modular',
    },
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'liquid-packer-1',
    category: 'packing',
    name: 'SpeedPack Linear Liquid Processing & Filler',
    description: 'Automatic volumetric liquid filling technology, perfectly calibrated for juices, mineral water, dairy, and edible oils.',
    capacity: '4000 - 6000 Bottles / Hr',
    power: '7.5 kW Intelligent Servo Drive',
    specs: {
      'Nozzles': '8-Head Rotary System',
      'Filling Precision': '±0.5% calibrated',
      'Container Range': '200ml to 2000ml PET',
    },
    image_url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'factory-auto-1',
    category: 'automation',
    name: 'Industrial PLC Plant Control Console',
    description: 'Bespoke central monitoring control console configured with high-slick SCADA boards. Integrates seamlessly with all milling assemblies on-site.',
    capacity: 'Unified Control (Max 24 lines)',
    power: '0.8 kW Panel + Telemetry sensors',
    specs: {
      'Controller Core': 'Siemens S7-1500 Modular Line',
      'HMI Panel': '15-inch Tempered Touch Vector Panel',
      'Data Integration': 'Modbus, Profinet, and OPC UA supported',
    },
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
  }
];

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'milling' | 'sorting' | 'packing' | 'automation'>('all');
  const [loading, setLoading] = useState(true);

  // Quote modal state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');

  useEffect(() => {
    async function loadMachines() {
      try {
        const res = await fetch('/api/content?scope=products');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data.length > 0) {
            const mapped: Machine[] = result.data.map((p: any) => {
              let parsedSpecs = {};
              try {
                parsedSpecs = typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs || {};
              } catch (e) {
                console.error('Error parsing product specs:', e);
              }
              return {
                id: p.id,
                category: p.category,
                name: p.name,
                description: p.description,
                capacity: p.capacity,
                power: p.power,
                specs: parsedSpecs,
                image_url: p.image_url,
              };
            });
            setMachines(mapped);
          } else {
            setMachines(STATIC_MACHINES);
          }
        } else {
          setMachines(STATIC_MACHINES);
        }
      } catch (err) {
        console.error('Error loading dynamic machines:', err);
        setMachines(STATIC_MACHINES);
      } finally {
        setLoading(false);
      }
    }
    loadMachines();
  }, []);

  const filteredMachines = activeCategory === 'all' 
    ? machines 
    : machines.filter(m => m.category === activeCategory);

  const handleRequestQuote = (name: string) => {
    setSelectedItemName(name);
    setQuoteOpen(true);
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono">
            Machinery & Equipment Catalog (Nepal)
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Heavy-Duty Industrial Machines
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Sourced and engineered to optimize raw grain throughputs, maximize miller yields, and introduce complete automation to agro-production corridors.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {(['all', 'milling', 'sorting', 'packing', 'automation'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none transition-all duration-150 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white font-extrabold shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Machine Class' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 py-12">
            <Loader className="h-4 w-4 animate-spin text-amber-600" />
            <span>Syncing heavy machinery telemetry lines...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredMachines.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:border-slate-800 transition-colors duration-200 group rounded-none shadow-xs"
              >
                <div className="space-y-6">
                  {/* Photo Thumbnail Wrapper */}
                  <div className="h-[240px] w-full relative bg-slate-100 overflow-hidden border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'}
                      alt={m.name}
                      className="w-full h-full object-cover opacity-100 group-hover:scale-102 transition-all duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono text-[9px] font-black px-2.5 py-1 uppercase tracking-widest leading-none">
                      {m.category}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                      {m.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed min-h-[40px]">
                      {m.description}
                    </p>
                  </div>

                  {/* Tech specs */}
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Engineering Calibration metrics
                    </span>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-1 font-mono">
                      <div className="text-slate-400">Yield Capacity:</div>
                      <div className="text-slate-800 font-bold text-right">{m.capacity}</div>
                      
                      <div className="text-slate-400">Power Rating:</div>
                      <div className="text-slate-800 font-bold text-right">{m.power}</div>
                      
                      {m.specs && Object.entries(m.specs).map(([label, val]) => (
                        <React.Fragment key={label}>
                          <div className="text-slate-400">{label}:</div>
                          <div className="text-slate-800 font-semibold text-right">{val}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleRequestQuote(m.name)}
                    className="bg-slate-900 text-white hover:bg-amber-600 transition-colors font-mono font-bold text-[10px] tracking-widest uppercase px-5 py-3 rounded-none inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Request Quotation</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <Link 
                    href={`/machines/${m.id}`}
                    className="border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-mono text-[10px] tracking-widest uppercase px-4 py-3 rounded-none inline-flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Detail</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <RequestQuoteModal 
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        itemName={selectedItemName}
        itemType="machine"
      />
    </div>
  );
}
