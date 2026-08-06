import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GeminiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const GeminiCopilotModal: React.FC<GeminiCopilotModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Hello! I am MindSparQ Gemini AI Copilot. I can assist you with ADB remote administration, automated scripts, device diagnostics, logcat security audits, and system optimization. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'How do I view connected ADB devices?',
    'Generate ADB script to take screenshot & pull file',
    'Explain logcat log levels and security filtering',
    'Optimize device battery and kill high CPU processes',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to backend Gemini API endpoint
      const formattedHistory = [...messages, userMsg].map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to communicate with Gemini AI');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'I analyzed your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Gemini Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to connect to Gemini AI services.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`w-full max-w-2xl h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${
            theme === 'dark'
              ? 'bg-[#12192b] border-white/10 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white shadow-md flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">sparkles</span>
              </div>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  Gemini AI Copilot
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    Pro Model
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Android Remote Admin & Diagnostics AI Assistant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 text-sm shadow-sm">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : theme === 'dark'
                      ? 'bg-[#1c273e] text-slate-100 border border-white/5 rounded-bl-none'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                  <div
                    className={`text-[10px] mt-1.5 text-right font-mono ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs shadow-sm font-bold">
                    YOU
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 text-sm animate-pulse">
                  <span className="material-symbols-outlined text-sm">sparkles</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#1c273e] text-slate-500 text-xs flex items-center gap-2 border border-slate-200 dark:border-white/5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  Gemini is thinking and analyzing ADB telemetry...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          {messages.length <= 2 && (
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-200/50 dark:border-white/5 bg-slate-50/30 dark:bg-black/10">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemini Copilot anything about ADB, logs, or device scripts..."
                className="flex-1 px-4 py-3 text-sm rounded-xl bg-white dark:bg-[#182238] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-md shrink-0"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
