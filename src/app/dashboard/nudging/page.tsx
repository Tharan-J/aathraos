"use client";

import { motion } from "framer-motion";
import {
    Brain,
    Target,
    TrendingUp,
    Users,
    MessageSquare,
    Megaphone,
    BarChart2,
    CheckCircle2,
    Clock,
    ArrowUpRight,
} from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const campaigns = [
    {
        name: "Route C Incentive",
        type: "Reward-based",
        status: "active",
        reach: "2,340",
        conversion: "24%",
        description: "Offer credits for using alternative Route C during peak hours",
    },
    {
        name: "Gate B Avoidance Nudge",
        type: "Social proof",
        status: "active",
        reach: "5,120",
        conversion: "31%",
        description: "Display crowd data showing Gate A as faster option",
    },
    {
        name: "Shuttle Pre-booking Push",
        type: "Notification",
        status: "scheduled",
        reach: "—",
        conversion: "—",
        description: "Push notifications for pre-booking shuttle seats",
    },
    {
        name: "Eco Route Challenge",
        type: "Gamification",
        status: "draft",
        reach: "—",
        conversion: "—",
        description: "Weekly challenge to reduce carbon footprint via routing",
    },
];

const behaviorMetrics = [
    { label: "Behavior Change Rate", value: "18.3%", change: "+2.1%", period: "vs last week" },
    { label: "Nudge Acceptance", value: "67%", change: "+5.4%", period: "avg. response" },
    { label: "Route Adoption", value: "42%", change: "+8.2%", period: "alternative routes" },
    { label: "Peak Reduction", value: "23%", change: "+3.6%", period: "congestion relief" },
];

const rules = [
    { condition: "Gate load > 80%", action: "Suggest alternate gate", priority: "High", active: true },
    { condition: "Transit time > 10 min", action: "Recommend express shuttle", priority: "Medium", active: true },
    { condition: "Zone density > threshold", action: "Deploy dispersion message", priority: "High", active: true },
    { condition: "Event start T-30 min", action: "Pre-route navigation", priority: "Low", active: false },
];

export default function NudgingPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={anim} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <Brain size={24} className="text-neon-green" />
                        Nudging Engine
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Behavioral influence campaigns & analytics</p>
                </div>
                <button className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
                    <Megaphone size={14} />
                    New Campaign
                </button>
            </motion.div>

            {/* Behavior Metrics */}
            <motion.div variants={anim} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {behaviorMetrics.map((m) => (
                    <div key={m.label} className="glass-card rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <TrendingUp size={14} className="text-neon-green" />
                            <span className="text-[10px] flex items-center gap-0.5 text-success">
                                <ArrowUpRight size={10} />
                                {m.change}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-text-primary">{m.value}</div>
                        <div className="text-[10px] text-text-muted mt-1">{m.label} · {m.period}</div>
                    </div>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Campaigns */}
                <motion.div variants={anim}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <Target size={16} className="text-accent-purple" />
                            <h2 className="text-sm font-semibold text-text-primary">Incentive Campaigns</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {campaigns.map((c) => (
                                <div key={c.name} className="px-5 py-4 hover:bg-surface-elevated/30 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-text-primary">{c.name}</span>
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === "active"
                                                    ? "bg-success/10 text-success"
                                                    : c.status === "scheduled"
                                                        ? "bg-warning/10 text-warning"
                                                        : "bg-surface-elevated text-text-muted"
                                                }`}
                                        >
                                            {c.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-text-muted mb-2">{c.description}</p>
                                    <div className="flex items-center gap-4 text-[10px] text-text-muted">
                                        <span className="flex items-center gap-1">
                                            <Users size={10} /> Reach: {c.reach}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BarChart2 size={10} /> Conv: {c.conversion}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare size={10} /> {c.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Rules Table */}
                <motion.div variants={anim}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <Clock size={16} className="text-cyan" />
                            <h2 className="text-sm font-semibold text-text-primary">Route Recommendation Rules</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {rules.map((r, i) => (
                                <div key={i} className="px-5 py-4 hover:bg-surface-elevated/30 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2
                                                size={14}
                                                className={r.active ? "text-success" : "text-text-muted"}
                                            />
                                            <span className="text-xs font-medium text-text-primary">{r.condition}</span>
                                        </div>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r.priority === "High"
                                                    ? "bg-danger/10 text-danger"
                                                    : r.priority === "Medium"
                                                        ? "bg-warning/10 text-warning"
                                                        : "bg-surface-elevated text-text-muted"
                                                }`}
                                        >
                                            {r.priority}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-text-muted pl-6">→ {r.action}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Adoption Chart */}
            <motion.div variants={anim}>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                        <BarChart2 size={16} className="text-electric" />
                        <h2 className="text-sm font-semibold text-text-primary">Adoption Rates Over Time</h2>
                    </div>
                    <div className="p-5">
                        <div className="flex items-end gap-2 h-32">
                            {[15, 22, 28, 34, 31, 38, 42, 45, 48, 44, 51, 55, 53, 58, 62].map((v, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full rounded-t bg-gradient-to-t from-neon-green/40 to-neon-green/10 transition-all"
                                        style={{ height: `${v * 1.5}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[9px] text-text-muted font-mono">
                            <span>Week 1</span>
                            <span>Week 8</span>
                            <span>Week 15</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
