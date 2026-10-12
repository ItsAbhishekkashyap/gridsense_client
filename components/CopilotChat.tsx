'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { X, ArrowUp } from 'lucide-react';
import api from '../lib/api';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const QUICK_PROMPTS = [
  { label: 'System status', query: 'What is my overall system status and total panels?' },
  { label: 'Active alerts', query: 'Are there any active alerts or faults?' },
  { label: 'Panel Beta health', query: 'Can you tell me the health of panel beta?' },
  { label: 'Error E01 guide', query: 'What does Error Code E01 mean?' },
];

const OPEN_EVENT = 'gridsense:copilot';

/** Open the copilot from anywhere in the app. */
export function openCopilot() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Inline markdown: **bold** and `code`. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="rounded bg-ink/5 px-1 font-mono text-[.9em]">{part.slice(1, -1)}</code>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

/** Small markdown renderer for copilot replies: tables, lists, headings, paragraphs. */
function RichText({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*\|/.test(line)) {
      const rows: string[] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      const body = rows.filter((r) => !/^\s*\|?\s*:?-{2,}/.test(r));
      const [head, ...rest] = body;
      blocks.push(
        <div key={i} className="my-2 overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            {head && <thead><tr>{cells(head).map((c, k) => <th key={k} className="border-b border-ink/15 py-1.5 pr-3 font-mono text-[10px] font-normal uppercase tracking-[.06em] text-[#5E5A52]"><Inline text={c} /></th>)}</tr></thead>}
            <tbody>{rest.map((r, k) => <tr key={k} className="border-b border-ink/10 last:border-0">{cells(r).map((c, j) => <td key={j} className="py-1.5 pr-3 align-top"><Inline text={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      continue;
    }
    if (/^\s*([-*•]|\d+\.)\s+/.test(line)) {
      const items: string[] = [];
      const ordered = /^\s*\d+\./.test(line);
      while (i < lines.length && /^\s*([-*•]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*•]|\d+\.)\s+/, ''));
      const List = ordered ? 'ol' : 'ul';
      blocks.push(<List key={i} className={`my-1.5 space-y-1 pl-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-sol-deep`}>{items.map((t, k) => <li key={k}><Inline text={t} /></li>)}</List>);
      continue;
    }
    const h = line.match(/^#{1,4}\s+(.*)/);
    if (h) { blocks.push(<p key={i} className="mt-2 font-semibold"><Inline text={h[1]} /></p>); i++; continue; }
    if (line.trim() === '') { i++; continue; }
    blocks.push(<p key={i} className="my-1"><Inline text={line} /></p>);
    i++;
  }
  return <>{blocks}</>;
}

function CopilotMark({ size = 18, color = '#FF5B1F' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" aria-hidden>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am **GridSense Copilot**.\n\nI can analyze live telemetry, search hardware manuals, and troubleshoot inverter faults in real-time. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // open via event, Ctrl/Cmd+K; close via Escape
  useEffect(() => {
    const open = () => setIsOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setIsOpen((o) => !o); }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener(OPEN_EVENT, open); window.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error connecting to the AI Grid backend. Please verify database connection and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Ask Copilot"
          className="group fixed bottom-[88px] right-4 z-40 flex h-14 items-center gap-3 rounded-full bg-bone pl-2 pr-2 text-ink shadow-[0_20px_40px_-12px_rgba(0,0,0,.7)] transition-transform duration-500 ease-expo hover:-translate-y-1 sm:pr-5 lg:bottom-7 lg:right-7 animate-[rise_.8s_cubic-bezier(.16,1,.3,1)_.6s_both]"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-sol">
            <CopilotMark color="#141412" />
            <span className="absolute inset-0 animate-ping rounded-full bg-sol opacity-30" />
          </span>
          <span className="hidden text-[15px] font-semibold sm:inline">Ask Copilot</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="GridSense Copilot">
          <button type="button" aria-label="Close copilot" onClick={() => setIsOpen(false)} className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] animate-fade" />

          <aside className="absolute inset-x-0 bottom-0 top-10 flex flex-col overflow-hidden rounded-t-[20px] bg-paper text-ink shadow-[-30px_0_60px_rgba(0,0,0,.45)] animate-sheet sm:inset-y-0 sm:left-auto sm:right-0 sm:top-0 sm:w-[480px] sm:rounded-none sm:animate-drawer">
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-ink/25 sm:hidden" />
            <header className="flex items-center justify-between border-b border-ink/10 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink"><CopilotMark /></span>
                <div>
                  <h2 className="text-[17px] font-bold">Copilot</h2>
                  <p className="font-mono text-[10px] uppercase tracking-[.08em] text-[#5E5A52]">Live telemetry · Hardware manuals</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close copilot" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-bone">
                <X className="h-[18px] w-[18px]" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6 sm:px-6" aria-live="polite">
              <p className="text-[26px] font-semibold leading-[1.1] tracking-[-.02em]">
                Ask anything about <span className="font-serif font-normal italic text-sol-deep">your roof.</span>
              </p>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex animate-[rise_.45s_cubic-bezier(.16,1,.3,1)_both] ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  <div
                    className={`max-w-[88%] px-4 py-3 text-[15px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-[18px_18px_4px_18px] bg-ink text-bone'
                        : 'rounded-[18px_18px_18px_4px] border border-ink/10 bg-white'
                    }`}
                  >
                    <RichText text={msg.content} />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 rounded-[18px_18px_18px_4px] border border-ink/10 bg-white px-4 py-3 w-fit">
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="absolute inset-0 animate-spin rounded-full border border-dashed border-sol-deep" />
                    <span className="h-2.5 w-2.5 rounded-full bg-sol" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[.08em] text-sol-deep">Reading the grid…</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-3 sm:px-6">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSend(prompt.query)}
                  className="h-9 shrink-0 rounded-full border border-ink/20 px-3.5 text-[13px] font-medium transition-colors hover:bg-ink hover:text-bone disabled:opacity-40"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="mx-5 mb-[max(20px,env(safe-area-inset-bottom))] flex items-center gap-2 rounded-full border border-ink/15 bg-white py-1.5 pl-5 pr-1.5 transition-colors focus-within:border-sol sm:mx-6 sm:mb-6"
            >
              <label htmlFor="copilot-input" className="sr-only">Message</label>
              <input
                id="copilot-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about panels, alerts, or hardware…"
                className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink/40"
                disabled={isLoading}
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sol transition-transform active:scale-95 disabled:opacity-35"
              >
                <ArrowUp className="h-[18px] w-[18px]" />
              </button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
