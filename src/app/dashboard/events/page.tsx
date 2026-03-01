"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, MapPin, Users, Clock, Plus, AlertCircle,
    X, Loader2, Sparkles, ChevronRight, AlertTriangle,
    Zap, Car, ShieldCheck, TrendingUp, Activity,
    CheckCircle2, Info, Siren, BarChart3, ArrowRight, Play,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface CampusEvent {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    attendees: number;
    type: string;
    description: string;
    impact: "low" | "medium" | "high" | "critical";
    status: "upcoming" | "planning" | "active" | "completed";
    aiAnalyzed: boolean;
    insights?: string;
}

// ── Seed events ────────────────────────────────────────────────────────────────
const SEED_EVENTS: CampusEvent[] = [
    {
        id: "e1",
        name: "Annual Tech Summit",
        date: "2026-03-05",
        startTime: "09:00",
        endTime: "18:00",
        venue: "Hub Central Auditorium",
        attendees: 2500,
        type: "Conference",
        description: "Annual technology conference with keynotes, workshops, and networking sessions.",
        impact: "high",
        status: "upcoming",
        aiAnalyzed: false,
    },
    {
        id: "e2",
        name: "Campus Marathon",
        date: "2026-03-08",
        startTime: "06:00",
        endTime: "12:00",
        venue: "Main Campus Loop",
        attendees: 800,
        type: "Sports",
        description: "Annual campus 10K marathon around the main loop. Road closures required.",
        impact: "medium",
        status: "planning",
        aiAnalyzed: false,
    },
    {
        id: "e3",
        name: "Career Fair",
        date: "2026-03-12",
        startTime: "10:00",
        endTime: "16:00",
        venue: "Exhibition Hall",
        attendees: 3000,
        type: "Career",
        description: "Annual career fair with 120+ companies. Staggered entry via Gate A and C.",
        impact: "high",
        status: "upcoming",
        aiAnalyzed: false,
    },
    {
        id: "e4",
        name: "Cultural Night",
        date: "2026-03-15",
        startTime: "17:00",
        endTime: "22:00",
        venue: "Open Air Theater",
        attendees: 1500,
        type: "Cultural",
        description: "Annual cultural fest with performances, food stalls, and exhibitions.",
        impact: "medium",
        status: "planning",
        aiAnalyzed: false,
    },
];

const VENUES = [
    "Hub Central Auditorium",
    "Main Campus Loop",
    "Exhibition Hall",
    "Open Air Theater",
    "North Auditorium",
    "Sports Complex",
    "Block C Seminar Hall",
    "Parking Ground (Temporary)",
];

const EVENT_TYPES = ["Conference", "Sports", "Career", "Cultural", "Academic", "Workshop", "Seminar", "Government", "Other"];

