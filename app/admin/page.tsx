'use client';

import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  LogOut, 
  Table, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  FileSpreadsheet, 
  Loader, 
  Settings, 
  Cpu, 
  Factory, 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  BookOpen, 
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Search,
  Sliders,
  ChevronRight,
  Database,
  Quote,
  Users
} from 'lucide-react';
import { googleSignIn, googleSignOut, subscribeToAuth, UserProfile } from '@/lib/firebase-client';

interface Lead {
  id: string;
  type: 'product' | 'contact' | 'chat';
  client_name: string;
  client_phone: string;
  client_address: string;
  industry: string;
  inquiry_type_or_model: string;
  description: string;
  session_chat_history: string;
  created_at: string;
}

interface CmsItem {
  key: string;
  value: string;
}

interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  capacity: string;
  power: string;
  specs: any;
  image_url: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  details: string;
  image_url: string;
}

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  read_time: string;
  image_url: string;
}

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  quote: string;
  image_url: string;
}

export default function AdminPage() {
  // --- CREDENTIAL GATE STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [sessionToken, setSessionToken] = useState('');

  // --- OAUTH / GOOGLE STATES ---
  const [googleUser, setGoogleUser] = useState<UserProfile | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  // --- LIVE DATA STATES ---
  const [cms, setCms] = useState<CmsItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [b2bProducts, setB2bProducts] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [enquiries, setEnquiries] = useState<Lead[]>([]);
  
  // System presets mapped from Postgres
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [recipientEmails, setRecipientEmails] = useState('contact@techsol.com.np');

  // Sidebar TABS
  // Options: 'enquiries', 'cms_pages', 'cms_products', 'cms_b2b_products', 'cms_team', 'cms_services', 'cms_blogs', 'testimonials', 'settings'
  const [activeSidebarTab, setActiveSidebarTab] = useState<'enquiries' | 'cms_pages' | 'cms_products' | 'cms_b2b_products' | 'cms_team' | 'cms_services' | 'cms_blogs' | 'testimonials' | 'settings'>('enquiries');
  
  // Enquiry Category Filters
  const [activeEnquiryFilter, setActiveEnquiryFilter] = useState<'product' | 'contact' | 'chat'>('product');

  // Loaders & feedback
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Add / Edit form controllers
  const [editingItemType, setEditingItemType] = useState<'product' | 'b2b_product' | 'team_member' | 'service' | 'blog' | 'testimonial' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); // null means adding new

  const [productForm, setProductForm] = useState({
    id: '', category: 'milling', name: '', description: '', capacity: '', power: '', image_url: '', specs: ''
  });
  const [b2bProductForm, setB2bProductForm] = useState({
    id: '', category: 'spices', name: '', description: '', application: '', image_url: ''
  });
  const [teamForm, setTeamForm] = useState({
    id: '', name: '', position: '', image_url: ''
  });
  const [serviceForm, setServiceForm] = useState({
    id: '', title: '', description: '', details: '', icon_name: 'Settings', image_url: ''
  });
  const [blogForm, setBlogForm] = useState({
    id: '', title: '', excerpt: '', content: '', category: 'Technology', date: '', author: '', read_time: '5 min read', image_url: ''
  });
  const [testimonialForm, setTestimonialForm] = useState({
    id: '', name: '', designation: '', company: '', quote: '', image_url: ''
  });

  // Flat CMS mapper
  const [cmsFormMapping, setCmsFormMapping] = useState<Record<string, string>>({});

  // Auth gate check
  useEffect(() => {
    const savedToken = localStorage.getItem('techsol_admin_session_pwd');
    if (savedToken) {
      setIsAuthenticated(true);
      setSessionToken(savedToken);
      fetchCompleteDashboardData(savedToken);
    } else {
      setIsLoading(false);
    }

    const unsubscribeAuth = subscribeToAuth((u, token) => {
      setGoogleUser(u);
      setGoogleToken(token);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setSessionToken(data.token);
        localStorage.setItem('techsol_admin_session_pwd', data.token);
        fetchCompleteDashboardData(data.token);
      } else {
        setLoginError(true);
      }
    } catch (err) {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('techsol_admin_session_pwd');
    setIsAuthenticated(false);
    setPasswordInput('');
    setUsernameInput('');
    setSessionToken('');
  };

  // Synchronize Postgres state variables
  const fetchCompleteDashboardData = async (tokenVal: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const payload = await res.json();
        if (payload.success) {
          setCms(payload.cms || []);
          setProducts(payload.products || []);
          setB2bProducts(payload.b2b_products || []);
          setTeamMembers(payload.team || []);
          setServices(payload.services || []);
          setBlogs(payload.blogs || []);
          setTestimonials(payload.testimonials || []);
          setEnquiries(payload.enquiries || []);

          // Prepare copytexts helper object
          const cmsDict: Record<string, string> = {
            // Default mappings to handle unpopulated db entries on newly provisioned regions
            home_hero_title: '',
            home_hero_subtitle: '',
            home_hero_description: '',
            home_spice_tech_badge: '',
            home_spice_tech_title: '',
            home_spice_tech_description: '',
            home_about_badge: '',
            home_about_title: '',
            home_about_description: '',
            home_about_image_url: '',
            about_hero_title: '',
            about_hero_subtitle: '',
            about_story: '',
            about_mission: '',
            about_vision: '',
          };
          payload.cms.forEach((item: CmsItem) => {
            cmsDict[item.key] = item.value;
          });
          setCmsFormMapping(cmsDict);

          // Prepare configurations
          payload.config.forEach((item: CmsItem) => {
            if (item.key === 'spreadsheet_id') setSpreadsheetId(item.value);
            if (item.key === 'recipient_emails') setRecipientEmails(item.value);
          });
        }
      }
    } catch (err) {
      console.error('Error fetching admin dashboard content state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTelemetry = async () => {
    setIsRefreshing(true);
    await fetchCompleteDashboardData(sessionToken);
    setTimeout(() => setIsRefreshing(false), 350);
  };

  // CMS dynamic copytext submitter
  const saveCmsChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const formattedItems = Object.entries(cmsFormMapping).map(([key, value]) => ({ key, value }));
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_cms',
          token: sessionToken,
          payload: { items: formattedItems }
        })
      });

      if (res.ok) {
        setSaveStatus('success');
        setStatusMessage('Copytexts persisted securely into Neon PostgreSQL!');
        fetchCompleteDashboardData(sessionToken);
      } else {
        setSaveStatus('error');
        setStatusMessage('Endpoint authentication failed.');
      }
    } catch (err: any) {
      setSaveStatus('error');
      setStatusMessage(err.message || 'Transaction rejected.');
    } finally {
      setIsSaving(false);
    }
  };

  // System config submitter
  const saveSettingsChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const settingsItems = [
        { key: 'spreadsheet_id', value: spreadsheetId.trim() },
        { key: 'recipient_emails', value: recipientEmails.trim() },
      ];

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_config',
          token: sessionToken,
          payload: { items: settingsItems }
        })
      });

      if (res.ok) {
        setSaveStatus('success');
        setStatusMessage('Central system integrations config saved directly to Postgres!');
      } else {
        setSaveStatus('error');
        setStatusMessage('Request declined.');
      }
    } catch (err: any) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // --- CRUD ACTIONS FOR PRODUCTS ---
  const triggerUpsertProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let specsObj = {};
      try {
        specsObj = productForm.specs ? JSON.parse(productForm.specs) : {};
      } catch (e) {
        alert('Specifications must be in raw valid JSON format! e.g. {"Yield Speed": "50 Hz", "Chassis": "Heavy Mild Steel"}');
        setIsSaving(false);
        return;
      }

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert_product',
          token: sessionToken,
          payload: {
            id: productForm.id.trim(),
            category: productForm.category,
            name: productForm.name.trim(),
            description: productForm.description.trim(),
            capacity: productForm.capacity.trim(),
            power: productForm.power.trim(),
            specs: specsObj,
            image_url: productForm.image_url.trim()
          }
        })
      });

      if (res.ok) {
        setEditingItemType(null);
        fetchCompleteDashboardData(sessionToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this machinery asset catalog item?')) return;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_product',
          token: sessionToken,
          payload: { id }
        })
      });
      if (res.ok) fetchCompleteDashboardData(sessionToken);
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD ACTIONS FOR B2B PRODUCTS ---
  const triggerUpsertB2bProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert_b2b_product',
          token: sessionToken,
          payload: {
            id: b2bProductForm.id.trim(),
            category: b2bProductForm.category,
            name: b2bProductForm.name.trim(),
            description: b2bProductForm.description.trim(),
            application: b2bProductForm.application.trim(),
            image_url: b2bProductForm.image_url.trim()
          }
        })
      });
      if (res.ok) {
        setEditingItemType(null);
        fetchCompleteDashboardData(sessionToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeleteB2bProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this B2B product key?')) return;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_b2b_product',
          token: sessionToken,
          payload: { id }
        })
      });
      if (res.ok) fetchCompleteDashboardData(sessionToken);
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD ACTIONS FOR TEAM MEMBERS ---
  const triggerUpsertTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert_team_member',
          token: sessionToken,
          payload: {
            id: teamForm.id.trim(),
            name: teamForm.name.trim(),
            position: teamForm.position.trim(),
            image_url: teamForm.image_url.trim()
          }
        })
      });
      if (res.ok) {
        setEditingItemType(null);
        fetchCompleteDashboardData(sessionToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_team_member',
          token: sessionToken,
          payload: { id }
        })
      });
      if (res.ok) fetchCompleteDashboardData(sessionToken);
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD ACTIONS FOR SERVICES ---
  const triggerUpsertService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert_service',
          token: sessionToken,
          payload: {
            id: serviceForm.id.trim(),
            title: serviceForm.title.trim(),
            description: serviceForm.description.trim(),
            details: serviceForm.details.trim(),
            icon_name: serviceForm.icon_name.trim(),
            image_url: serviceForm.image_url.trim()
          }
        })
      });
      if (res.ok) {
        setEditingItemType(null);
        fetchCompleteDashboardData(sessionToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeleteService = async (id: string) => {
    if (!confirm('Delete this industrial service catalog line?')) return;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_service',
          token: sessionToken,
          payload: { id }
        })
      });
      if (res.ok) fetchCompleteDashboardData(sessionToken);
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD ACTIONS FOR BLOGS ---
  const triggerUpsertBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert_blog',
          token: sessionToken,
          payload: {
            id: blogForm.id.trim(),
            title: blogForm.title.trim(),
            excerpt: blogForm.excerpt.trim(),
            content: blogForm.content.trim(),
            category: blogForm.category.trim(),
            date: blogForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }),
            author: blogForm.author.trim() || 'Techsol Editor',
            read_time: blogForm.read_time.trim(),
            image_url: blogForm.image_url.trim()
          }
        })
      });
      if (res.ok) {
        setEditingItemType(null);
        fetchCompleteDashboardData(sessionToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this press/blog post?')) return;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_blog',
          token: sessionToken,
          payload: { id }
        })
      });
      if (res.ok) fetchCompleteDashboardData(sessionToken);
    } catch (err) {
      console.error(err);
    }
  };

  // --- NEW: CRUD ACTIONS FOR TESTIMONIALS ---
  const triggerUpsertTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert_testimonial',
          token: sessionToken,
          payload: {
            id: testimonialForm.id.trim(),
            name: testimonialForm.name.trim(),
            designation: testimonialForm.designation.trim(),
            company: testimonialForm.company.trim(),
            quote: testimonialForm.quote.trim(),
            image_url: testimonialForm.image_url.trim()
          }
        })
      });
      if (res.ok) {
        setEditingItemType(null);
        fetchCompleteDashboardData(sessionToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client testimonial?')) return;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_testimonial',
          token: sessionToken,
          payload: { id }
        })
      });
      if (res.ok) fetchCompleteDashboardData(sessionToken);
    } catch (err) {
      console.error(err);
    }
  };

  // Enquiries cleaner logs
  const handleClearLogs = async (typeFilter?: 'product' | 'contact' | 'chat') => {
    if (!confirm(`Are you sure you want to erase ${typeFilter || 'all'} enquiries? This action is absolutely irreversible.`)) return;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clear_enquiries',
          token: sessionToken,
          payload: { type: typeFilter }
        })
      });
      if (res.ok) fetchCompleteDashboardData(sessionToken);
    } catch (err) {
      console.error(err);
    }
  };

  // Google Sign-In binders
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      console.error('Google OAuth error:', err);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await googleSignOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Filtering inward logs
  const filteredEnquiries = enquiries.filter(enq => enq.type === activeEnquiryFilter);

  // --- LOGIN SECURITY SHIELD GATE ---
  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-slate-900 flex items-center justify-center py-20 px-4 font-sans select-none">
        <form onSubmit={handleLoginSubmit} className="max-w-md w-full bg-slate-950 border border-slate-800 p-8 space-y-5">
          <div className="text-center space-y-2">
            <div className="bg-amber-600 p-3.5 mx-auto w-fit">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-mono uppercase font-black text-white tracking-widest pt-2">
              Management Portal
            </h1>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Access is restricted to authorized Techsol International administration officers.
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-950/50 border border-rose-850 text-rose-300 p-3.5 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>Sign-In rejected. Invalid administrative credentials catalog records.</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block">
              Username ID
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Username"
              className="w-full bg-slate-900 border border-slate-800 text-white text-sm px-4 py-3 outline-none focus:border-amber-500 font-mono tracking-wide text-center"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block">
              Security Code Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-800 text-white text-sm px-4 py-3 outline-none focus:border-amber-500 font-mono tracking-widest text-center"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-mono font-black text-xs tracking-widest uppercase py-3.5 transition-all cursor-pointer"
          >
            Authorize Access
          </button>

          <p className="text-[10px] text-slate-500 text-center font-mono uppercase">
            Sign-In Securely via Relational Database
          </p>
        </form>
      </div>
    );
  }

  // --- TELEMETRY LOAD INDEX ---
  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-12 select-none">
        <Loader className="h-8 w-8 animate-spin text-amber-600 mb-2" />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          Synchronizing Neon PostgreSQL State...
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-slate-100 select-text">
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="w-full lg:w-72 bg-slate-950 text-slate-350 border-b lg:border-b-0 lg:border-r border-slate-900 flex flex-col justify-between p-6 shrink-0 font-sans">
        
        <div className="space-y-8">
          
          <div className="space-y-1 pb-4 border-b border-slate-905">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-none shadow-sm animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white font-mono">
                Admin Station
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono uppercase">
              DB: Neon PostgreSQL Active
            </p>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => { setActiveSidebarTab('enquiries'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'enquiries' ? 'bg-amber-605 bg-amber-600 text-white font-black' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Table className="h-4 w-4" />
              <span>Inward Enquiries</span>
            </button>

            <button
              onClick={() => { setActiveSidebarTab('cms_pages'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'cms_pages' ? 'bg-amber-605 bg-amber-600 text-white font-black' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Edit Page Details</span>
            </button>

            <button
              onClick={() => { setActiveSidebarTab('cms_products'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'cms_products' ? 'bg-amber-651 bg-amber-600 text-white font-black' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Machines CMS</span>
            </button>

            <button
              onClick={() => { setActiveSidebarTab('cms_b2b_products'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'cms_b2b_products' ? 'bg-amber-600 text-white' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4 text-amber-500" />
              <span>B2B Products CMS</span>
            </button>

            <button
              onClick={() => { setActiveSidebarTab('cms_team'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'cms_team' ? 'bg-amber-600 text-white' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4 text-amber-500" />
              <span>Our Team CMS</span>
            </button>

            <button
              onClick={() => { setActiveSidebarTab('cms_services'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'cms_services' ? 'bg-amber-600 text-white font-black' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Factory className="h-4 w-4" />
              <span>Services CMS</span>
            </button>

            <button
              onClick={() => { setActiveSidebarTab('cms_blogs'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'cms_blogs' ? 'bg-amber-600 text-white' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Blogs CMS</span>
            </button>

            <button
              onClick={() => { setActiveSidebarTab('testimonials'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'testimonials' ? 'bg-amber-600 text-white' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Quote className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Testimonials CRUD</span>
            </button>

            <button
              onClick={() => { setActiveSidebarTab('settings'); setEditingItemType(null); }}
              className={`w-full text-left px-4 py-3 text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSidebarTab === 'settings' ? 'bg-amber-600 text-white' : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>System Settings</span>
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-slate-900 mt-8 space-y-4 font-mono select-none">
          <button
            onClick={handleLogout}
            className="w-full bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-200 text-2xs uppercase py-2.5 text-center tracking-wider transition-all cursor-pointer block border border-slate-800"
          >
            LOGOUT SESSION OFFICE
          </button>
          <div className="text-[10px] uppercase text-slate-600 text-center">
            Techsol International v3.0
          </div>
        </div>

      </aside>

      {/* COMPONENT CONTENT MONITOR */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 bg-slate-50 overflow-x-hidden min-h-screen">
        
        {/* Top Header bar with refresh action */}
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[9px] font-mono text-amber-600 uppercase tracking-widest font-black block">
              Control Panel Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              {activeSidebarTab === 'enquiries' && 'Inward Client Enquiries'}
              {activeSidebarTab === 'cms_pages' && 'Customize Page Details'}
              {activeSidebarTab === 'cms_products' && 'Machines Catalog CMS Manager'}
              {activeSidebarTab === 'cms_b2b_products' && 'B2B Spices & Flavours CMS'}
              {activeSidebarTab === 'cms_team' && 'Our Team CMS'}
              {activeSidebarTab === 'cms_services' && 'Services Catalog CMS Manager'}
              {activeSidebarTab === 'cms_blogs' && 'Research Blogs Publisher'}
              {activeSidebarTab === 'testimonials' && 'Testimonials Manager (CRUD Panel)'}
              {activeSidebarTab === 'settings' && 'Systems Config Sheets Integration'}
            </h1>
          </div>

          <button
            onClick={refreshTelemetry}
            disabled={isRefreshing}
            className="p-2.5 bg-white hover:text-amber-604 hover:text-amber-600 transition-all text-slate-650 border border-slate-200 hover:border-slate-400 cursor-pointer w-fit"
            title="Force DB Refresh"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Global Action Result banners */}
        {saveStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>RESULT: {statusMessage}</span>
          </div>
        )}

        {/* =======================================================
            TAB 1: ENQUIRIES LOGS
            ======================================================= */}
        {activeSidebarTab === 'enquiries' && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="flex border-b border-slate-200 pb-px">
              {[
                { filter: 'product', label: 'Technical Quotations' },
                { filter: 'contact', label: 'Contact us Form Logs' },
                { filter: 'chat', label: 'AI Support Chat Transcripts' }
              ].map((t) => (
                <button
                  key={t.filter}
                  onClick={() => setActiveEnquiryFilter(t.filter as any)}
                  className={`px-5 py-3 text-xs uppercase font-extrabold tracking-wider transition-all border-b-2 cursor-pointer ${
                    activeEnquiryFilter === t.filter 
                      ? 'border-amber-600 text-slate-950 font-black bg-slate-100/50'
                      : 'border-transparent text-slate-400 hover:text-slate-855 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center bg-white border border-slate-200 p-4">
              <span className="text-[10px] uppercase font-mono text-slate-500 italic font-bold">
                Logged records in Postgres: {filteredEnquiries.length} item(s) mapped
              </span>
              <button
                onClick={() => handleClearLogs(activeEnquiryFilter)}
                className="text-[9px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-950 hover:text-white px-3 py-1.5 uppercase transition-all cursor-pointer font-black"
              >
                Erase current filtered index logs
              </button>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="text-center py-16 border bg-white border-slate-200 text-slate-400 font-mono text-xs">
                No enquires logged under this category filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((enq) => (
                  <div key={enq.id} className="bg-white border border-slate-200 p-6 space-y-4 shadow-2xs">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">
                          RECORD NO: {enq.id}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 font-mono">
                          Client: {enq.client_name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(enq.created_at).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase italic">Contact Number</span>
                        <p className="font-semibold text-slate-850 select-all">{enq.client_phone || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase italic">HQ / Location</span>
                        <p className="font-bold text-slate-850 truncate" title={enq.client_address}>{enq.client_address || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase italic">Industry Sector</span>
                        <p className="font-semibold text-slate-800">{enq.industry || 'Other'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase italic">Model Requested</span>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 uppercase inline-block mt-0.5">
                          {enq.inquiry_type_or_model}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-3">
                      <span className="text-[9px] font-mono text-slate-400 uppercase italic block pb-1">
                        Inquiry Specification details
                      </span>
                      <p className="text-xs text-slate-750 font-serif leading-relaxed select-all">
                        {enq.description || 'No direct notes attached.'}
                      </p>
                    </div>

                    {enq.type === 'chat' && enq.session_chat_history && enq.session_chat_history !== 'synced' && (
                      <div className="bg-indigo-50/50 border border-indigo-100 p-3 space-y-1.5">
                        <span className="text-[9px] font-mono text-indigo-400 uppercase italic block">
                          AI Dialogue Sequence Mappings
                        </span>
                        <div className="max-h-32 overflow-y-auto text-[10px] font-mono space-y-1">
                          {(() => {
                             try {
                               const parsed = JSON.parse(enq.session_chat_history);
                               return Array.isArray(parsed) ? parsed.map((c: any, i: number) => (
                                 <div key={i}>
                                   <span className="text-slate-400 uppercase">[{c.role}]:</span> {c.text}
                                 </div>
                               )) : <span>{enq.session_chat_history}</span>;
                             } catch (e) {
                               return <span className="text-slate-400">{enq.session_chat_history}</span>;
                             }
                          })()}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB 2: CMS PAGES TEXTS (FULLY COMPLETED COPIES FORM)
            ======================================================= */}
        {activeSidebarTab === 'cms_pages' && (
          <form onSubmit={saveCmsChanges} className="bg-white border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs animate-fade-in">
            
            {/* HERO SECTION DECK */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b pb-2 font-mono flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-amber-600" />
                <span>Homepage Hero section inputs</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Hero Title headline
                  </label>
                  <input
                    type="text"
                    required
                    value={cmsFormMapping['home_hero_title'] || ''}
                    onChange={(e) => setCmsFormMapping({ ...cmsFormMapping, home_hero_title: e.target.value })}
                    className="w-full border border-slate-200 focus:border-amber-600 outline-none px-4 py-3 text-xs sm:text-sm font-sans rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Hero Primary Subheading
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={cmsFormMapping['home_hero_subtitle'] || ''}
                    onChange={(e) => setCmsFormMapping({ ...cmsFormMapping, home_hero_subtitle: e.target.value })}
                    className="w-full border border-slate-200 focus:border-amber-600 outline-none px-4 py-3 text-xs sm:text-sm font-sans rounded-none resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Hero Footer description indices
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={cmsFormMapping['home_hero_description'] || ''}
                    onChange={(e) => setCmsFormMapping({ ...cmsFormMapping, home_hero_description: e.target.value })}
                    className="w-full border border-slate-200 focus:border-amber-600 outline-none px-4 py-3 text-xs sm:text-sm font-sans rounded-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>



            {/* SECONDARY ABOUT US STORIES */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b pb-2 font-mono flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-amber-600" />
                <span>Interior About us page copytexts</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    About Page Hero headline
                  </label>
                  <input
                    type="text"
                    required
                    value={cmsFormMapping['about_hero_title'] || ''}
                    onChange={(e) => setCmsFormMapping({ ...cmsFormMapping, about_hero_title: e.target.value })}
                    className="w-full border border-slate-200 focus:border-amber-600 outline-none px-4 py-3 text-xs sm:text-sm rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    About Page Hero Subheading
                  </label>
                  <input
                    type="text"
                    required
                    value={cmsFormMapping['about_hero_subtitle'] || ''}
                    onChange={(e) => setCmsFormMapping({ ...cmsFormMapping, about_hero_subtitle: e.target.value })}
                    className="w-full border border-slate-200 focus:border-amber-600 outline-none px-4 py-3 text-xs sm:text-sm rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Detailed Corporate Origins story
                </label>
                <textarea
                  rows={4}
                  required
                  value={cmsFormMapping['about_story'] || ''}
                  onChange={(e) => setCmsFormMapping({ ...cmsFormMapping, about_story: e.target.value })}
                  className="w-full border border-slate-200 focus:border-amber-600 outline-none px-4 py-3 text-xs sm:text-sm rounded-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block pb-1">
                    Corporate Mission values
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cmsFormMapping['about_mission'] || ''}
                    onChange={(e) => setCmsFormMapping({ ...cmsFormMapping, about_mission: e.target.value })}
                    className="w-full border border-slate-200 focus:border-amber-600 outline-none px-4 py-2.5 text-xs rounded-none resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block pb-1">
                    Corporate Vision values
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cmsFormMapping['about_vision'] || ''}
                    onChange={(e) => setCmsFormMapping({ ...cmsFormMapping, about_vision: e.target.value })}
                    className="w-full border border-slate-200 focus:border-amber-600 outline-none px-4 py-2.5 text-xs rounded-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <button
              id="cms-save-btn"
              type="submit"
              disabled={isSaving}
              className="bg-slate-900 text-white hover:bg-amber-600 font-bold text-xs tracking-wider uppercase py-3.5 px-6 rounded-none flex items-center gap-2 cursor-pointer transition-colors"
            >
              {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Commit copytexts variables index</span>
            </button>

          </form>
        )}

        {/* =======================================================
            TAB 3: PRODUCTS CMS MANAGER
            ======================================================= */}
        {activeSidebarTab === 'cms_products' && (
          <div className="space-y-6 animate-fade-in">
            
            {editingItemType === 'product' ? (
              <form onSubmit={triggerUpsertProduct} className="bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                    {editingId ? `Edit machinery data (ID: ${editingId})` : 'Register new mechanical asset'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingItemType(null)}
                    className="text-2xs font-mono font-bold bg-slate-100 px-3 py-1 hover:bg-slate-200 transition-colors uppercase cursor-pointer text-slate-705"
                  >
                    Back to catalog list
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Unique ID key (Primary key) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. wheat-mill-advanced"
                      disabled={!!editingId}
                      value={productForm.id}
                      onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Machinery class (Category)</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full border border-slate-200 bg-white px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    >
                      <option value="milling">Wheat / Rice Milling</option>
                      <option value="sorting">Color CCD Photoelectric sorter</option>
                      <option value="packing">Liquid Processing packaging filler</option>
                      <option value="automation">Factory logical PLC console</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Public Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AeroSort Dual-Slick 3200 CCD Matrix"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block">General Description summary</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about machinery mechanics, performance bounds..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Yield Capacity (TPH)</label>
                    <input
                      type="text"
                      placeholder="e.g. 5.5 - 8.0 Metric Tons / Hr"
                      value={productForm.capacity}
                      onChange={(e) => setProductForm({ ...productForm, capacity: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Power Phase Ratings</label>
                    <input
                      type="text"
                      placeholder="e.g. 30 kW High-torque 3-phase unit"
                      value={productForm.power}
                      onChange={(e) => setProductForm({ ...productForm, power: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1 font-bold">
                    <ImageIcon className="h-3.5 w-3.5 text-amber-600" />
                    <span>Direct Image Link (Unsplash / Cloudinary hosted URL)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/photo-example... or Cloudinary link"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 text-slate-700 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Specifications JSON data *</label>
                  <textarea
                    rows={3}
                    placeholder='e.g. {"Camera Rows": "5400px CMOS arrays", "Compressor Needed": "7.5 kW"}'
                    value={productForm.specs}
                    onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-2xs rounded-none outline-none focus:border-amber-600 font-mono text-slate-700 resize-none"
                  />
                  <p className="text-[10px] text-slate-400 font-mono">Format must be valid raw JSON dictionary string.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-amber-600 text-white font-mono font-bold text-xs tracking-wider uppercase py-3 px-5 rounded-none flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Catalog specifications</span>
                </button>
              </form>
            ) : (
              <div className="bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                    Active Catalog Inventory: {products.length} Mapped
                  </h3>
                  <button
                    onClick={() => {
                      setProductForm({ id: '', category: 'milling', name: '', description: '', capacity: '', power: '', image_url: '', specs: '{}' });
                      setEditingId(null);
                      setEditingItemType('product');
                    }}
                    className="bg-slate-900 text-white hover:bg-amber-600 font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-none inline-flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Register new machine</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[650px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-black text-[10px] bg-slate-50">
                        <th className="py-2.5 px-3">Thumbnail</th>
                        <th className="py-2.5 px-3">Class key</th>
                        <th className="py-2.5 px-3">Hardware product name</th>
                        <th className="py-2.5 px-3">Capacity specs</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => {
                        return (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors text-slate-700">
                            <td className="py-2.5 px-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=120'}
                                alt="thumbnail"
                                className="w-12 h-8 object-cover border border-slate-200 grayscale scale-95"
                              />
                            </td>
                            <td className="py-2.5 px-3 font-bold text-amber-800">{p.category.toUpperCase()}</td>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900">{p.name}</td>
                            <td className="py-2.5 px-3">{p.capacity}</td>
                            <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setProductForm({
                                    id: p.id,
                                    category: p.category,
                                    name: p.name,
                                    description: p.description,
                                    capacity: p.capacity,
                                    power: p.power,
                                    image_url: p.image_url || '',
                                    specs: p.specs ? JSON.stringify(p.specs) : '{}'
                                  });
                                  setEditingId(p.id);
                                  setEditingItemType('product');
                                }}
                                className="p-1 px-1.5 bg-slate-100 hover:bg-slate-950 text-slate-800 hover:text-white transition-all cursor-pointer inline-flex items-center"
                                title="Edit specs"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => triggerDeleteProduct(p.id)}
                                className="p-1 px-1.5 bg-rose-50 text-rose-705 hover:bg-rose-950 hover:text-white transition-all cursor-pointer inline-flex items-center"
                                title="Delete specs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB 3.5: B2B PRODUCTS CMS MANAGER (SPICES & FLAVOURS)
            ======================================================= */}
        {activeSidebarTab === 'cms_b2b_products' && (
          <div className="space-y-6 animate-fade-in font-sans">
            
            {editingItemType === 'b2b_product' ? (
              <form onSubmit={triggerUpsertB2bProduct} className="bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                    {editingId ? `Edit B2B Product (ID: ${editingId})` : 'Register new B2B Product key'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingItemType(null)}
                    className="text-2xs font-mono font-bold bg-slate-100 px-3 py-1 hover:bg-slate-200 transition-colors uppercase cursor-pointer text-slate-700"
                  >
                    Back to products catalog
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Unique ID key (Primary key) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. chocolate-biscuit-flavor"
                      disabled={!!editingId}
                      value={b2bProductForm.id}
                      onChange={(e) => setB2bProductForm({ ...b2bProductForm, id: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Flavour / Spice Category</label>
                    <select
                      value={b2bProductForm.category}
                      onChange={(e) => setB2bProductForm({ ...b2bProductForm, category: e.target.value })}
                      className="w-full border border-slate-200 bg-white px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    >
                      <option value="Seasoning & Spices">Seasoning & Spices</option>
                      <option value="Sweet Flavors">Sweet Flavors</option>
                      <option value="Savory Flavors">Savory Flavors</option>
                      <option value="Liquid Extracts">Liquid Extracts</option>
                      <option value="Beverage Flavors">Beverage & Liquor Aromas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. seasoning spices, chocolate flavour for biscuits"
                      value={b2bProductForm.name}
                      onChange={(e) => setB2bProductForm({ ...b2bProductForm, name: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Dosage Application *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. For Biscuits, 0.1% of flour mix"
                      value={b2bProductForm.application}
                      onChange={(e) => setB2bProductForm({ ...b2bProductForm, application: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block block">General Description</label>
                  <textarea
                    rows={4}
                    value={b2bProductForm.description}
                    placeholder="Provide a description of the flavor notes, regulatory standards compliance and compound ingredients details."
                    onChange={(e) => setB2bProductForm({ ...b2bProductForm, description: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block block">Illustrative Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={b2bProductForm.image_url}
                    onChange={(e) => setB2bProductForm({ ...b2bProductForm, image_url: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-slate-900 text-white hover:bg-amber-600 font-bold font-mono text-xs uppercase py-3 rounded-none cursor-pointer transition-all disabled:bg-slate-300"
                >
                  {isSaving ? 'Saving inside server catalog logs...' : 'Store dynamic product sheet'}
                </button>

              </form>
            ) : (
              <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                
                <div className="flex justify-between items-center border-b pb-3.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-655">
                    B2B Compounded Flavor Catalog: {b2bProducts.length} Loaded
                  </h3>
                  <button
                    onClick={() => {
                      setB2bProductForm({ id: '', category: 'Seasoning & Spices', name: '', description: '', application: '', image_url: '' });
                      setEditingId(null);
                      setEditingItemType('b2b_product');
                    }}
                    className="bg-slate-900 text-white hover:bg-amber-600 font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-none inline-flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Post New flavour / spice</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[650px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-black text-[10px] bg-slate-50">
                        <th className="py-2.5 px-3">Thumbnail</th>
                        <th className="py-2.5 px-3">Unique ID</th>
                        <th className="py-2.5 px-3">Flavour details</th>
                        <th className="py-2.5 px-3">Recommended dosage</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {b2bProducts.map((p) => {
                        return (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors text-slate-700">
                            <td className="py-2.5 px-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=120'}
                                alt="thumbnail"
                                className="w-12 h-8 object-cover border border-slate-200 grayscale scale-95"
                              />
                            </td>
                            <td className="py-2.5 px-3 font-bold text-emerald-850 font-mono text-[10px]">{p.id}</td>
                            <td className="py-2.5 px-3">
                              <span className="font-extrabold text-slate-955 block text-xs">{p.name}</span>
                              <span className="text-slate-420 text-[9px] uppercase font-mono tracking-widest text-amber-600 block">{p.category}</span>
                            </td>
                            <td className="py-2.5 px-3 font-sans text-slate-500 font-medium">{p.application}</td>
                            <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setB2bProductForm({
                                    id: p.id,
                                    category: p.category,
                                    name: p.name,
                                    description: p.description || '',
                                    application: p.application || '',
                                    image_url: p.image_url || ''
                                  });
                                  setEditingId(p.id);
                                  setEditingItemType('b2b_product');
                                }}
                                className="p-1 px-1.5 bg-slate-100 hover:bg-slate-950 text-slate-800 hover:text-white transition-all cursor-pointer inline-flex items-center"
                                title="Edit sheet"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => triggerDeleteB2bProduct(p.id)}
                                className="p-1 px-1.5 bg-rose-50 text-rose-705 hover:bg-rose-950 hover:text-white transition-all cursor-pointer inline-flex items-center"
                                title="Remove item"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB 3.6: OUR TEAM CMS MANAGER
            ======================================================= */}
        {activeSidebarTab === 'cms_team' && (
          <div className="space-y-6 animate-fade-in font-sans">
            
            {editingItemType === 'team_member' ? (
              <form onSubmit={triggerUpsertTeamMember} className="bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                    {editingId ? `Update Team profile (ID: ${editingId})` : 'Onboard new Team Member'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingItemType(null)}
                    className="text-2xs font-mono font-bold bg-slate-100 px-3 py-1 hover:bg-slate-200 transition-colors uppercase cursor-pointer text-slate-705"
                  >
                    Back to team list
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Onboarding DB ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. shrestha-rk"
                      disabled={!!editingId}
                      value={teamForm.id}
                      onChange={(e) => setTeamForm({ ...teamForm, id: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Full Professional Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Er. Rajesh Kumar Shrestha"
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Operational Title (Role) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Head of Flour milling erection systems"
                      value={teamForm.position}
                      onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Avatar Photo URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={teamForm.image_url}
                      onChange={(e) => setTeamForm({ ...teamForm, image_url: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-slate-900 text-white hover:bg-amber-600 font-bold font-mono text-xs uppercase py-3 rounded-none cursor-pointer transition-all disabled:bg-slate-300"
                >
                  {isSaving ? 'Onboarding team member...' : 'Save team member profile metadata'}
                </button>

              </form>
            ) : (
              <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                
                <div className="flex justify-between items-center border-b pb-3.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-650">
                    Onboarded Team Members: {teamMembers.length} listed
                  </h3>
                  <button
                    onClick={() => {
                      setTeamForm({ id: '', name: '', position: '', image_url: '' });
                      setEditingId(null);
                      setEditingItemType('team_member');
                    }}
                    className="bg-slate-900 text-white hover:bg-amber-600 font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-none inline-flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Onboard Team Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-4 bg-slate-50 border border-slate-250 flex flex-col justify-between rounded-none shadow-2xs">
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 shrink-0 bg-slate-200 overflow-hidden border border-slate-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={member.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=85&w=150'} 
                            alt={member.name}
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-sans font-black text-slate-900 text-sm block leading-snug">
                            {member.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 capitalize block tracking-wide">
                            {member.position}
                          </span>
                          <span className="text-[8px] font-mono bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded-none inline-block font-extrabold uppercase">
                            ID: {member.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setTeamForm({
                              id: member.id,
                              name: member.name,
                              position: member.position,
                              image_url: member.image_url || ''
                            });
                            setEditingId(member.id);
                            setEditingItemType('team_member');
                          }}
                          className="p-1 px-2.5 bg-slate-200 hover:bg-slate-950 text-slate-800 hover:text-white text-3xs font-mono font-bold uppercase transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => triggerDeleteTeamMember(member.id)}
                          className="p-1 px-2.5 bg-rose-50 text-rose-705 hover:bg-rose-950 hover:text-white text-3xs font-mono font-bold uppercase transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB 4: SERVICES CMS MANAGER
            ======================================================= */}
        {activeSidebarTab === 'cms_services' && (
          <div className="space-y-6 animate-fade-in">
            
            {editingItemType === 'service' ? (
              <form onSubmit={triggerUpsertService} className="bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                    {editingId ? `Edit service data (ID: ${editingId})` : 'Register new structural service'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingItemType(null)}
                    className="text-2xs font-mono font-bold bg-slate-100 px-3 py-1 hover:bg-slate-200 transition-colors uppercase cursor-pointer"
                  >
                    Back to services list
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Service ID key *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. calibration-laser"
                      disabled={!!editingId}
                      value={serviceForm.id}
                      onChange={(e) => setServiceForm({ ...serviceForm, id: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Display Icon</label>
                    <select
                      value={serviceForm.icon_name}
                      onChange={(e) => setServiceForm({ ...serviceForm, icon_name: e.target.value })}
                      className="w-full border border-slate-200 bg-white px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    >
                      <option value="Cpu">Cpu (Smart chip design)</option>
                      <option value="Factory">Factory (Heavy plant erection)</option>
                      <option value="Zap">Zap (Electric voltage logic)</option>
                      <option value="Settings">Settings (Maintenance support)</option>
                      <option value="ShieldCheck">ShieldCheck (Operational validation)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block">Introductory Summary</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block">Comprehensive Details Paragraph</label>
                  <textarea
                    rows={4}
                    required
                    value={serviceForm.details}
                    onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1 font-bold">
                    <ImageIcon className="h-3.5 w-3.5 text-amber-600" />
                    <span>Representative Image Link (Direct URL)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.image_url}
                    onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 text-slate-705 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-amber-600 text-white font-mono font-bold text-xs tracking-wider uppercase py-3 px-5 rounded-none flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save dynamic service line</span>
                </button>
              </form>
            ) : (
              <div className="bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                    Active Catalog Services: {services.length} Mapped
                  </h3>
                  <button
                    onClick={() => {
                      setServiceForm({ id: '', title: '', description: '', details: '', icon_name: 'Factory', image_url: '' });
                      setEditingId(null);
                      setEditingItemType('service');
                    }}
                    className="bg-slate-900 text-white hover:bg-amber-600 font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-none inline-flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Register new service</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-black text-[10px] bg-slate-50">
                        <th className="py-2.5 px-3">Visual</th>
                        <th className="py-2.5 px-3">Icon Type</th>
                        <th className="py-2.5 px-3">Service Title representation</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {services.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors text-slate-700">
                          <td className="py-2.5 px-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={s.image_url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=120'}
                              alt="thumb"
                              className="w-12 h-8 object-cover border border-slate-100 grayscale hover:grayscale-0"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-600">{s.icon_name}</td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-900">{s.title}</td>
                          <td className="py-2.5 px-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setServiceForm({
                                  id: s.id,
                                  title: s.title,
                                  description: s.description,
                                  details: s.details || '',
                                  icon_name: s.icon_name,
                                  image_url: s.image_url || ''
                                });
                                setEditingId(s.id);
                                setEditingItemType('service');
                              }}
                              className="p-1 px-1.5 bg-slate-100 hover:bg-slate-950 text-slate-850 hover:text-white transition-all cursor-pointer inline-flex items-center"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => triggerDeleteService(s.id)}
                              className="p-1 px-1.5 bg-rose-50 text-rose-705 hover:bg-rose-950 hover:text-white transition-all cursor-pointer inline-flex items-center"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB 5: BLOGS CMS MANAGER
            ======================================================= */}
        {activeSidebarTab === 'cms_blogs' && (
          <div className="space-y-6 animate-fade-in font-mono text-xs">
            
            {editingItemType === 'blog' ? (
              <form onSubmit={triggerUpsertBlog} className="bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs font-sans">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                    {editingId ? `Edit publishing copy (ID: ${editingId})` : 'Draft a new research blog'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingItemType(null)}
                    className="text-2xs font-mono font-bold bg-slate-100 px-3 py-1 hover:bg-slate-200 transition-colors uppercase cursor-pointer text-slate-700"
                  >
                    Back to post logs
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Post ID Slug key *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. dynamic-roller-spiced"
                      disabled={!!editingId}
                      value={blogForm.id}
                      onChange={(e) => setBlogForm({ ...blogForm, id: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Category</label>
                    <input
                      type="text"
                      required
                      placeholder="Milling Tech, Automation etc."
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Headline Title *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Primary Author</label>
                    <input
                      type="text"
                      placeholder="Er. R. K. Shrestha"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Read Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 min read"
                      value={blogForm.read_time}
                      onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Publish Date Representation</label>
                    <input
                      type="text"
                      placeholder="June 01, 2026"
                      value={blogForm.date}
                      onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Excerpt summary</label>
                  <input
                    type="text"
                    required
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block">Article Detailed Body Content</label>
                  <textarea
                    rows={6}
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none resize-none font-serif text-[13px] leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1 font-bold">
                    <ImageIcon className="h-3.5 w-3.5 text-amber-600" />
                    <span>Cover Image URL link (Direct link)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/your_photograph_asset.jpg"
                    value={blogForm.image_url}
                    onChange={(e) => setBlogForm({ ...blogForm, image_url: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 text-slate-705 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-amber-600 text-white font-mono font-bold text-xs tracking-wider uppercase py-3 px-5 rounded-none flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Publish Article log</span>
                </button>
              </form>
            ) : (
              <div className="bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                    Published Research articles: {blogs.length} Active
                  </h3>
                  <button
                    onClick={() => {
                      setBlogForm({ id: '', title: '', excerpt: '', content: '', category: 'Milling', date: '', author: '', read_time: '6 min read', image_url: '' });
                      setEditingId(null);
                      setEditingItemType('blog');
                    }}
                    className="bg-slate-900 text-white hover:bg-amber-600 font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-none inline-flex items-center gap-1 cursor-pointer transition-all font-sans"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Publish new blog</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-black text-[10px] bg-slate-50">
                        <th className="py-2.5 px-3">Visual</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Article Headline Title</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {blogs.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors text-slate-700">
                          <td className="py-2.5 px-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={b.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=120'}
                              alt="thumb"
                              className="w-12 h-8 object-cover border border-slate-100 grayscale hover:grayscale-0"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-semibold">{b.category}</td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-905 truncate max-w-[200px]" title={b.title}>{b.title}</td>
                          <td className="py-2.5 px-3">{b.date}</td>
                          <td className="py-2.5 px-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setBlogForm({
                                  id: b.id,
                                  title: b.title,
                                  excerpt: b.excerpt,
                                  content: b.content || '',
                                  category: b.category,
                                  date: b.date,
                                  author: b.author,
                                  read_time: b.read_time,
                                  image_url: b.image_url || ''
                                });
                                setEditingId(b.id);
                                setEditingItemType('blog');
                              }}
                              className="p-1 px-1.5 bg-slate-100 hover:bg-slate-950 text-slate-850 hover:text-white transition-all cursor-pointer inline-flex items-center"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => triggerDeleteBlog(b.id)}
                              className="p-1 px-1.5 bg-rose-50 text-rose-705 hover:bg-rose-950 hover:text-white transition-all cursor-pointer inline-flex items-center"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* =======================================================
            NEW TAB 6: TESTIMONIALS CRUD MANAGER
            ======================================================= */}
        {activeSidebarTab === 'testimonials' && (
          <div className="space-y-6 animate-fade-in font-sans">
            
            {editingItemType === 'testimonial' ? (
              // Add / Edit Testimonial form UI
              <form onSubmit={triggerUpsertTestimonial} className="bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                    {editingId ? `Edit Testimonial (ID: ${editingId})` : 'Register Client validation Appraisal'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingItemType(null)}
                    className="text-2xs font-mono font-bold bg-slate-100 px-3 py-1 hover:bg-slate-200 transition-colors uppercase cursor-pointer text-slate-705"
                  >
                    Back to appraisals list
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Unique Entry ID key *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. testimonial-shrestha"
                      disabled={!!editingId}
                      value={testimonialForm.id}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, id: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Operator Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunil Shrestha"
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                      className="w-full border border-slate-205 px-4 py-2.5 text-xs rounded-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Designation / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mill Manager"
                      value={testimonialForm.designation}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, designation: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shrestha Spices & Foods Pvt. Ltd."
                      value={testimonialForm.company}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                      className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Operator appraisal Quote *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe their experience with Techsol International's optical color sorters or turnkey plants..."
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1 font-bold">
                    <ImageIcon className="h-3.5 w-3.5 text-amber-600" />
                    <span>Client Avatar Image Link (Direct URL Link)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or any host link"
                    value={testimonialForm.image_url}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, image_url: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-2.5 text-xs rounded-none outline-none focus:border-amber-600 text-slate-700 font-sans"
                  />
                  <p className="text-[9px] text-slate-400 font-mono">Leave blank to default to generic capital letter avatar inside frontend carousel boxes.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-amber-600 text-white font-mono font-bold text-xs tracking-wider uppercase py-3 px-5 rounded-none flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save validation Appraisal</span>
                </button>
              </form>
            ) : (
              // Testimonials Table View
              <div className="bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                    Active Client Appraisals: {testimonials.length} Saved
                  </h3>
                  <button
                    onClick={() => {
                      setTestimonialForm({ id: '', name: '', designation: '', company: '', quote: '', image_url: '' });
                      setEditingId(null);
                      setEditingItemType('testimonial');
                    }}
                    className="bg-slate-905 bg-slate-900 text-white hover:bg-amber-600 font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-none inline-flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create new Testimonial</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-black text-[10px] bg-slate-50">
                        <th className="py-2.5 px-3">Avatar</th>
                        <th className="py-2.5 px-3">Client details Name</th>
                        <th className="py-2.5 px-3">Company corporation</th>
                        <th className="py-2.5 px-3">Featured Quote</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {testimonials.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors text-slate-700">
                          <td className="py-2.5 px-3">
                            {t.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={t.image_url}
                                alt="avatar"
                                className="w-9 h-9 object-cover rounded-none border border-slate-200 grayscale scale-95"
                              />
                            ) : (
                              <div className="w-9 h-9 bg-slate-200 text-amber-700 font-extrabold flex items-center justify-center text-xs">
                                {t.name[0] || 'T'}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{t.name}</td>
                          <td className="py-2.5 px-3">{t.designation}, {t.company}</td>
                          <td className="py-2.5 px-3 text-slate-500 italic max-w-xs truncate" title={t.quote}>&ldquo;{t.quote}&rdquo;</td>
                          <td className="py-2.5 px-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setTestimonialForm({
                                  id: t.id,
                                  name: t.name,
                                  designation: t.designation,
                                  company: t.company,
                                  quote: t.quote,
                                  image_url: t.image_url || ''
                                });
                                setEditingId(t.id);
                                setEditingItemType('testimonial');
                              }}
                              className="p-1 px-1.5 bg-slate-100 hover:bg-slate-950 text-slate-850 hover:text-white transition-all cursor-pointer inline-flex items-center"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => triggerDeleteTestimonial(t.id)}
                              className="p-1 px-1.5 bg-rose-50 text-rose-705 hover:bg-rose-950 hover:text-white transition-all cursor-pointer inline-flex items-center"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB 7: SYSTEM CONFIGURATIONS
            ======================================================= */}
        {activeSidebarTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fade-in font-sans">
            
            <div className="md:col-span-12 lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              
              <div className="flex items-center gap-2 border-b pb-3">
                <Database className="h-5 w-5 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                  Cloud connections & synchronizations desk
                </h3>
              </div>

              <form onSubmit={saveSettingsChanges} className="space-y-6">
                <div className="space-y-4 font-normal">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                      Target Google Sheet ID
                    </label>
                    <input
                      type="text"
                      value={spreadsheetId}
                      onChange={(e) => setSpreadsheetId(e.target.value)}
                      placeholder="e.g. 1aBCdEFgHI-jKLmNoPQRsTuvWxYz_12345678"
                      className="w-full border border-slate-200 focus:border-amber-600 px-4 py-3 text-xs font-mono rounded-none outline-none"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block leading-relaxed">Extract from Sheets spreadsheet URL: /d/&lt;_Spreadsheet_ID_&gt;/edit.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                      Inward Warning Alerts Recipient Emails (Separated by commas)
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientEmails}
                      onChange={(e) => setRecipientEmails(e.target.value)}
                      placeholder="e.g. contact@techsol.com.np, hq@techsol.international"
                      className="w-full border border-slate-200 focus:border-amber-600 px-4 py-3 text-xs rounded-none outline-none font-mono"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">Instantly notify designated mill engineering leads upon customer quote applications.</span>
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs tracking-wider uppercase py-3.5 px-6 rounded-none flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Persist setup configurations</span>
                </button>
              </form>

            </div>

            <div className="md:col-span-12 lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center gap-2 border-b pb-3">
                  <KeyRound className="h-5 w-5 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                    Google Sign-In API
                  </h3>
                </div>

                {!googleUser ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-505 text-slate-500 leading-relaxed font-sans">
                      Authenticating with your corporate Google credentials grants active bearer tokens to sync lead records with target Google Sheets and forward automated summaries via the Gmail API.
                    </p>
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full bg-slate-900 hover:bg-amber-500 text-white font-mono font-black text-xs uppercase tracking-wider py-3 px-4 rounded-none inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <KeyRound className="h-4 w-4 text-white" />
                      <span>Authorize Google Account</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5 text-xs font-mono font-normal">
                    <div className="bg-slate-50 border border-slate-100 p-3 flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-slate-900 shrink-0 text-white font-black text-base flex items-center justify-center select-none font-sans font-black">
                        {googleUser.displayName?.charAt(0) || 'G'}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-extrabold text-slate-950 block truncate">{googleUser.displayName}</span>
                        <span className="text-slate-400 text-[10px] block truncate">{googleUser.email}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-110 border-emerald-100 text-emerald-800 p-3 flex items-start gap-2 text-[10px] leading-relaxed">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Security credentials authenticated. Google Sheets syncing routes active under secure sandbox tokens.</span>
                    </div>

                    <button
                      onClick={handleGoogleSignOut}
                      className="w-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-mono font-bold text-2xs cursor-pointer py-2.5 uppercase transition-colors inline-flex justify-center items-center gap-2 border border-slate-200"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>De-authorize Google</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Instructions card */}
              <div className="bg-slate-950 text-white border border-slate-900 p-6 space-y-4 font-mono text-[11px] leading-relaxed">
                <h4 className="text-amber-500 font-black uppercase tracking-wider text-[10px]">Administrative Instructions</h4>
                <p className="text-slate-400 leading-relaxed font-sans text-xs">
                  All images across Products, Services, Blogs, and Testimonials are configured programmatically. Upload your photographs or banners to your personal hosting directory, copy the resulting URL link, and insert them directly inside the respective input panels form!
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900">
                  <span>Host: Tinkune Kathmandu Corp</span>
                  <ImageIcon className="h-4 w-4 text-slate-500" />
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
