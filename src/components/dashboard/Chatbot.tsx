"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    X,
    Send,
    AlertTriangle,
    Loader2,
    ChevronDown,
    Siren,
    ShieldOff,
    Zap,
    Activity,
    Users,
    Car,
    RotateCcw,
    Sparkles,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isError?: boolean;
}

interface EmergencyAction {
    type: "activate" | "deactivate";
    level?: number;
    zones?: string[];
    message: string;
}

interface EmergencyState {
    active: boolean;
    level: number | null;
    message: string;
    zones: string[];
}

// ── Default Question Bubbles ───────────────────────────────────────────────────
const DEFAULT_QUESTIONS = [
    { label: "Current Status", text: "What is the current system status overview?", icon: Activity },
    { label: "Active Alerts", text: "What are the active alerts and what should I do?", icon: AlertTriangle },
    { label: "Fleet Status", text: "Give me the shuttle fleet status and any issues.", icon: Car },
    { label: "Zone Risk", text: "Which zones are at high risk right now?", icon: Zap },
    { label: "Population", text: "How is the campus population distributed?", icon: Users },
    { label: "Emergency", text: "Walk me through the emergency protocol options.", icon: Siren },
];

// ── Emergency Level Config ─────────────────────────────────────────────────────
const EMERGENCY_LEVELS: Record<number, { label: string; color: string; bg: string; border: string }> = {
    1: { label: "CRITICAL", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.3)" },
    2: { label: "HIGH ALERT", color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.3)" },
    3: { label: "CAUTION", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.3)" },
};

// ── Markdown-like renderer ─────────────────────────────────────────────────────
function renderMessage(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
        if (line.startsWith("### ")) {
            return <h4 key={i} className="text-[11px] font-semibold tracking-wider uppercase text-cyan/80 mt-3 mb-1">{line.slice(4)}</h4>;
        }
        if (line.startsWith("## ")) {
            return <h3 key={i} className="text-xs font-bold text-text-primary mt-3 mb-1">{line.slice(3)}</h3>;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
            const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, '<code class="bg-surface-elevated px-1 rounded text-cyan text-[10px]">$1</code>');
            return (
                <div key={i} className="flex items-start gap-2 my-0.5">
                    <span className="w-1 h-1 rounded-full bg-cyan/50 mt-2 flex-shrink-0" />
                    <span className="text-xs text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            );
        }
        if (/^\d+\. /.test(line)) {
            const num = line.match(/^(\d+)\./)?.[1];
            const content = line.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return (
                <div key={i} className="flex items-start gap-2 my-0.5">
                    <span className="text-[10px] font-mono text-cyan/70 mt-0.5 w-4 flex-shrink-0">{num}.</span>
                    <span className="text-xs text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            );
        }
        if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
            return <p key={i} className="text-xs font-semibold text-text-primary my-1">{line.slice(2, -2)}</p>;
        }
        if (line.trim() === "") {
            return <div key={i} className="h-1.5" />;
        }
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, '<code class="bg-surface-elevated px-1 rounded text-cyan text-[10px]">$1</code>');
        return <p key={i} className="text-xs text-text-secondary leading-relaxed my-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
}

