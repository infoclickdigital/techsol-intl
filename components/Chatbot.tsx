'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  ArrowRight,
  ShieldCheck,
  Info,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  
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
    'Machinery consulting?'
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
              text: 'Namaste! Welcome to Techsol International. We supply premium food flavours, functional ingredients, and machinery consulting services across Nepal. How can I help you today?' 
            },
            {
              role: 'user',
              text: `My contact details:\nName: ${parsed.name}\nPhone: ${parsed.phone}\nAddress: ${parsed.address}`
            },
            {
              role: 'assistant',
              text: `Thank you, ${parsed.name}! How can we support your food or beverage production today?`
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
        text: 'Namaste! Welcome to Techsol International. We supply premium food flavours, functional ingredients, and machinery consulting across Nepal. How can I assist you today?' 
      }
    ]);
  }, []);

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
        text: 'Namaste! Welcome to Techsol International. We supply premium food flavours, functional ingredients, and machinery consulting across Nepal. How can I assist you today?' 
      },
      {
        role: 'user',
        text: `My contact details:\nName: ${contact.name}\nPhone: ${contact.phone}\nAddress: ${contact.address}`
      },
      {
        role: 'assistant',
        text: `Thank you, ${contact.name}! I have noted your details. How can I support your project or flavour requirements today?`
      }
    ];

    setMessages(initialMessages);

    // Track lead registration in database
    try {
      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          name: contact.name,
          phone: contact.phone,
          address: contact.address,
          industry: 'Industrial Client',
          machineInquiry: 'Chatbot intake filled',
          description: `User connected through AI Adviser chat.`,
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

        await fetch('/api/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'chat',
            name: userName || 'Advisory Client',
            phone: userPhone || 'Registered',
            address: userAddress || 'Nepal',
            industry: 'Assistant Query',
            machineInquiry: 'Chat Conversation',
            description: `Query: "${userMsg}". Response: "${data.text.substring(0, 100)}"`,
            chatHistory: updatedMsgs
          })
        });
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting right now. Please call our team directly at 9851218867 or email contact@techsol.com.np.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'A network interruption occurred. Please reach our team at 9851218867 or contact@techsol.com.np.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    localStorage.removeItem('techsol_chat_contact');
    setIsRegistered(false);
    setUserName('');
    setUserPhone('');
    setUserAddress('');
    setMessages([
      { 
        role: 'assistant', 
        text: 'Namaste! Welcome to Techsol International. We supply premium food flavours, functional ingredients, and machinery consulting across Nepal. How can I assist you today?' 
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans text-slate-900 antialiased select-text">
      
      {/* Floating Action Button (Iconic Modern Chat Bot FAB) */}
      <motion.button
        id="chatbot-floating-toggle"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-full shadow-xl shadow-amber-600/30 hover:shadow-2xl hover:shadow-amber-600/40 border border-amber-400/30 flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 relative"
        title={isOpen ? "Close chat" : "Chat with us"}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="h-6 w-6 text-white fill-white/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Status Indicator Dot on corner when closed */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#22C55E] ring-2 ring-white"></span>
          </span>
        )}
      </motion.button>

      {/* Main Expanded Chat Interface (Crisp Light Theme) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed !max-w-none bottom-22 left-4 right-4 sm:absolute sm:bottom-18 sm:right-0 sm:left-auto w-auto sm:w-[410px] h-[75vh] sm:h-[580px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden z-[101]"
          >
            
            {/* Header Banner */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 border border-amber-200/60 shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {/* Subtle green pulsing live-status indicator dot */}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      Techsol AI Assistant
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Flavours, Ingredients & Machinery Help
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={clearChatHistory}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Conditional Intake Form / Conversation Panel */}
            {!isRegistered ? (
              <form onSubmit={handleRegister} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white flex flex-col justify-center">
                <div className="space-y-1.5 text-center mb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Welcome! How can we help?
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto">
                    Please provide your contact details so our advisers can best assist your food production requirements.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Sunil Shrestha"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm text-slate-900 px-3.5 min-h-[44px] outline-none placeholder-slate-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="e.g. 98XXXXXXXX"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm text-slate-900 px-3.5 min-h-[44px] outline-none placeholder-slate-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Factory or Office Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      placeholder="e.g. Biratnagar or Kathmandu"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm text-slate-900 px-3.5 min-h-[44px] outline-none placeholder-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-3 w-full min-h-[44px] bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold py-3 px-4 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Start Conversation</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <>
                {/* Chat Body & Scroll Canvas */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 select-text"
                >
                  
                  {/* Informative Label */}
                  <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl flex gap-2.5 w-full text-xs text-amber-900 leading-relaxed">
                    <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      Ask us about bakery flavours, beverage powders, dairy compounds, savoury seasonings, or plant equipment consulting.
                    </p>
                  </div>

                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3.5 text-xs sm:text-sm leading-relaxed rounded-2xl shadow-xs ${
                        msg.role === 'user' 
                          ? 'bg-slate-900 text-white rounded-br-none ml-6 font-normal' 
                          : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none mr-6 font-normal'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {/* Bot Loading Dots */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selection suggestions */}
                {messages.length === 3 && !loading && (
                  <div className="px-4 py-2 bg-white border-t border-slate-100 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                      Suggested questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="min-h-[44px] text-xs text-slate-700 hover:text-amber-700 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left"
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
                  className="bg-white border-t border-slate-200 p-3 flex gap-2 shrink-0 items-center"
                >
                  <input
                    type="text"
                    required
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 px-3.5 min-h-[44px] outline-none focus:border-amber-500 focus:bg-white placeholder-slate-400"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="min-h-[44px] min-w-[44px] bg-amber-600 hover:bg-amber-500 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}

            {/* Bottom Certification Info */}
            <div className="bg-slate-50 border-t border-slate-200 py-2 px-4 text-center flex items-center justify-center gap-1.5 select-none text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Direct Support from Techsol International</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

