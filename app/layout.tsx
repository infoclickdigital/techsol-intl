import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import React from "react";
import Logo from "@/components/Logo";
import Chatbot from "@/components/Chatbot";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import FooterHeadquarters from "@/components/FooterHeadquarters";
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin, Building, Globe, Shield } from "lucide-react";
import sql from "@/lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techsol.com.np"),
  title: "Techsol International | Industrial Food Processing Machinery & Automation",
  description: "Nepal's premium industrial partner for Smart CCD Optical Sorters, Turnkey Mills, Liquid Processing, and SCADA Automation consoles. Optimized with global ISO grade mechanics.",
  keywords: [
    "Color Sorter Nepal", 
    "Rice Mill Machine Biratnagar", 
    "Wheat Miller Kathmandu", 
    "Liquid Packager Nepal", 
    "SCADA automation Terai", 
    "Techsol International Nepal",
    "Food Flavours Nepal",
    "Spice Seasoning Kathmandu"
  ],
  alternates: {
    canonical: "https://techsol.com.np",
  },
  openGraph: {
    title: "Techsol International | Industrial Food Processing Machinery & Automation",
    description: "Nepal's premium industrial partner for Smart CCD Optical Sorters, Turnkey Mills, Liquid Processing, and SCADA Automation consoles. Optimized with global ISO grade mechanics.",
    url: "https://techsol.com.np",
    siteName: "Techsol International",
    images: [
      {
        url: "/icon.jpg",
        width: 512,
        height: 512,
        alt: "Techsol International Brand Icon",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Techsol International | Industrial Food Processing Machinery & Automation",
    description: "Nepal's premium industrial partner for Smart CCD Optical Sorters, Turnkey Mills, Liquid Processing, and SCADA Automation consoles. Optimized with global ISO grade mechanics.",
    images: ["/icon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const revalidate = 60;

// Server-side in-memory cache for layout configurations to maximize performance
let serverCachedConfigs: Record<string, string> | null = null;
let serverLastFetched = 0;
const SERVER_CACHE_TTL = 300000; // 5 minutes in milliseconds

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let facebook = "https://facebook.com/techsol.international";
  let instagram = "https://instagram.com/techsol.international";
  let linkedin = "https://linkedin.com/company/techsol-international";
  let address = "Biratnagar-5, Morang";
  let phone = "9851218867";
  let email = "contact@techsol.com.np";
  let industrialCenters = "Biratnagar, Birjung and Kathmandu";

  const now = Date.now();
  if (serverCachedConfigs && (now - serverLastFetched < SERVER_CACHE_TTL)) {
    facebook = serverCachedConfigs.facebook || facebook;
    instagram = serverCachedConfigs.instagram || instagram;
    linkedin = serverCachedConfigs.linkedin || linkedin;
    address = serverCachedConfigs.address || address;
    phone = serverCachedConfigs.phone || phone;
    email = serverCachedConfigs.email || email;
    industrialCenters = serverCachedConfigs.industrialCenters || industrialCenters;
  } else if (process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.NODE_ENV === 'development') {
    try {
      const fetchPromise = sql`SELECT key, value FROM techsol_config`;
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout connecting to database')), 4000)
      );

      const configs = await Promise.race([fetchPromise, timeoutPromise]);
      if (configs && Array.isArray(configs)) {
        const mapped: Record<string, string> = {};
        configs.forEach((item: { key: string; value: string }) => {
          if (item.key === 'social_facebook' && item.value?.trim()) facebook = mapped.facebook = item.value.trim();
          if (item.key === 'social_instagram' && item.value?.trim()) instagram = mapped.instagram = item.value.trim();
          if (item.key === 'social_linkedin' && item.value?.trim()) linkedin = mapped.linkedin = item.value.trim();
          if (item.key === 'contact_address' && item.value?.trim()) address = mapped.address = item.value.trim();
          if (item.key === 'contact_phone' && item.value?.trim()) phone = mapped.phone = item.value.trim();
          if (item.key === 'contact_email' && item.value?.trim()) email = mapped.email = item.value.trim();
          if (item.key === 'contact_industrial_centers' && item.value?.trim()) industrialCenters = mapped.industrialCenters = item.value.trim();
        });
        serverCachedConfigs = mapped;
        serverLastFetched = now;
      }
    } catch (err) {
      console.warn("DB config fetch fallback inside layout:", err instanceof Error ? err.message : err);
    }
  }

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} overflow-x-clip w-full`}>
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-white overflow-x-clip w-full">
        
        {/* Responsive Navigation Navbar */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 bg-slate-50 flex flex-col justify-start">
          {children}
        </main>

        {/* Full-site Floating AI Support Agent */}
        <Chatbot />

        {/* Scroll To Top button */}
        <ScrollToTop />

        {/* Corporate Footer with Social icons, Quick links and contact details */}
        <footer className="bg-slate-950 text-slate-350 py-12 px-4 sm:px-8 border-t border-slate-900 select-text">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 text-sm">
            
            {/* Info Col (4 Cols) */}
            <div className="md:col-span-4 space-y-5">
              <Logo size="lg" className="brightness-110 contrast-115 grayscale-0 invert-0" />
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
                Nepal’s preferred gateway for advanced optical photoelectric sortation plants, high-yield grain processing mills, liquid packaging, and central PLC logic orchestration. Fully integrated engineering workflows.
              </p>
              
              {/* Social Media icons */}
              <div className="flex items-center gap-3.5 pt-2">
                <a 
                  href={facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-slate-900 hover:bg-amber-600 text-slate-400 hover:text-white transition-all rounded"
                  id="footer-social-fb"
                  aria-label="Facebook Link"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-slate-900 hover:bg-amber-600 text-slate-400 hover:text-white transition-all rounded"
                  id="footer-social-ig"
                  aria-label="Instagram Link"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a 
                  href={linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-slate-900 hover:bg-amber-600 text-slate-400 hover:text-white transition-all rounded"
                  id="footer-social-ln"
                  aria-label="LinkedIn Link"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links (4 Cols) */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-amber-500">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/" className="hover:text-amber-500 hover:underline transition-all block">
                    &raquo; Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-amber-500 hover:underline transition-all block">
                    &raquo; Corporate Structure (About)
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-amber-500 hover:underline transition-all block">
                    &raquo; Engineering Services
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-amber-500 hover:underline transition-all block">
                    &raquo; Industrial Machinery Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-amber-500 hover:underline transition-all block">
                    &raquo; Tech Articles & Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-amber-500 hover:underline transition-all block">
                    &raquo; Contact Headquarters
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacts Col (5 Cols) with Server + Client Live Auto-Sync */}
            <FooterHeadquarters 
              initialAddress={address}
              initialPhone={phone}
              initialEmail={email}
              initialIndustrialCenters={industrialCenters}
            />

          </div>

          <div className="max-w-7xl mx-auto border-t border-slate-900 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; 2026 Techsol International, Nepal. All rights registered reserved.
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
