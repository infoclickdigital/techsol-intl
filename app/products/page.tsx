'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, ArrowUpRight, Loader, Eye, Award, Sliders } from 'lucide-react';
import RequestQuoteModal from '@/components/RequestQuoteModal';

interface B2BProduct {
  id: string;
  category: string;
  name: string;
  description: string;
  application: string;
  image_url?: string;
}

const STATIC_B2B_PRODUCTS: B2BProduct[] = [
  {
    id: 'spices-1',
    category: 'spices',
    name: 'Compounded Seasoning Spices Mix',
    description: 'Custom-formulated savory seasoning powders. Perfect for instant noodles, potato chips, kurkure, and processed snack food coatings.',
    application: 'Recommended usage: 5% - 8% by weight on fried snacks.',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'chocolate-1',
    category: 'confectionery',
    name: 'Double Dark Chocolate Flavouring',
    description: 'Baking-stable dark chocolate flavor compounding. Formulated with carrier compounds that withstand intense tunnel oven temperatures.',
    application: 'Recommended dosage: 0.10% to 0.15% in biscuit dough mixes.',
    image_url: 'https://images.unsplash.com/photo-1548907040-4d42b521251c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'butter-1',
    category: 'bakery',
    name: 'Premium Creamy Butter Flavouring',
    description: 'Excellent creamy sweet-dairy profiling that gives an authentic baked butter aroma to cookies, shortbreads, and pastries.',
    application: 'Recommended usage: 0.08% - 0.12% in flour fat-batter.',
    image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'strawberry-1',
    category: 'confectionery',
    name: 'Strawberry Candy Flavour Essence',
    description: 'High-intensity, sweet and fruity strawberry compound. Perfectly water-soluble and stable under high-heat confectionery boiling.',
    application: 'Recommended usage: 0.10% in hard-boiled sugars & jellies.',
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'whiskey-1',
    category: 'beverages',
    name: 'Oak-Matured Whiskey Flavour Compounding',
    description: 'Smoky peat and sweet wood-cask aroma essence for blending in local liquor assemblies & beverage production industries.',
    application: 'Recommended dosage: 0.05% - 0.10% in final whiskey blends.',
    image_url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=600'
  }
];

export default function ProductsPage() {
  const [b2bProducts, setB2bProducts] = useState<B2BProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'spices' | 'bakery' | 'confectionery' | 'beverages'>('all');
  const [loading, setLoading] = useState(true);

  // Quote modal state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');

  useEffect(() => {
    async function loadB2BProducts() {
      try {
        const res = await fetch('/api/content?scope=b2b_products');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data.length > 0) {
            setB2bProducts(result.data);
          } else {
            setB2bProducts(STATIC_B2B_PRODUCTS);
          }
        } else {
          setB2bProducts(STATIC_B2B_PRODUCTS);
        }
      } catch (err) {
        console.error('Error loading dynamic B2B products:', err);
        setB2bProducts(STATIC_B2B_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    loadB2BProducts();
  }, []);

  const filteredB2B = activeCategory === 'all'
    ? b2bProducts
    : b2bProducts.filter(p => p.category === activeCategory);

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
            B2B Commercial Ingredients & Flavors catalog
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Spices, Flavors & Seasonings
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Tailor-engineered industrial food chemistry, custom flavorings, taste-profile compounding, and highly concentrated seasoning compounds for Nepal’s leading F&B brands.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {(['all', 'spices', 'bakery', 'confectionery', 'beverages'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none transition-all duration-150 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white font-extrabold shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Ingredient Lines' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 py-12">
            <Loader className="h-4 w-4 animate-spin text-amber-600" />
            <span>Syncing B2B product specifications sheets...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredB2B.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-800 transition-colors duration-200 group rounded-none shadow-xs"
              >
                <div className="space-y-5">
                  {/* Photo Wrapper */}
                  <div className="h-[200px] w-full relative bg-slate-100 overflow-hidden border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'}
                      alt={p.name}
                      className="w-full h-full object-cover opacity-100 group-hover:scale-102 transition-all duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono text-[9px] font-black px-2.5 py-1 uppercase tracking-widest leading-none">
                      {p.category}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors uppercase">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[60px]">
                      {p.description}
                    </p>
                  </div>

                  {/* Application Information */}
                  <div className="bg-slate-50 p-3 border-l border-amber-600 font-mono text-[11px] space-y-1">
                    <span className="text-[9px] text-slate-400 font-black uppercase block">Industrial Application</span>
                    <span className="text-slate-800 font-semibold block">{p.application}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleRequestQuote(p.name)}
                    className="bg-slate-900 text-white hover:bg-amber-600 transition-colors font-mono font-bold text-[9px] tracking-widest uppercase px-4 py-2.5 rounded-none inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Sample</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <Link 
                    href={`/products/${p.id}`}
                    className="border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-mono text-[9px] tracking-widest uppercase px-3.5 py-2.5 rounded-none inline-flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5 animate-pulse" />
                    <span>Details</span>
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
        itemType="product"
      />
    </div>
  );
}