// ── Main Chatbot Component ─────────────────────────────────────────────────────
export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [emergency, setEmergency] = useState<EmergencyState>({ active: false, level: null, message: "", zones: [] });
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{
                role: "assistant",
                content: "**AathraOS Command AI online.**\n\nI have full visibility into campus operations. I can help you with:\n- Real-time status & alerts\n- Emergency situation assessment\n- Alternative action suggestions\n- Emergency protocol activation\n\nWhat would you like to know?",
                timestamp: new Date(),
            }]);
        }
    }, [open, messages.length]);

    // Auto-scroll
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Scroll detection
    const handleScroll = () => {
        const el = scrollAreaRef.current;
        if (!el) return;
        setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
    };

    // Send message
    const sendMessage = useCallback(async (text?: string) => {
        const msgText = (text ?? input).trim();
        if (!msgText || loading) return;

        const userMsg: Message = { role: "user", content: msgText, timestamp: new Date() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
            });

            const data = await res.json();

            if (!res.ok) {
                setHasApiKey(false);
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: data.error || "An error occurred. Please check the API configuration.",
                    timestamp: new Date(),
                    isError: true,
                }]);
            } else {
                // Handle emergency action
                if (data.emergencyAction) {
                    const action: EmergencyAction = data.emergencyAction;
                    if (action.type === "activate" && action.level) {
                        setEmergency({ active: true, level: action.level, message: action.message, zones: action.zones ?? [] });
                    } else if (action.type === "deactivate") {
                        setEmergency({ active: false, level: null, message: action.message, zones: [] });
                    }
                }

                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: data.text,
                    timestamp: new Date(),
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Connection failed. Please check your network and try again.",
                timestamp: new Date(),
                isError: true,
            }]);
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [input, messages, loading]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setEmergency({ active: false, level: null, message: "", zones: [] });
    };

    const emergencyConfig = emergency.level ? EMERGENCY_LEVELS[emergency.level] : null;

    return (
        <>
            {/* ── Emergency Banner (global, outside chat) ── */}
            <AnimatePresence>
                {emergency.active && emergencyConfig && (
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-2.5"
                        style={{ background: emergencyConfig.bg, borderBottom: `1px solid ${emergencyConfig.border}` }}
                    >
                        <div className="flex items-center gap-3">
                            <Siren size={16} style={{ color: emergencyConfig.color }} className="animate-pulse" />
                            <span className="text-xs font-bold tracking-widest" style={{ color: emergencyConfig.color }}>
                                EMERGENCY {emergencyConfig.label}
                            </span>
                            {emergency.zones.length > 0 && (
                                <span className="text-[10px] text-text-muted">
                                    — Affected: {emergency.zones.join(", ")}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setEmergency({ active: false, level: null, message: "", zones: [] })}
                            className="text-[10px] font-medium px-3 py-1 rounded border transition-all hover:opacity-80"
                            style={{ color: emergencyConfig.color, borderColor: emergencyConfig.border }}
                        >
                            Dismiss
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Floating Toggle Bubble ── */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        id="chatbot-toggle-btn"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
                        style={{
                            background: "linear-gradient(135deg, #06d6f2 0%, #0891b2 100%)",
                            boxShadow: "0 0 30px rgba(6,214,242,0.35), 0 8px 32px rgba(0,0,0,0.4)",
                        }}
                    >
                        <Bot size={24} className="text-background" />
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full animate-ping opacity-20"
                            style={{ background: "rgba(6,214,242,0.4)" }} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Chat Panel ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="chatbot-panel"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 280, damping: 28 }}
                        className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
                        style={{
                            width: "380px",
                            height: "600px",
                            background: "linear-gradient(135deg, rgba(18,18,26,0.97) 0%, rgba(26,26,38,0.97) 100%)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                            border: emergency.active && emergencyConfig
                                ? `1px solid ${emergencyConfig.border}`
                                : "1px solid rgba(6,214,242,0.15)",
                            boxShadow: emergency.active && emergencyConfig
                                ? `0 0 40px ${emergencyConfig.color}20, 0 24px 64px rgba(0,0,0,0.6)`
                                : "0 0 40px rgba(6,214,242,0.08), 0 24px 64px rgba(0,0,0,0.6)",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                            style={{ borderColor: "rgba(255,255,255,0.06)" }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, rgba(6,214,242,0.2) 0%, rgba(8,145,178,0.1) 100%)" }}
                                    >
                                        {emergency.active
                                            ? <Siren size={16} style={{ color: emergencyConfig?.color }} className="animate-pulse" />
                                            : <Bot size={16} className="text-cyan" />
                                        }
                                    </div>
                                    <span
                                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                                        style={{ background: "#34d399", borderColor: "#12121a" }}
                                    />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-text-primary leading-tight flex items-center gap-1.5">
                                        Command AI
                                        <Sparkles size={10} className="text-cyan/60" />
                                    </div>
                                    <div className="text-[10px] text-text-muted">
                                        {emergency.active && emergencyConfig
                                            ? <span style={{ color: emergencyConfig.color }}>⚠ {emergencyConfig.label} Active</span>
                                            : "AathraOS Operations Intelligence"
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={clearChat}
                                    title="Clear chat"
                                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-all"
                                >
                                    <RotateCcw size={13} />
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Emergency status strip */}
                        {emergency.active && emergencyConfig && (
                            <div
                                className="flex items-center justify-between px-4 py-2 flex-shrink-0"
                                style={{ background: emergencyConfig.bg }}
                            >
                                <div className="flex items-center gap-2">
                                    <Siren size={12} style={{ color: emergencyConfig.color }} />
                                    <span className="text-[10px] font-bold" style={{ color: emergencyConfig.color }}>
                                        {emergency.message}
                                    </span>
                                </div>
                                <button
                                    onClick={() => sendMessage("deactivate emergency all clear")}
                                    className="text-[9px] font-medium px-2 py-0.5 rounded flex items-center gap-1 transition-opacity hover:opacity-70"
                                    style={{ color: emergencyConfig.color, border: `1px solid ${emergencyConfig.border}` }}
                                >
                                    <ShieldOff size={9} />
                                    Deactivate
                                </button>
                            </div>
                        )}

                        {/* Messages */}
                        <div
                            ref={scrollAreaRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                        >
                            {/* API key warning */}
                            {!hasApiKey && (
                                <div
                                    className="rounded-xl p-3 text-xs text-warning/80"
                                    style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
                                >
                                    <strong className="block mb-1">⚠ API Key Required</strong>
                                    Add <code className="bg-surface-elevated px-1 rounded text-[10px]">GEMINI_API_KEY=your_key</code> to your{" "}
                                    <code className="bg-surface-elevated px-1 rounded text-[10px]">.env.local</code> file and restart the server.
                                </div>
                            )}

                            {/* Default question bubbles (show if only greeting) */}
                            {messages.length <= 1 && (
                                <div className="space-y-2">
                                    <p className="text-[10px] text-text-muted text-center font-medium tracking-wider uppercase">
                                        Quick Questions
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {DEFAULT_QUESTIONS.map((q) => {
                                            const Icon = q.icon;
                                            return (
                                                <button
                                                    key={q.label}
                                                    id={`chatbot-quick-${q.label.toLowerCase().replace(/\s+/g, "-")}`}
                                                    onClick={() => sendMessage(q.text)}
                                                    disabled={loading}
                                                    className="flex flex-col items-start gap-1 p-3 rounded-xl text-left transition-all group disabled:opacity-50"
                                                    style={{
                                                        background: "rgba(255,255,255,0.03)",
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                    }}
                                                    onMouseEnter={e => {
                                                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,214,242,0.2)";
                                                        (e.currentTarget as HTMLElement).style.background = "rgba(6,214,242,0.04)";
                                                    }}
                                                    onMouseLeave={e => {
                                                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                                                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                                                    }}
                                                >
                                                    <Icon size={14} className="text-cyan/70 group-hover:text-cyan transition-colors" />
                                                    <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                                                        {q.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "assistant" && (
                                        <div
                                            className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"
                                            style={{ background: "rgba(6,214,242,0.1)" }}
                                        >
                                            <Bot size={12} className="text-cyan" />
                                        </div>
                                    )}
                                    <div
                                        className="max-w-[85%] rounded-2xl px-4 py-3"
                                        style={
                                            msg.role === "user"
                                                ? {
                                                    background: "linear-gradient(135deg, #06d6f2 0%, #0891b2 100%)",
                                                    color: "#0a0a0f",
                                                    borderBottomRightRadius: 4,
                                                }
                                                : msg.isError
                                                    ? {
                                                        background: "rgba(248,113,113,0.08)",
                                                        border: "1px solid rgba(248,113,113,0.2)",
                                                        borderBottomLeftRadius: 4,
                                                    }
                                                    : {
                                                        background: "rgba(255,255,255,0.04)",
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                        borderBottomLeftRadius: 4,
                                                    }
                                        }
                                    >
                                        {msg.role === "user" ? (
                                            <p className="text-xs font-medium">{msg.content}</p>
                                        ) : (
                                            <div className="space-y-0.5">{renderMessage(msg.content)}</div>
                                        )}
                                        <div
                                            className={`text-[9px] mt-2 ${msg.role === "user" ? "text-background/60 text-right" : "text-text-muted/60"}`}
                                        >
                                            {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(6,214,242,0.1)" }}
                                    >
                                        <Loader2 size={12} className="text-cyan animate-spin" />
                                    </div>
                                    <div
                                        className="px-4 py-3 rounded-2xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderBottomLeftRadius: 4 }}
                                    >
                                        <div className="flex gap-1 items-center h-4">
                                            {[0, 1, 2].map(i => (
                                                <motion.span
                                                    key={i}
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                                    className="w-1.5 h-1.5 rounded-full bg-cyan/60"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to bottom button */}
                        <AnimatePresence>
                            {showScrollBtn && (
                                <motion.button
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-[72px] right-4 w-7 h-7 rounded-full flex items-center justify-center shadow-lg z-10"
                                    style={{ background: "rgba(6,214,242,0.15)", border: "1px solid rgba(6,214,242,0.3)" }}
                                >
                                    <ChevronDown size={14} className="text-cyan" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Input area */}
                        <div
                            className="p-4 flex-shrink-0 border-t"
                            style={{ borderColor: "rgba(255,255,255,0.06)" }}
                        >
                            <div
                                className="flex items-end gap-2 rounded-xl p-2 transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <textarea
                                    ref={inputRef}
                                    id="chatbot-input"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about status, alerts, or type a command…"
                                    rows={1}
                                    disabled={loading}
                                    className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted/50 resize-none outline-none leading-relaxed py-1.5 px-2 disabled:opacity-50"
                                    style={{ maxHeight: "96px", minHeight: "32px" }}
                                    onInput={e => {
                                        const el = e.currentTarget;
                                        el.style.height = "auto";
                                        el.style.height = Math.min(el.scrollHeight, 96) + "px";
                                    }}
                                />
                                <button
                                    id="chatbot-send-btn"
                                    onClick={() => sendMessage()}
                                    disabled={loading || !input.trim()}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                                    style={{
                                        background: input.trim() ? "linear-gradient(135deg, #06d6f2, #0891b2)" : "rgba(255,255,255,0.06)",
                                    }}
                                >
                                    {loading ? (
                                        <Loader2 size={14} className="text-cyan animate-spin" />
                                    ) : (
                                        <Send size={14} className={input.trim() ? "text-background" : "text-text-muted"} />
                                    )}
                                </button>
                            </div>
                            <p className="text-[9px] text-text-muted/40 text-center mt-2">
                                Type "activate emergency level 1" to trigger protocols • Enter to send
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
