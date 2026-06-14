'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, Loader } from 'lucide-react';

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: 'machine' | 'product' | 'service';
}

export default function RequestQuoteModal({ isOpen, onClose, itemName, itemType }: RequestQuoteModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      // Load optional local Google Sheet access token and spreadsheet settings if configured
      let spreadsheetId = '';
      let accessToken = '';
      let recipientEmail = '';
      try {
        const adminConfigRes = await fetch('/api/content?scope=config');
        if (adminConfigRes.ok) {
          const configJson = await adminConfigRes.json();
          if (configJson.success && configJson.data) {
            const sIdObj = configJson.data.find((c: any) => c.key === 'spreadsheet_id');
            const rEmailObj = configJson.data.find((c: any) => c.key === 'recipient_emails');
            if (sIdObj) spreadsheetId = sIdObj.value;
            if (rEmailObj) recipientEmail = rEmailObj.value;
          }
        }
      } catch (e) {
        console.warn('Failed to prefetch admin config:', e);
      }

      // Check if user has oauth state
      if (typeof window !== 'undefined') {
        accessToken = localStorage.getItem('google_oauth_token') || '';
      }

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: itemType === 'service' ? 'contact' : 'product',
          name,
          phone,
          address,
          industry: industry || 'Manufacturing',
          machineInquiry: `${itemName} (${itemType.toUpperCase()})`,
          description: description || `Inquiry submitted for ${itemName}.`,
          spreadsheetId,
          accessToken,
          recipientEmail,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || 'Server rejected lead details.');
        }
      } else {
        setError('Network gateway error during submission.');
      }
    } catch (err: any) {
      console.error('Error submitting quotation request:', err);
      setError('System failure, please retry again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="relative bg-white border border-slate-950 shadow-2xl max-w-lg w-full z-10 overflow-hidden rounded-none p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-600 block">
              Quotation Request Station
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
              Request Quotation
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2 border border-slate-200 hover:border-slate-800 text-slate-500 hover:text-slate-950 transition-colors"
            type="button"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-none mb-1">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-md font-bold uppercase text-slate-900 tracking-tight">
              Enquiry Submitted Successfully
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We have dispatched your quotation request for <span className="font-semibold text-slate-950">{itemName}</span> to Techsol’s plant designers. We will respond with customized mechanical and volumetric blueprints within 12 working hours.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  onClose();
                  setSuccess(false);
                  setName('');
                  setPhone('');
                  setAddress('');
                  setIndustry('');
                  setDescription('');
                }}
                className="w-full bg-slate-950 hover:bg-amber-600 text-white text-[10px] font-mono uppercase tracking-widest font-bold py-3 transition-colors"
                type="button"
              >
                Return Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            
            <div className="bg-slate-50 p-3.5 border-l-2 border-amber-500 mb-2">
              <span className="font-mono text-[10px] text-slate-400 uppercase block">Selected Asset</span>
              <span className="font-sans font-bold text-slate-950 uppercase text-sm block">
                {itemName}
              </span>
              <span className="text-[10px] text-amber-600 font-mono capitalize block mt-0.5">
                Category: B2B {itemType}
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 border-l border-red-500 text-[11px] font-mono rounded-none">
                {error}
              </div>
            )}

            <div className="space-y-1.5Packed">
              <label className="font-mono uppercase font-bold text-slate-600 block">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Er. Sunil Shrestha"
                className="w-full p-2.5 border border-slate-200 focus:border-slate-950 outline-none rounded-none text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono uppercase font-bold text-slate-600 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +977-98510-----"
                  className="w-full p-2.5 border border-slate-200 focus:border-slate-950 outline-none rounded-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono uppercase font-bold text-slate-600 block">
                  Office/Site Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Biratnagar corridor"
                  className="w-full p-2.5 border border-slate-200 focus:border-slate-950 outline-none rounded-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono uppercase font-bold text-slate-600 block">
                Target Industry or Sector
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Grain Milling, Beverages, Biscuits & Bakery"
                className="w-full p-2.5 border border-slate-200 focus:border-slate-950 outline-none rounded-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono uppercase font-bold text-slate-600 block">
                Describe Capacity requirements / Customizations
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g., Processing 10 TPH wheat, customized color ejectors with automatic pneumatic air-clamping loops..."
                className="w-full p-2.5 border border-slate-200 focus:border-slate-950 outline-none rounded-none text-xs resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-950 hover:bg-amber-600 text-white font-mono uppercase tracking-widest font-bold py-3.5 px-4 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader className="h-4.5 w-4.5 animate-spin text-white" />
                    <span>Transmitting lead sheet...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Technical Inward Quote</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