const impactColor = { low: "#34d399", medium: "#fbbf24", high: "#f87171", critical: "#f87171" };
const impactBg = { low: "rgba(52,211,153,0.08)", medium: "rgba(251,191,36,0.08)", high: "rgba(248,113,113,0.08)", critical: "rgba(248,113,113,0.12)" };
const impactBorder = { low: "rgba(52,211,153,0.2)", medium: "rgba(251,191,36,0.2)", high: "rgba(248,113,113,0.2)", critical: "rgba(248,113,113,0.3)" };
const statusColor: Record<string, string> = { upcoming: "#06d6f2", planning: "#9ca3af", active: "#34d399", completed: "#6b7280" };
const statusBg: Record<string, string> = { upcoming: "rgba(6,214,242,0.08)", planning: "rgba(255,255,255,0.05)", active: "rgba(52,211,153,0.08)", completed: "rgba(107,114,128,0.08)" };

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// ── Markdown renderer (reused from chatbot style) ──────────────────────────────
function renderInsights(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
        if (line.startsWith("### ")) return (
            <h4 key={i} className="text-[11px] font-bold tracking-widest uppercase text-cyan/80 mt-4 mb-1.5 flex items-center gap-2">
                <span className="w-3 h-px bg-cyan/40" />{line.slice(4)}
            </h4>
        );
        if (line.startsWith("## ")) return (
            <h3 key={i} className="text-xs font-bold text-text-primary mt-4 mb-1">{line.slice(3)}</h3>
        );
        if (line.startsWith("**") && line.endsWith("**") && line.length > 4) return (
            <p key={i} className="text-xs font-semibold text-text-primary mt-2 mb-0.5">{line.slice(2, -2)}</p>
        );
        if (line.startsWith("- ") || line.startsWith("* ")) {
            const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return (
                <div key={i} className="flex items-start gap-2 my-1">
                    <span className="w-1 h-1 rounded-full bg-cyan/50 mt-[7px] flex-shrink-0" />
                    <span className="text-[11px] text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            );
        }
        if (/^\d+\. /.test(line)) {
            const num = line.match(/^(\d+)\./)?.[1];
            const content = line.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return (
                <div key={i} className="flex items-start gap-2 my-1">
                    <span className="text-[10px] font-mono text-cyan/60 mt-0.5 w-4 flex-shrink-0">{num}.</span>
                    <span className="text-[11px] text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            );
        }
        if (line.trim() === "") return <div key={i} className="h-1.5" />;
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return <p key={i} className="text-[11px] text-text-secondary leading-relaxed my-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
}

// ── AI Insights Panel ──────────────────────────────────────────────────────────
function InsightsPanel({ event, onClose }: { event: CampusEvent; onClose: () => void }) {
    const [insights, setInsights] = useState<string>(event.insights ?? "");
    const [loading, setLoading] = useState<boolean>(!event.insights);
    const [error, setError] = useState<string>("");

    // Auto-fetch if not already analyzed
    useState(() => {
        if (!event.insights) {
            fetchInsights();
        }
    });

    async function fetchInsights() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/event-insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Failed");
            setInsights(data.insights ?? "");
            event.insights = data.insights;
            event.aiAnalyzed = true;
        } catch (e: any) {
            setError(e.message ?? "Error fetching insights");
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(18,18,26,0.98) 0%, rgba(26,26,38,0.98) 100%)",
                    border: "1px solid rgba(6,214,242,0.15)",
                    boxShadow: "0 0 60px rgba(6,214,242,0.06), 0 32px 80px rgba(0,0,0,0.7)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, rgba(6,214,242,0.15), rgba(167,139,250,0.1))" }}>
                            <Sparkles size={16} className="text-cyan" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-text-primary">AI Event Intelligence</div>
                            <div className="text-[10px] text-text-muted">{event.name} · {new Date(event.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!loading && insights && (
                            <button onClick={fetchInsights}
                                className="text-[10px] text-text-muted hover:text-cyan transition-colors px-2 py-1 rounded border border-border hover:border-cyan/20">
                                Refresh ↻
                            </button>
                        )}
                        <button onClick={onClose}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-all">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Event summary strip */}
                <div className="flex items-center gap-6 px-6 py-3 border-b border-border/50 flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    {[
                        { icon: Calendar, label: new Date(event.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) },
                        { icon: Clock, label: `${event.startTime} – ${event.endTime}` },
                        { icon: MapPin, label: event.venue },
                        { icon: Users, label: `${event.attendees.toLocaleString()} attendees` },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                            <s.icon size={11} className="text-cyan/50" />
                            {s.label}
                        </div>
                    ))}
                    <div className="ml-auto">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                            style={{ color: impactColor[event.impact], background: impactBg[event.impact], border: `1px solid ${impactBorder[event.impact]}` }}>
                            {event.impact} impact
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-48 gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ background: "rgba(6,214,242,0.1)", border: "1px solid rgba(6,214,242,0.2)" }}>
                                    <Sparkles size={20} className="text-cyan animate-pulse" />
                                </div>
                                <Loader2 size={14} className="absolute -top-1 -right-1 text-cyan animate-spin" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-text-primary">Analyzing event impact…</p>
                                <p className="text-xs text-text-muted mt-1">AI is reviewing campus data, zones, fleet & energy</p>
                            </div>
                            <div className="flex gap-1.5">
                                {["Crowd model", "Fleet routing", "Energy forecast", "Risk flags"].map((label, i) => (
                                    <motion.span key={label}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                                        className="text-[10px] px-2 py-0.5 rounded-full"
                                        style={{ background: "rgba(6,214,242,0.08)", color: "#06d6f2", border: "1px solid rgba(6,214,242,0.15)" }}>
                                        {label}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="rounded-xl p-4 mb-4"
                            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                            <p className="text-xs text-danger flex items-center gap-2">
                                <AlertTriangle size={14} /> {error}
                            </p>
                            <button onClick={fetchInsights}
                                className="mt-3 text-[11px] text-cyan hover:underline">
                                Try again →
                            </button>
                        </div>
                    )}

                    {insights && !loading && (
                        <div>
                            {/* AI badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(6,214,242,0.3), transparent)" }} />
                                <span className="text-[9px] font-bold tracking-widest uppercase text-cyan/60 flex items-center gap-1.5">
                                    <Sparkles size={9} /> AathraOS Event Intelligence Analysis
                                </span>
                                <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(6,214,242,0.3), transparent)" }} />
                            </div>
                            <div className="space-y-0.5">
                                {renderInsights(insights)}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ── Schedule Event Form Modal ──────────────────────────────────────────────────
interface FormState {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    attendees: string;
    type: string;
    description: string;
}

function ScheduleModal({ onClose, onAdd }: { onClose: () => void; onAdd: (e: CampusEvent) => void }) {
    const [form, setForm] = useState<FormState>({
        name: "", date: "", startTime: "09:00", endTime: "17:00",
        venue: "", attendees: "", type: "", description: "",
    });
    const [step, setStep] = useState<1 | 2>(1);
    const [analyzing, setAnalyzing] = useState(false);
    const [preview, setPreview] = useState<CampusEvent | null>(null);
    const [insights, setInsights] = useState("");
    const [insightError, setInsightError] = useState("");

    const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

    const getImpact = (att: number): "low" | "medium" | "high" | "critical" => {
        if (att >= 3000) return "critical";
        if (att >= 1500) return "high";
        if (att >= 500) return "medium";
        return "low";
    };

    async function handleAnalyze() {
        const att = parseInt(form.attendees) || 0;
        const event: CampusEvent = {
            id: `e${Date.now()}`,
            name: form.name,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            venue: form.venue,
            attendees: att,
            type: form.type,
            description: form.description,
            impact: getImpact(att),
            status: "planning",
            aiAnalyzed: false,
        };
        setPreview(event);
        setStep(2);
        setAnalyzing(true);
        setInsightError("");
        try {
            const res = await fetch("/api/event-insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Analysis failed");
            setInsights(data.insights ?? "");
        } catch (e: any) {
            setInsightError(e.message ?? "Failed to get AI insights");
        } finally {
            setAnalyzing(false);
        }
    }

    function handleConfirm() {
        if (!preview) return;
        const final: CampusEvent = { ...preview, aiAnalyzed: !!insights, insights: insights || undefined };
        onAdd(final);
        onClose();
    }

    const canProceed = form.name && form.date && form.startTime && form.endTime && form.venue && form.attendees && form.type;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(18,18,26,0.99) 0%, rgba(26,26,38,0.99) 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent-pink/10 flex items-center justify-center">
                            <Plus size={16} className="text-accent-pink" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-text-primary">Schedule Event</div>
                            <div className="flex items-center gap-2 mt-0.5">
                                {["Event Details", "AI Insights"].map((s, i) => (
                                    <div key={s} className="flex items-center gap-1.5">
                                        <span className={`text-[10px] font-medium ${step === i + 1 ? "text-cyan" : "text-text-muted/50"}`}>
                                            {i + 1}. {s}
                                        </span>
                                        {i === 0 && <ChevronRight size={10} className="text-text-muted/30" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-all">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Form */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-6 space-y-5"
                            >
                                {/* Name */}
                                <div>
                                    <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Event Name *</label>
                                    <input
                                        id="event-name"
                                        value={form.name}
                                        onChange={e => set("name", e.target.value)}
                                        placeholder="e.g. Annual Convocation Ceremony"
                                        className="w-full bg-surface-elevated/60 text-sm text-text-primary placeholder:text-text-muted/40 rounded-xl px-4 py-3 outline-none transition-all"
                                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                                        onFocus={e => (e.target.style.borderColor = "rgba(6,214,242,0.35)")}
                                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                    />
                                </div>

                                {/* Date + Time */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Date *</label>
                                        <input
                                            id="event-date"
                                            type="date"
                                            value={form.date}
                                            onChange={e => set("date", e.target.value)}
                                            min="2026-03-01"
                                            className="w-full bg-surface-elevated/60 text-sm text-text-primary rounded-xl px-4 py-3 outline-none transition-all"
                                            style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                                            onFocus={e => (e.target.style.borderColor = "rgba(6,214,242,0.35)")}
                                            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Start *</label>
                                        <input
                                            type="time"
                                            value={form.startTime}
                                            onChange={e => set("startTime", e.target.value)}
                                            className="w-full bg-surface-elevated/60 text-sm text-text-primary rounded-xl px-4 py-3 outline-none transition-all"
                                            style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                                            onFocus={e => (e.target.style.borderColor = "rgba(6,214,242,0.35)")}
                                            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">End *</label>
                                        <input
                                            type="time"
                                            value={form.endTime}
                                            onChange={e => set("endTime", e.target.value)}
                                            className="w-full bg-surface-elevated/60 text-sm text-text-primary rounded-xl px-4 py-3 outline-none transition-all"
                                            style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                                            onFocus={e => (e.target.style.borderColor = "rgba(6,214,242,0.35)")}
                                            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                        />
                                    </div>
                                </div>

                                {/* Venue + Type */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Venue *</label>
                                        <select
                                            id="event-venue"
                                            value={form.venue}
                                            onChange={e => set("venue", e.target.value)}
                                            className="w-full bg-surface-elevated/60 text-sm text-text-primary rounded-xl px-4 py-3 outline-none transition-all appearance-none cursor-pointer"
                                            style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                                            onFocus={e => (e.target.style.borderColor = "rgba(6,214,242,0.35)")}
                                            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                        >
                                            <option value="" disabled>Select venue…</option>
                                            {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Type *</label>
                                        <select
                                            value={form.type}
                                            onChange={e => set("type", e.target.value)}
                                            className="w-full bg-surface-elevated/60 text-sm text-text-primary rounded-xl px-4 py-3 outline-none transition-all appearance-none cursor-pointer"
                                            style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                                            onFocus={e => (e.target.style.borderColor = "rgba(6,214,242,0.35)")}
                                            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                        >
                                            <option value="" disabled>Select type…</option>
                                            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Attendees */}
                                <div>
                                    <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">
                                        Expected Attendees *
                                        {form.attendees && (
                                            <span className="ml-2 font-normal normal-case text-cyan/70">
                                                → Impact: <span className="font-semibold" style={{ color: impactColor[getImpact(parseInt(form.attendees) || 0)] }}>
                                                    {getImpact(parseInt(form.attendees) || 0)}
                                                </span>
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        value={form.attendees}
                                        onChange={e => set("attendees", e.target.value)}
                                        placeholder="e.g. 1200"
                                        min="1"
                                        className="w-full bg-surface-elevated/60 text-sm text-text-primary placeholder:text-text-muted/40 rounded-xl px-4 py-3 outline-none transition-all"
                                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                                        onFocus={e => (e.target.style.borderColor = "rgba(6,214,242,0.35)")}
                                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Description (optional)</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => set("description", e.target.value)}
                                        placeholder="Brief description of the event, special requirements, road closures, etc."
                                        rows={3}
                                        className="w-full bg-surface-elevated/60 text-sm text-text-primary placeholder:text-text-muted/40 rounded-xl px-4 py-3 outline-none transition-all resize-none"
                                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                                        onFocus={e => (e.target.style.borderColor = "rgba(6,214,242,0.35)")}
                                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                    />
                                </div>

                                {/* AI Notice */}
                                <div className="rounded-xl p-3 flex items-start gap-3"
                                    style={{ background: "rgba(6,214,242,0.04)", border: "1px solid rgba(6,214,242,0.1)" }}>
                                    <Sparkles size={14} className="text-cyan/70 flex-shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-text-muted leading-relaxed">
                                        After filling the details, AathraOS AI will analyze this event against live campus data and generate crowd management, fleet, energy, and risk recommendations automatically.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: AI Insights preview */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6"
                            >
                                {/* Event recap chips */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {[
                                        { icon: Calendar, label: form.date ? new Date(form.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : form.date },
                                        { icon: Clock, label: `${form.startTime} – ${form.endTime}` },
                                        { icon: MapPin, label: form.venue },
                                        { icon: Users, label: `${parseInt(form.attendees || "0").toLocaleString()} attendees` },
                                    ].map((c, i) => (
                                        <span key={i} className="flex items-center gap-1.5 text-[11px] text-text-muted px-3 py-1.5 rounded-full"
                                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                            <c.icon size={10} className="text-cyan/50" />{c.label}
                                        </span>
                                    ))}
                                </div>

                                {analyzing && (
                                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ background: "rgba(6,214,242,0.1)", border: "1px solid rgba(6,214,242,0.2)" }}>
                                                <Sparkles size={20} className="text-cyan animate-pulse" />
                                            </div>
                                            <Loader2 size={14} className="absolute -top-1 -right-1 text-cyan animate-spin" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-text-primary">Generating AI insights…</p>
                                            <p className="text-xs text-text-muted mt-1">Analyzing crowd, zones, fleet, energy & risks</p>
                                        </div>
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {["Crowd model", "Fleet routing", "Energy forecast", "Risk assessment", "Dispersal plan"].map((l, i) => (
                                                <motion.span key={l}
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
                                                    className="text-[10px] px-2 py-0.5 rounded-full"
                                                    style={{ background: "rgba(6,214,242,0.08)", color: "#06d6f2", border: "1px solid rgba(6,214,242,0.15)" }}>
                                                    {l}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {insightError && !analyzing && (
                                    <div className="rounded-xl p-4 mb-4"
                                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                                        <p className="text-xs text-danger flex items-center gap-2">
                                            <AlertTriangle size={13} /> {insightError}
                                        </p>
                                        <p className="text-[10px] text-text-muted mt-1">You can still save the event without AI insights.</p>
                                    </div>
                                )}

                                {insights && !analyzing && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(6,214,242,0.3), transparent)" }} />
                                            <span className="text-[9px] font-bold tracking-widest uppercase text-cyan/60 flex items-center gap-1">
                                                <Sparkles size={9} /> AI Operational Insights
                                            </span>
                                            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(6,214,242,0.3), transparent)" }} />
                                        </div>
                                        <div className="space-y-0.5 max-h-80 overflow-y-auto pr-1">
                                            {renderInsights(insights)}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex-shrink-0 flex items-center gap-3">
                    {step === 2 && (
                        <button onClick={() => setStep(1)} className="btn-outline text-xs py-2 px-4">
                            ← Back
                        </button>
                    )}
                    <div className="flex-1" />
                    <button onClick={onClose} className="text-xs text-text-muted hover:text-text-primary transition-colors">
                        Cancel
                    </button>
                    {step === 1 ? (
                        <button
                            id="analyze-event-btn"
                            onClick={handleAnalyze}
                            disabled={!canProceed}
                            className="flex items-center gap-2 btn-primary text-xs py-2.5 px-5 disabled:opacity-40"
                        >
                            <Sparkles size={13} /> Analyze with AI
                        </button>
                    ) : (
                        <button
                            id="confirm-schedule-btn"
                            onClick={handleConfirm}
                            disabled={analyzing}
                            className="flex items-center gap-2 btn-primary text-xs py-2.5 px-5 disabled:opacity-40"
                        >
                            <CheckCircle2 size={13} /> Save Event
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<CampusEvent[]>(SEED_EVENTS);
    const [showSchedule, setShowSchedule] = useState(false);
    const [insightEvent, setInsightEvent] = useState<CampusEvent | null>(null);
    const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "planning">("all");

    function runSimulation(event: CampusEvent) {
        const encoded = encodeURIComponent(JSON.stringify(event));
        router.push(`/dashboard/events/simulate?event=${encoded}`);
    }

    const filtered = filterStatus === "all" ? events : events.filter(e => e.status === filterStatus);

    const totalAttendees = events.reduce((s, e) => s + e.attendees, 0);
    const highImpact = events.filter(e => e.impact === "high" || e.impact === "critical").length;

    function addEvent(e: CampusEvent) {
        setEvents(prev => [e, ...prev]);
    }

    return (
        <>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {/* Header */}
                <motion.div variants={anim} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                            <Calendar size={24} className="text-accent-pink" />
                            Event Control
                        </h1>
                        <p className="text-sm text-text-muted mt-1">Schedule events · AI-powered impact analysis & crowd management</p>
                    </div>
                    <button
                        id="schedule-event-btn"
                        onClick={() => setShowSchedule(true)}
                        className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
                    >
                        <Plus size={14} /> Schedule Event
                    </button>
                </motion.div>

                {/* KPI strip */}
                <motion.div variants={anim} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Events", value: events.length.toString(), icon: Calendar, color: "text-accent-pink", bg: "bg-accent-pink/10" },
                        { label: "Expected Attendees", value: totalAttendees.toLocaleString(), icon: Users, color: "text-cyan", bg: "bg-cyan/10" },
                        { label: "High Impact", value: highImpact.toString(), icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
                        { label: "AI Analyzed", value: events.filter(e => e.aiAnalyzed).length.toString(), icon: Sparkles, color: "text-accent-purple", bg: "bg-accent-purple/10" },
                    ].map((s) => (
                        <div key={s.label} className="glass-card rounded-xl p-5">
                            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                                <s.icon size={16} className={s.color} />
                            </div>
                            <div className="text-xl font-bold text-text-primary">{s.value}</div>
                            <div className="text-[10px] text-text-muted mt-1">{s.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Filter tabs */}
                <motion.div variants={anim} className="flex items-center gap-2">
                    {(["all", "upcoming", "planning"] as const).map(f => (
                        <button key={f}
                            onClick={() => setFilterStatus(f)}
                            className={`text-xs py-1.5 px-3 rounded-lg border capitalize transition-all ${filterStatus === f
                                ? "bg-accent-pink/10 text-accent-pink border-accent-pink/30"
                                : "text-text-muted border-border hover:border-border-light hover:text-text-secondary"}`}>
                            {f === "all" ? "All Events" : f}
                        </button>
                    ))}
                </motion.div>

                {/* Events list */}
                <motion.div variants={anim} className="space-y-3">
                    <AnimatePresence>
                        {filtered.map((event) => (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="glass-card rounded-xl p-5 cursor-pointer group"
                                onClick={() => setInsightEvent(event)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left */}
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        {/* Date badge */}
                                        <div className="w-12 flex-shrink-0 rounded-xl overflow-hidden text-center"
                                            style={{ background: impactBg[event.impact], border: `1px solid ${impactBorder[event.impact]}` }}>
                                            <div className="py-1 text-[9px] font-bold tracking-wider uppercase"
                                                style={{ color: impactColor[event.impact], borderBottom: `1px solid ${impactBorder[event.impact]}` }}>
                                                {new Date(event.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short" })}
                                            </div>
                                            <div className="py-1.5 text-lg font-bold text-text-primary leading-none">
                                                {new Date(event.date + "T00:00:00").getDate()}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-semibold text-text-primary group-hover:text-cyan transition-colors">{event.name}</h3>
                                                {event.aiAnalyzed && (
                                                    <span className="flex items-center gap-1 text-[9px] font-medium text-accent-purple bg-accent-purple/10 px-1.5 py-0.5 rounded-full border border-accent-purple/20">
                                                        <Sparkles size={8} /> AI Analyzed
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-text-muted">
                                                <span className="flex items-center gap-1"><Clock size={9} /> {event.startTime} – {event.endTime}</span>
                                                <span className="flex items-center gap-1"><MapPin size={9} /> {event.venue}</span>
                                                <span className="flex items-center gap-1"><Users size={9} /> {event.attendees.toLocaleString()} attendees</span>
                                                <span className="flex items-center gap-1"><Activity size={9} /> {event.type}</span>
                                            </div>
                                            {event.description && (
                                                <p className="text-[10px] text-text-muted/70 mt-1.5 leading-relaxed line-clamp-1">{event.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right badges + action */}
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                                style={{ color: impactColor[event.impact], background: impactBg[event.impact], border: `1px solid ${impactBorder[event.impact]}` }}>
                                                {event.impact} impact
                                            </span>
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                                                style={{ color: statusColor[event.status], background: statusBg[event.status] }}>
                                                {event.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <button
                                                id={`view-insights-${event.id}`}
                                                className="flex items-center gap-1.5 text-[10px] font-medium text-text-muted group-hover:text-cyan transition-colors"
                                                onClick={(e) => { e.stopPropagation(); setInsightEvent(event); }}
                                            >
                                                <Sparkles size={11} />
                                                {event.aiAnalyzed ? "AI Insights" : "Get AI Insights"}
                                            </button>
                                            <span className="text-text-muted/20 text-xs">|</span>
                                            <button
                                                id={`simulate-${event.id}`}
                                                className="flex items-center gap-1.5 text-[10px] font-medium text-text-muted hover:text-accent-purple transition-colors"
                                                onClick={(e) => { e.stopPropagation(); runSimulation(event); }}
                                            >
                                                <Play size={10} /> Run Simulation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-text-muted">
                            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No events found.</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {showSchedule && <ScheduleModal onClose={() => setShowSchedule(false)} onAdd={addEvent} />}
                {insightEvent && <InsightsPanel event={insightEvent} onClose={() => setInsightEvent(null)} />}
            </AnimatePresence>
        </>
    );
}
