'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Zap, ShieldAlert, Wrench, ChevronRight } from 'lucide-react';
import api from '../lib/api';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const QUICK_PROMPTS = [
  { label: 'System Status', icon: Zap, query: 'What is my overall system status and total panels?' },
  { label: 'Active Alerts', icon: ShieldAlert, query: 'Are there any active alerts or faults?' },
  { label: 'Panel Beta Health', icon: Sparkles, query: 'Can you tell me the health of panel beta?' },
  { label: 'Error E01 Guide', icon: Wrench, query: 'What does Error Code E01 mean?' },
];

export function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hello! I am **GridSense AI Copilot**.\n\nI can analyze live telemetry, search hardware manuals, and troubleshoot inverter faults in real-time. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/copilot/chat', {
        messages: [...messages.filter((m) => m.role !== 'system'), userMessage],
      });

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.data.message },
        ]);
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ I encountered an error connecting to the AI Grid backend. Please verify database connection and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window Container */}
      {isOpen && (
        <div className="mb-4 w-[400px] h-[580px] glass-panel border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-orange-900/30 p-4 flex justify-between items-center border-b border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-100 tracking-tight">GridSense Copilot</h3>
                  <span className="text-[10px] font-semibold tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    AI AGENT
                  </span>
                </div>
                <p className="text-xs text-slate-400">Live Telemetry & Hardware RAG</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/50 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {QUICK_PROMPTS.map((prompt, i) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSend(prompt.query)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 rounded-full px-3 py-1 whitespace-nowrap transition-all hover:border-blue-500/40 shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                  {prompt.label}
                </button>
              );
            })}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950/60 to-slate-900/80">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                      : 'bg-slate-800 border border-slate-700/60 text-blue-400'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20 font-medium'
                      : 'bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-800/80 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                  <span className="text-xs text-blue-400 font-semibold tracking-wide uppercase animate-pulse">Analyzing Grid Data</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 backdrop-blur-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-1.5 focus-within:border-blue-500/60 transition-all focus-within:ring-2 focus-within:ring-blue-500/20"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about panels, alerts, or hardware..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 px-3 py-1.5 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-900/30 shrink-0 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white rounded-full p-4 shadow-2xl shadow-blue-600/40 flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-400 rounded-full animate-ping" />
          </div>
          <span className="font-bold text-sm tracking-tight pr-1">
            Ask AI Copilot
          </span>
          <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}
