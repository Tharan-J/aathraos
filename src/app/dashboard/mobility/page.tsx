"use client";

import { motion } from "framer-motion";
import {
    Navigation,
    Route,
    BarChart2,
    Activity,
    Clock,
    TrendingUp,
    ArrowUpRight,
    Gauge,
} from "lucide-react";

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};
const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const flowData = [
    { zone: "Zone A-1", inflow: 342, outflow: 298, netFlow: "+44", status: "normal" },
    { zone: "Zone B-3", inflow: 567, outflow: 412, netFlow: "+155", status: "high" },
    { zone: "Zone C-7", inflow: 189, outflow: 201, netFlow: "-12", status: "normal" },
    { zone: "Zone D-2", inflow: 723, outflow: 680, netFlow: "+43", status: "warning" },
    { zone: "Zone E-5", inflow: 456, outflow: 399, netFlow: "+57", status: "normal" },
];

const routes = [
    { name: "Loop A — Main Campus", efficiency: 92, demand: "High", eta: "4 min" },
    { name: "Loop B — Research Park", efficiency: 87, demand: "Medium", eta: "6 min" },
    { name: "Express — Gate to Hub", efficiency: 95, demand: "Low", eta: "3 min" },
    { name: "Loop C — Residential", efficiency: 78, demand: "High", eta: "8 min" },
];

export default function MobilityPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <Navigation size={24} className="text-cyan" />
                        Mobility Intelligence
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Flow simulation, route optimization & surge prediction</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-outline text-xs py-2 px-4">Export Data</button>
                    <button className="btn-primary text-xs py-2 px-4">Run Simulation</button>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Flow", value: "8,432", sub: "people/hr", icon: TrendingUp, color: "text-cyan" },
                    { label: "Avg. Transit Time", value: "4.2 min", sub: "↓ 12% vs avg", icon: Clock, color: "text-success" },
                    { label: "Route Efficiency", value: "89%", sub: "system-wide", icon: Gauge, color: "text-accent-purple" },
                    { label: "Surge Probability", value: "34%", sub: "next 30 min", icon: Activity, color: "text-warning" },
                ].map((s) => (
                    <div key={s.label} className="glass-card rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <s.icon size={16} className={s.color} />
                            <ArrowUpRight size={12} className="text-text-muted" />
                        </div>
                        <div className="text-xl font-bold text-text-primary">{s.value}</div>
                        <div className="text-[10px] text-text-muted mt-1">{s.label} · {s.sub}</div>
                    </div>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Flow Simulation */}
                <motion.div variants={item}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BarChart2 size={16} className="text-cyan" />
                                <h2 className="text-sm font-semibold text-text-primary">Flow Simulation</h2>
                            </div>
                            <div className="flex gap-2">
                                {["1h", "6h", "24h", "7d"].map((t) => (
                                    <button
                                        key={t}
                                        className={`text-[10px] px-2 py-1 rounded font-medium transition-all ${t === "1h"
                                                ? "bg-cyan/10 text-cyan border border-cyan/20"
                                                : "text-text-muted hover:text-text-secondary border border-transparent"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-5">
                            {/* Simulated Bar Chart */}
                            <div className="flex items-end gap-1 h-40">
                                {Array.from({ length: 24 }, (_, i) => {
                                    const h = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 40;
                                    const isHighlighted = i >= 8 && i <= 10;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className={`w-full rounded-t transition-all ${isHighlighted ? "bg-cyan" : "bg-cyan/20"
                                                    }`}
                                                style={{ height: `${h}%` }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[9px] text-text-muted font-mono">00:00</span>
                                <span className="text-[9px] text-text-muted font-mono">06:00</span>
                                <span className="text-[9px] text-text-muted font-mono">12:00</span>
                                <span className="text-[9px] text-text-muted font-mono">18:00</span>
                                <span className="text-[9px] text-text-muted font-mono">24:00</span>
                            </div>
                        </div>

                        {/* Time slider */}
                        <div className="px-5 py-3 border-t border-border flex items-center gap-4">
                            <Clock size={12} className="text-text-muted" />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="30"
                                className="flex-1 h-1 accent-cyan bg-surface-elevated rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan"
                            />
                            <span className="text-[10px] text-text-muted font-mono">Future State</span>
                        </div>
                    </div>
                </motion.div>

                {/* Route Optimization */}
                <motion.div variants={item}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <Route size={16} className="text-accent-purple" />
                            <h2 className="text-sm font-semibold text-text-primary">Route Optimization</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {routes.map((route) => (
                                <div key={route.name} className="px-5 py-4 hover:bg-surface-elevated/30 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-text-primary">{route.name}</span>
                                        <span className="text-[10px] text-text-muted">ETA: {route.eta}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${route.efficiency > 90 ? "bg-success" : route.efficiency > 80 ? "bg-cyan" : "bg-warning"
                                                    }`}
                                                style={{ width: `${route.efficiency}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-text-secondary">{route.efficiency}%</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${route.demand === "High" ? "bg-danger/10 text-danger" : route.demand === "Medium" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                                                }`}
                                        >
                                            {route.demand}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Gate Balancing */}
            <motion.div variants={item}>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-neon-green" />
                            <h2 className="text-sm font-semibold text-text-primary">Gate Balancing & Zone Flow</h2>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-3">Zone</th>
                                    <th className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-3">Inflow</th>
                                    <th className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-3">Outflow</th>
                                    <th className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-3">Net Flow</th>
                                    <th className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {flowData.map((f) => (
                                    <tr key={f.zone} className="hover:bg-surface-elevated/30 transition-colors">
                                        <td className="px-5 py-3 text-xs font-medium text-text-primary font-mono">{f.zone}</td>
                                        <td className="px-5 py-3 text-xs text-text-secondary">{f.inflow}</td>
                                        <td className="px-5 py-3 text-xs text-text-secondary">{f.outflow}</td>
                                        <td className="px-5 py-3 text-xs font-medium text-cyan">{f.netFlow}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${f.status === "high" ? "bg-danger/10 text-danger" : f.status === "warning" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                                                    }`}
                                            >
                                                {f.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
