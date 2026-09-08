'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Building } from 'lucide-react';

interface FooterHeadquartersProps {
  initialAddress?: string;
  initialPhone?: string;
  initialEmail?: string;
  initialIndustrialCenters?: string;
}

export default function FooterHeadquarters({
  initialAddress = "Biratnagar-5, Morang",
  initialPhone = "9851218867",
  initialEmail = "contact@techsol.com.np",
  initialIndustrialCenters = "Biratnagar, Birjung and Kathmandu",
}: FooterHeadquartersProps) {
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [industrialCenters, setIndustrialCenters] = useState(initialIndustrialCenters);

  useEffect(() => {
    let isMounted = true;
    async function syncFooterConfig() {
      try {
        const res = await fetch('/api/content?scope=config');
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data) && isMounted) {
            const addr = result.data.find((c: any) => c.key === 'contact_address')?.value;
            const ph = result.data.find((c: any) => c.key === 'contact_phone')?.value;
            const em = result.data.find((c: any) => c.key === 'contact_email')?.value;
            const ind = result.data.find((c: any) => c.key === 'contact_industrial_centers')?.value;

            if (addr?.trim()) setAddress(addr.trim());
            if (ph?.trim()) setPhone(ph.trim());
            if (em?.trim()) setEmail(em.trim());
            if (ind?.trim()) setIndustrialCenters(ind.trim());
          }
        }
      } catch {
        // Retain initial values smoothly on transient network error
      }
    }

    syncFooterConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="md:col-span-5 space-y-4 font-sans text-xs">
      <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-amber-500">
        Corporate Headquarters
      </h4>
      <div className="space-y-3 font-normal text-slate-400 leading-relaxed">
        <div className="flex items-start gap-2.5">
          <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{address}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <Phone className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Direct Desk: {phone}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <Mail className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Primary Desk: <a href={`mailto:${email}`} className="hover:text-amber-500 hover:underline">{email}</a>
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <Building className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Industrial Centers: {industrialCenters}</span>
        </div>
      </div>
    </div>
  );
}
