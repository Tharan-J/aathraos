"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Map,
    Box,
    Play,
    BarChart2,
    Settings,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const scenarios = [
    { name: "New Route Addition — Loop D", type: "Infrastructure", status: "ready" },
    { name: "Concert Event — 5,000 attendees", type: "Event", status: "ready" },
    { name: "Gate B Closure Impact", type: "Infrastructure", status: "completed" },
    { name: "Peak Hour Stress Test", type: "Stress", status: "ready" },
];

const metrics = [
    { label: "Avg. Transit Time", before: "6.2 min", after: "4.8 min", change: "-22%", positive: true },
    { label: "Gate Congestion", before: "74%", after: "52%", change: "-30%", positive: true },
    { label: "Energy Consumption", before: "2.4 MW", after: "2.6 MW", change: "+8%", positive: false },
    { label: "Safety Score", before: "82", after: "89", change: "+8%", positive: true },
];

export default function PlanningPage() {
    const [simRunning, setSimRunning] = useState(false);

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={anim} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <Map size={24} className="text-accent-purple" />
                        Planning & Simulation
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Digital twin interface for scenario testing</p>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Digital Twin View */}
                <motion.div variants={anim} className="lg:col-span-2">
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Box size={16} className="text-cyan" />
                                <h2 className="text-sm font-semibold text-text-primary">Digital Twin — Campus Model</h2>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-[10px] px-2 py-1 rounded border border-border text-text-muted hover:border-cyan/20 hover:text-cyan transition-all">
                                    <Settings size={12} />
                                </button>
                                <button className="text-[10px] px-2 py-1 rounded border border-border text-text-muted hover:border-cyan/20 hover:text-cyan transition-all">
                                    <RefreshCw size={12} />
                                </button>
                            </div>
                        </div>
                        <div className="aspect-[16/9] relative bg-[#0d0d14] flex items-center justify-center">
                            {/* 3D-like grid visualization */}
                            <svg className="w-full h-full" viewBox="0 0 800 450" fill="none">
                                {/* Perspective grid */}
                                {Array.from({ length: 20 }, (_, i) => (
                                    <line
                                        key={`v${i}`}
                                        x1={80 + i * 35}
                                        y1={50}
                                        x2={200 + i * 20}
                                        y2={400}
                                        stroke="rgba(6,214,242,0.04)"
                                        strokeWidth="0.5"
                                    />
                                ))}
                                {Array.from({ length: 12 }, (_, i) => (
                                    <line
                                        key={`h${i}`}
                                        x1={50}
                                        y1={50 + i * 33}
                                        x2={780}
                                        y2={50 + i * 33}
                                        stroke="rgba(6,214,242,0.03)"
                                        strokeWidth="0.5"
                                    />
                                ))}
                                {/* Buildings */}
                                <rect x="200" y="120" width="80" height="60" fill="rgba(6,214,242,0.08)" stroke="rgba(6,214,242,0.15)" rx="2" />
                                <rect x="350" y="180" width="100" height="70" fill="rgba(167,139,250,0.08)" stroke="rgba(167,139,250,0.15)" rx="2" />
                                <rect x="520" y="140" width="70" height="50" fill="rgba(6,214,242,0.08)" stroke="rgba(6,214,242,0.15)" rx="2" />
                                <rect x="280" y="280" width="90" height="55" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.15)" rx="2" />
                                <rect x="450" y="300" width="60" height="40" fill="rgba(6,214,242,0.08)" stroke="rgba(6,214,242,0.15)" rx="2" />
                                <rect x="600" y="250" width="85" height="65" fill="rgba(244,114,182,0.08)" stroke="rgba(244,114,182,0.15)" rx="2" />
                                {/* Labels */}
                                <text x="220" y="156" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="Inter">Block A</text>
                                <text x="375" y="220" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="Inter">Hub Central</text>
                                <text x="535" y="170" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="Inter">Lab Wing</text>
                                {/* Routes */}
                                <path
                                    d="M240 180 Q300 230 400 250 Q500 270 560 190"
                                    stroke="rgba(6,214,242,0.2)"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                    fill="none"
                                />
                                <path
                                    d="M325 310 Q380 290 480 320 Q550 340 640 280"
                                    stroke="rgba(52,211,153,0.2)"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                    fill="none"
                                />
                            </svg>

                            {simRunning && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                                >
                                    <div className="glass-card rounded-xl p-6 text-center neon-border">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-8 h-8 border-2 border-cyan/20 border-t-cyan rounded-full mx-auto mb-3"
                                        />
                                        <p className="text-sm text-text-primary font-medium">Running Simulation...</p>
                                        <p className="text-[10px] text-text-muted mt-1">Analyzing 2,400 data points</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                            <span className="text-[10px] text-text-muted">Model: Campus v3.2 · 847 entities</span>
                            <button
                                onClick={() => {
                                    setSimRunning(true);
                                    setTimeout(() => setSimRunning(false), 3000);
                                }}
                                className="btn-primary text-[11px] py-1.5 px-4 flex items-center gap-2"
                            >
                                <Play size={12} />
                                Run Simulation
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Scenarios */}
                <motion.div variants={anim}>
                    <div className="glass-card rounded-xl overflow-hidden h-full">
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <BarChart2 size={16} className="text-warning" />
                            <h2 className="text-sm font-semibold text-text-primary">Test Scenarios</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {scenarios.map((s) => (
                                <div
                                    key={s.name}
                                    className="px-5 py-4 hover:bg-surface-elevated/30 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-medium text-text-primary">{s.name}</span>
                                        {s.status === "completed" ? (
                                            <CheckCircle2 size={14} className="text-success" />
                                        ) : (
                                            <AlertCircle size={14} className="text-text-muted" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-text-muted">{s.type}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted">
                                            {s.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Impact Metrics */}
            <motion.div variants={anim}>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                        <BarChart2 size={16} className="text-success" />
                        <h2 className="text-sm font-semibold text-text-primary">
                            Impact Metrics — Last Simulation
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                        {metrics.map((m) => (
                            <div
                                key={m.label}
                                className="p-4 rounded-lg bg-surface-light/30 border border-border/50"
                            >
                                <div className="text-[10px] text-text-muted mb-3">{m.label}</div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-[10px] text-text-muted line-through">{m.before}</div>
                                        <div className="text-lg font-bold text-text-primary">{m.after}</div>
                                    </div>
                                    <span
                                        className={`text-xs font-bold ${m.positive ? "text-success" : "text-danger"}`}
                                    >
                                        {m.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
