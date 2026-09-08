'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    industry: '',
    machineInquiry: '',
    description: '',
  });

  const [hasGoogleToken, setHasGoogleToken] = useState<boolean>(false);
  const [syncSpreadsheetId, setSyncSpreadsheetId] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [contactAddress, setContactAddress] = useState<string>('Ward 14, Tinkune Corridor, Kathmandu, Nepal');
  const [contactPhone, setContactPhone] = useState<string>('+977-1-5110291, +977-9851088461');
  const [contactEmail, setContactEmail] = useState<string>('contact@techsol.com.np');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Check local storage for token first
    const token = typeof window !== 'undefined' ? localStorage.getItem('techsol_auth_token') : null;
    setHasGoogleToken(!!token);

    // Fetch live system configs from Neon DB
    async function fetchSystemConfig() {
      try {
        const res = await fetch('/api/content?scope=config');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            const sheetIdItem = result.data.find((c: any) => c.key === 'spreadsheet_id');
            const emailItem = result.data.find((c: any) => c.key === 'recipient_emails');
            const addressItem = result.data.find((c: any) => c.key === 'contact_address');
            const phoneItem = result.data.find((c: any) => c.key === 'contact_phone');
            const emailItem2 = result.data.find((c: any) => c.key === 'contact_email');
            const mapsItem = result.data.find((c: any) => c.key === 'google_maps_embed_url');

            if (sheetIdItem?.value) setSyncSpreadsheetId(sheetIdItem.value);
            if (emailItem?.value) setRecipientEmail(emailItem.value);
            if (addressItem?.value) setContactAddress(addressItem.value);
            if (phoneItem?.value) setContactPhone(phoneItem.value);
            if (emailItem2?.value) setContactEmail(emailItem2.value);
            if (mapsItem?.value) setGoogleMapsEmbedUrl(mapsItem.value);
          }
        }
      } catch (err) {
        console.error('Error fetching live contact configurations:', err);
        // Fallbacks
        const savedSpreadsheetId = typeof window !== 'undefined' ? localStorage.getItem('techsol_spreadsheet_id') : '';
        const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('techsol_recipient_email') : '';
        if (savedSpreadsheetId) setSyncSpreadsheetId(savedSpreadsheetId);
        if (savedEmail) setRecipientEmail(savedEmail);
      }
    }

    fetchSystemConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const activeToken = typeof window !== 'undefined' ? localStorage.getItem('techsol_auth_token') : null;
      
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          ...formData,
          spreadsheetId: syncSpreadsheetId,
          accessToken: activeToken,
          recipientEmail: recipientEmail || 'contact@techsol.com.np',
        }),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          address: '',
          industry: '',
          machineInquiry: '',
          description: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Submit lead error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 min-h-[500px]">
          
          {/* Left Column: Headings & System Sync Badges */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 font-mono">
                Contact Desk
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Contact us
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Connect directly with our tech support and ingredient specialists in Kathmandu. Let&apos;s discuss your custom flavor, spice seasoning, and factory consulting requirements.
              </p>
              

            </div>

            {/* Address Blocks */}
            <div className="space-y-4 pt-6 border-t border-slate-200 text-xs sm:text-sm text-slate-500 font-mono">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block pb-1">Head Office</span>
                  <span>{contactAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block pb-1">Direct Calling</span>
                  <span>{contactPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block pb-1">Official Inbox</span>
                  <span>{contactEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-10 flex flex-col justify-between rounded-none shadow-sm h-full">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono mb-6">
              Industrial Enquiry Form
            </h3>

            {submitStatus === 'success' && (
              <div id="contact-success-msg" className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 mb-6 rounded-none flex items-start gap-3 font-mono text-xs">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="space-y-1">
                  <span className="font-extrabold block uppercase tracking-wider">Lead Submitted Successfully!</span>
                  <span>Your lead details are synced with our representative team and saved in Techsol PostgreSQL database. A dedicated layout engineer will connect with you.</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div id="contact-error-msg" className="bg-rose-50 border border-rose-200 text-rose-800 p-4 mb-6 rounded-none flex items-start gap-3 font-mono text-xs">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                <div className="space-y-1">
                  <span className="font-extrabold block uppercase tracking-wider">Submission Error</span>
                  <span>We were unable to route this lead inquiry. Please check the network connectivity or write to contact@techsol.com.np.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="contact-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Representative Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Binayak Adhikari"
                    className="w-full border border-slate-200 focus:border-amber-600 transition-colors px-4 py-3 leading-tight placeholder-slate-300 text-xs sm:text-sm rounded-none outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Phone Number (Nepal) *
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +977-9851000000"
                    className="w-full border border-slate-200 focus:border-amber-600 transition-colors px-4 py-3 leading-tight placeholder-slate-300 text-xs sm:text-sm rounded-none outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Address and Site Location */}
              <div className="space-y-1">
                <label htmlFor="contact-address" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Site or Office Address *
                </label>
                <input
                  id="contact-address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Industrial District, Bhairahawa, Nepal"
                  className="w-full border border-slate-200 focus:border-amber-600 transition-colors px-4 py-3 leading-tight placeholder-slate-300 text-xs sm:text-sm rounded-none outline-none"
                />
              </div>

              {/* Row 3: Industry & Machine Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="contact-industry" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Industry Domain / Sector
                  </label>
                  <select
                    id="contact-industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-amber-600 bg-white transition-colors px-4 py-3.5 leading-tight text-xs sm:text-sm rounded-none outline-none"
                  >
                    <option value="">-- Select Industry sector --</option>
                    <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dairy & Ice Cream">Dairy & Ice Cream</option>
                    <option value="Snacks & Namkeen">Snacks & Namkeen</option>
                    <option value="Instant & Processed Foods">Instant & Processed Foods</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-machine" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Hardware Inquired
                  </label>
                  <select
                    id="contact-machine"
                    name="machineInquiry"
                    value={formData.machineInquiry}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-amber-600 bg-white transition-colors px-4 py-3.5 leading-tight text-xs sm:text-sm rounded-none outline-none"
                  >
                    <option value="">-- Select Solution Category --</option>
                    <option value="Food Flavours (Powder)">Food Flavours (Powder)</option>
                    <option value="Liquid Flavours">Liquid Flavours</option>
                    <option value="Natural Flavours">Natural & Clean Label Flavours</option>
                    <option value="Spice Blends & Seasonings">Spice Blends & Seasonings</option>
                    <option value="Functional Food Ingredients">Functional Food Ingredients</option>
                    <option value="Bakery Ingredients">Bakery Ingredients</option>
                    <option value="Flavour Consultation">Flavour Consultation & Product Development</option>
                    <option value="Machine Consulting">Machine Consulting Services</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Enquiry specifications */}
              <div className="space-y-1">
                <label htmlFor="contact-description" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Factory Requirements & Capacity (TPH)
                </label>
                <textarea
                  id="contact-description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Please supply quotation for 500 lbs of Liquid Mango Flavour and Custom Spice season blends formulation for noodle snacks processing line."
                  className="w-full border border-slate-200 focus:border-amber-600 transition-colors px-4 py-3 leading-relaxed placeholder-slate-300 text-xs sm:text-sm rounded-none outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                id="contact-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white hover:bg-amber-600 transition-colors py-3.5 sm:py-4 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 rounded-none disabled:opacity-50 mt-4 cursor-pointer align-middle"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin text-white" />
                    <span>Routing Lead Enquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Full-Width Google Map Integration */}
        <div className="mt-16 border border-slate-200 bg-white p-2 shadow-sm rounded-none">
          <div className="border border-slate-100 h-[430px] w-full relative overflow-hidden bg-slate-50">
            <iframe
              src={googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.0298918239404!2d85.34185207604473!3d27.68547247619472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1d1110.0!2d85.3442!3d27.6853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199268fbf33d%3A0xc3fec86c4765d7!2sKoteshwor%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1718049183424!5m2!1sen!2snp"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              title="Techsol International Office Location Map"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
