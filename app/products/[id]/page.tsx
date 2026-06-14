'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Loader, Shield, Sliders, Leaf, AlertTriangle } from 'lucide-react';
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
  }
];

export default function SingleProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<B2BProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const id = params.id as string;
        const res = await fetch('/api/content?scope=b2b_products');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data.length > 0) {
            const found = result.data.find((p: any) => p.id === id);
            if (found) {
              setProduct(found);
              return;
            }
          }
        }
        
        // Static Lookup Fallback
        const staticList = [
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
        const foundMatch = staticList.find(x => x.id === id);
        if (foundMatch) {
          setProduct(foundMatch);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] text-xs font-mono text-slate-400 gap-2">
        <Loader className="h-6 w-6 animate-spin text-amber-505" />
        <span>Syncing food science data catalogs...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
        <h2 className="text-lg font-black text-slate-900 uppercase">Product Composition Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">The product ID lookup returned empty. It could be due to category realignment.</p>
        <Link href="/products" className="bg-slate-900 text-white text-[10px] font-mono tracking-widest uppercase px-5 py-3 font-bold">
          Return to Ingredients
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <div>
          <Link 
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Back to Ingredients</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel Image card */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-4 rounded-none shadow-xs">
            <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'}
                alt={product.name}
                className="w-full h-full object-cover opacity-100 transition-opacity duration-300 animate-fade-in"
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono text-[8.5px] font-bold px-2.5 py-1.5 uppercase tracking-widest">
                CATEGORY: {product.category}
              </div>
            </div>
          </div>

          {/* Right panel composition details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-600 block">
                F&B Industrial Compounding Specification
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">
                {product.name}
              </h1>
              <span className="inline-block border border-slate-200 bg-white font-mono text-[9px] text-slate-500 px-2 py-1 uppercase tracking-wider">
                CAS: TS-ING-{product.id.toUpperCase()}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans first-letter:text-3xl first-letter:font-black first-letter:text-amber-600 first-letter:mr-2 first-letter:float-left">
              {product.description}
            </p>

            {/* Industrial standard parameters list */}
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                Compound Specifications & Mixing Instructions
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="bg-amber-50/50 p-4 border-l-2 border-amber-500 rounded-none relative">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block mb-1">Standard Processing Dosage</span>
                  <span className="text-slate-900 font-extrabold block text-sm">{product.application}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Thermostability</span>
                    <span className="text-slate-800 font-bold">Stable up to 210°C</span>
                  </div>

                  <div className="p-3 bg-slate-50">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Solubility</span>
                    <span className="text-slate-800 font-bold">Fat / Water Dispersible</span>
                  </div>

                  <div className="p-3 bg-slate-50">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Storage Guidelines</span>
                    <span className="text-slate-800 font-bold">Below 25°C, Dry environment</span>
                  </div>

                  <div className="p-3 bg-slate-50">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Shelf Life Limit</span>
                    <span className="text-slate-800 font-bold">24 Months dynamic shelf</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote and Call to actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setQuoteOpen(true)}
                className="bg-slate-950 text-white hover:bg-amber-600 transition-colors font-mono font-bold text-xs tracking-widest uppercase py-4 px-8 rounded-none inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request B2B Sample Kit</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 pr-2 text-[10px] text-slate-400 font-mono uppercase">
                <Leaf className="h-4 text-emerald-600 shrink-0" />
                <span>100% Food-Grade Certified (Nepal Food Authority Approved)</span>
              </div>
            </div>

          </div>

        </div>

        {/* Regulatory & Safety standard container */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Safety, Regulatory, and Quality Control standards
            </h4>
          </div>
          <p className="text-xs text-slate-350 leading-relaxed max-w-4xl">
            All flavor compounds and spices supplied by Techsol International are manufactured in ISO 22000 & HACCP certified clean factories. Raw materials are verified for residue and pesticide metrics prior to compound formulation, ensuring complete health safety compliance for export and domestic consumption.
          </p>
        </div>

      </div>

      <RequestQuoteModal 
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        itemName={product.name}
        itemType="product"
      />
    </div>
  );
}
