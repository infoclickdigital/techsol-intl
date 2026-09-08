'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Flame, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  
  // User Registration State
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Food flavour samples?',
    'Custom flavour creation?',
    'Functional ingredients list?',
    'Machine consulting services?'
  ];

  // Load Cached User Info if it exists
  useEffect(() => {
    const cached = localStorage.getItem('techsol_chat_contact');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.name && parsed.phone && parsed.address) {
          setUserName(parsed.name);
          setUserPhone(parsed.phone);
          setUserAddress(parsed.address);
          setIsRegistered(true);
          
          setMessages([
            { 
              role: 'assistant', 
              text: 'Namaste! Welcome to Techsol International. 🧪 We supply premium food flavours, functional ingredients, and expert machine consulting services across Nepal. How can I assist you with your food or beverage production requirements today?' 
            },
            {
              role: 'user',
              text: `My contact details:\n👤 Name: ${parsed.name}\n📞 Phone: ${parsed.phone}\n📍 Address: ${parsed.address}`
            },
            {
              role: 'assistant',
              text: `Dhanyabad (Thank you), ${parsed.name}! I have linked your profile to this session. Let's begin our conversation. How can I support your project today?`
            }
          ]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    // Default initial message if not registered yet
    setMessages([
      { 
        role: 'assistant', 
        text: 'Namaste! Welcome to Techsol International. 🧪 We supply premium food flavours, functional ingredients, and expert machine consulting services across Nepal. How can I assist you with your food or beverage production requirements today?' 
      }
    ]);
  }, []);

  useEffect(() => {
    // Show welcome greeting bubble after 1.5 seconds if chatbot is closed
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowWelcomeBubble(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom of message list on new stream
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || !userAddress.trim()) return;

    const contact = {
      name: userName.trim(),
      phone: userPhone.trim(),
      address: userAddress.trim()
    };

    localStorage.setItem('techsol_chat_contact', JSON.stringify(contact));
    setIsRegistered(true);

    const initialMessages: ChatMessage[] = [
      { 
        role: 'assistant', 
        text: 'Namaste! Welcome to Techsol International. 🧪 We supply premium food flavours, functional ingredients, and expert machine consulting services across Nepal. How can I assist you with your food or beverage production requirements today?' 
      },
      {
        role: 'user',
        text: `My contact details:\n👤 Name: ${contact.name}\n📞 Phone: ${contact.phone}\n📍 Address: ${contact.address}`
      },
      {
        role: 'assistant',
        text: `Dhanyabad (Thank you), ${contact.name}! I have saved your details in this chat. How can I support your production line or flavour requirements today?`
      }
    ];

    setMessages(initialMessages);

    // Track lead registration instantly in our database
    try {
      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          name: contact.name,
          phone: contact.phone,
          address: contact.address,
          industry: 'Industrial Brand Client',
          machineInquiry: 'Chatbot intake filled',
          description: `User verified details & initiated AI agent chat portal.`,
          chatHistory: initialMessages
        })
      });
    } catch (err) {
      console.error("Failed to post registration lead:", err);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setLoading(true);
    setShowWelcomeBubble(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedMsgs: ChatMessage[] = [...messages, { role: 'user', text: userMsg }, { role: 'assistant', text: data.text }];
        setMessages(updatedMsgs);

        // Dynamic CRM lead transaction logging to PostgreSQL
        await fetch('/api/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'chat',
            name: userName || 'Registered Advisory Client',
            phone: userPhone || 'Registered',
            address: userAddress || 'Registered Portal',
            industry: 'Interactive Assistant Query',
            machineInquiry: 'Chat Conversation Stream',
            description: `Query: "${userMsg}". Response: "${data.text.substring(0, 100)}"`,
            chatHistory: updatedMsgs
          })
        });
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting right now. Let me coordinate with our desk at Tinkune sales office.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'A network interruption occurred. Please reach our engineers at contact@techsol.com.np.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    // Clear registration and chat history so they can change name/re-register if needed
    localStorage.removeItem('techsol_chat_contact');
    setIsRegistered(false);
    setUserName('');
    setUserPhone('');
    setUserAddress('');
    setMessages([
      { 
        role: 'assistant', 
        text: 'Namaste! Welcome to Techsol International. 🧪 We supply premium food flavours, functional ingredients, and expert machine consulting services across Nepal. How can I assist you with your food or beverage production requirements today?' 
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans text-slate-800 antialiased select-text">
      
      {/* 1. Closed State Welcoming Speech Bubble */}
      <AnimatePresence>
        {showWelcomeBubble && !isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 right-2 w-72 !max-w-none bg-slate-950 text-white p-4 shadow-2xl border border-slate-800 text-xs rounded-none mb-3"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="flex items-center gap-1.5 font-mono text-[9px] text-amber-500 uppercase font-black">
                <Sparkles className="h-3 w-3 animate-pulse" />
                <span>Techsol Expert Advisor</span>
              </span>
              <button 
                onClick={() => setShowWelcomeBubble(false)}
                className="text-slate-450 hover:text-white cursor-pointer"
                title="Dismiss greeting"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="leading-relaxed text-slate-200">
              Need premium powder or liquid food flavours, custom spice seasonings, or food production line layouts? Let&apos;s brainstorm your formulation!
            </p>
            <div className="mt-2.5 flex justify-end">
              <button 
                onClick={() => { setIsOpen(true); setShowWelcomeBubble(false); }}
                className="text-[9px] font-mono tracking-wider text-amber-500 hover:text-white flex items-center gap-1 uppercase font-black cursor-pointer"
              >
                <span>Initialize Advisor</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Base Button */}
      <motion.button
        id="chatbot-floating-toggle"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setIsOpen(!isOpen); setShowWelcomeBubble(false); }}
        className="w-14 h-14 bg-slate-950 hover:bg-amber-600 text-white rounded-none shadow-2xl border border-slate-800 flex items-center justify-center transition-colors duration-200 cursor-pointer relative"
        title="Open Industrial Expert AI Chat"
        aria-label="Toggle Industrial Advisor"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="h-6 w-6 text-white animate-none" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 border border-slate-950 rounded-none animate-ping"></span>
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 border border-slate-950 rounded-none"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 3. Main Expanded Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed !max-w-none bottom-24 left-4 right-4 sm:absolute sm:bottom-18 sm:right-0 sm:left-auto w-auto sm:w-[400px] h-[72vh] sm:h-[560px] bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden z-[101]"
          >
            
            {/* Header Banner */}
            <div className="bg-slate-950 border-b border-slate-800 p-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-600/10 p-2 border border-amber-600/20 text-amber-500">
                  <Flame className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold">
                    Techsol Advisor
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse inline-block"></span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Ingredients & Machinery Support</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChatHistory}
                  className="text-[9px] font-mono text-slate-500 hover:text-white uppercase transition-colors px-2 py-1 bg-slate-900 border border-slate-800 cursor-pointer"
                  title="Clear conversation logs"
                >
                  Reset Tab
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Hide panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conditional Intake Form / Conversation Panel */}
            {!isRegistered ? (
              <form onSubmit={handleRegister} className="flex-1 overflow-y-auto p-5 pb-8 space-y-4 bg-slate-950 flex flex-col justify-center">
                <div className="space-y-1.5 text-center mb-1">
                  <h4 className="text-amber-500 font-mono text-[9px] tracking-widest uppercase font-black">
                     Industrial Advisory Portal
                  </h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Please share your details to activate Techsol&apos;s AI consultation.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g., Sunil Shrestha"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-none text-xs text-white px-3 py-2.5 outline-none placeholder-slate-600 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="e.g., 98XXXXXXXX"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-none text-xs text-white px-3 py-2.5 outline-none placeholder-slate-600 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
                      Factory / Office Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      placeholder="e.g., Tinkune, Kathmandu"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-none text-xs text-white px-3 py-2.5 outline-none placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 bg-amber-600 hover:bg-amber-500 text-white font-mono uppercase text-[10px] tracking-wider py-3 px-4 rounded-none transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer font-bold shrink-0 shadow-lg"
                >
                  <span>Start Live Session</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </form>
            ) : (
              <>
                {/* Chat Body & Scroll Canvas */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 select-text scrollbar-thin scrollbar-thumb-slate-800"
                >
                  
                  {/* Informative Label */}
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-none flex gap-2 w-full text-[10px] text-slate-400 leading-normal">
                    <Info className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p>
                      Ask us about specialized bakery, beverage, beverage powder, dairy components, savoury taste agents, or production line consulting.
                    </p>
                  </div>

                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3 text-xs leading-relaxed rounded-md ${
                        msg.role === 'user' 
                          ? 'bg-amber-600 text-white rounded-br-none ml-6 font-normal selection:bg-slate-950' 
                          : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none mr-6 select-text font-normal'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {/* Bot Loading Dots */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-none flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selection suggestions */}
                {messages.length === 3 && !loading && (
                  <div className="px-4 pb-2.5 shrink-0">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                      Suggested inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-[10px] font-mono text-slate-400 hover:text-amber-500 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500 px-2 py-1 transition-all duration-150 cursor-pointer text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Input Dock */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
                  className="bg-slate-950 border-t border-slate-850 p-3.5 flex gap-2 shrink-0 items-center"
                >
                  <input
                    type="text"
                    required
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message Advisor..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-none text-xs text-white px-3.5 py-3.5 outline-none focus:border-amber-500 placeholder-slate-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-900 text-white disabled:text-slate-650 p-3.5 rounded-none transition-colors duration-150 cursor-pointer"
                    aria-label="Send query"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}

            {/* Bottom Certification Info */}
            <div className="bg-slate-900 border-t border-slate-850 py-1.5 px-4 text-center flex items-center justify-center gap-1.5 select-none font-mono text-[8px] text-slate-500 uppercase">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Standard Food-Grade Certification Support</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
