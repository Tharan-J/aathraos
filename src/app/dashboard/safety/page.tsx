"use client";

import { motion } from "framer-motion";
import {
    ShieldAlert,
    AlertTriangle,
    Eye,
    Siren,
    MapPin,
    Clock,
    TrendingDown,
    Users,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};
const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const riskZones = [
    { zone: "C-7", level: "critical", score: 92, desc: "High pedestrian-vehicle conflict" },
    { zone: "B-3", level: "high", score: 76, desc: "Crowd density exceeding threshold" },
    { zone: "A-1", level: "medium", score: 54, desc: "Limited visibility intersection" },
    { zone: "D-5", level: "low", score: 23, desc: "Monitored construction area" },
    { zone: "E-2", level: "low", score: 18, desc: "Standard surveillance zone" },
];

const incidents = [
    { time: "21:42", type: "Near-miss", location: "Zone C-7", status: "Investigating", severity: "high" },
    { time: "21:35", type: "Crowd surge", location: "Gate B", status: "Resolved", severity: "medium" },
    { time: "21:20", type: "Anomaly detected", location: "Zone B-3", status: "Monitoring", severity: "low" },
    { time: "21:05", type: "Unauthorized access", location: "Zone D-5", status: "Resolved", severity: "medium" },
    { time: "20:48", type: "Environmental alert", location: "Zone A-1", status: "Cleared", severity: "low" },
];

export default function SafetyPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <ShieldAlert size={24} className="text-accent-purple" />
                        Safety Monitor
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Risk heatmap, panic detection & evacuation readiness</p>
                </div>
                <Link
                    href="/dashboard/emergency"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-danger/10 text-danger text-xs font-semibold border border-danger/20 hover:bg-danger/20 transition-all"
                >
                    <Siren size={14} />
                    Activate Emergency Mode
                </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Overall Risk", value: "Medium", color: "text-warning", bgColor: "bg-warning/10", icon: AlertTriangle },
                    { label: "Active Alerts", value: "3", color: "text-danger", bgColor: "bg-danger/10", icon: Eye },
                    { label: "Incidents Today", value: "7", color: "text-text-primary", bgColor: "bg-surface-elevated", icon: Clock },
                    { label: "Evacuation Ready", value: "94%", color: "text-success", bgColor: "bg-success/10", icon: Users },
                ].map((s) => (
                    <div key={s.label} className="glass-card rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${s.bgColor} flex items-center justify-center`}>
                                <s.icon size={16} className={s.color} />
                            </div>
                        </div>
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-[10px] text-text-muted mt-1">{s.label}</div>
                    </div>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Risk Heatmap */}
                <motion.div variants={item}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <MapPin size={16} className="text-danger" />
                            <h2 className="text-sm font-semibold text-text-primary">Risk Heatmap</h2>
                        </div>
                        <div className="p-5">
                            {/* Simulated heatmap grid */}
                            <div className="grid grid-cols-8 gap-1 mb-4">
                                {Array.from({ length: 64 }, (_, i) => {
                                    const randomRisk = Math.random();
                                    let bg = "bg-success/10";
                                    if (randomRisk > 0.9) bg = "bg-danger/60";
                                    else if (randomRisk > 0.75) bg = "bg-warning/40";
                                    else if (randomRisk > 0.5) bg = "bg-warning/15";
                                    else if (randomRisk > 0.3) bg = "bg-success/20";
                                    return (
                                        <div
                                            key={i}
                                            className={`aspect-square rounded-sm ${bg} transition-colors cursor-pointer hover:opacity-70`}
                                        />
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-4 justify-center">
                                {[
                                    { label: "Low", color: "bg-success/30" },
                                    { label: "Medium", color: "bg-warning/30" },
                                    { label: "High", color: "bg-warning/60" },
                                    { label: "Critical", color: "bg-danger/60" },
                                ].map((l) => (
                                    <div key={l.label} className="flex items-center gap-1.5">
                                        <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                                        <span className="text-[10px] text-text-muted">{l.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Risk Zones Table */}
                <motion.div variants={item}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingDown size={16} className="text-warning" />
                                <h2 className="text-sm font-semibold text-text-primary">Risk Zones</h2>
                            </div>
                        </div>
                        <div className="divide-y divide-border/50">
                            {riskZones.map((zone) => (
                                <div
                                    key={zone.zone}
                                    className="px-5 py-3.5 hover:bg-surface-elevated/30 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono font-semibold text-text-primary">
                                                Zone {zone.zone}
                                            </span>
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${zone.level === "critical"
                                                        ? "bg-danger/15 text-danger"
                                                        : zone.level === "high"
                                                            ? "bg-warning/15 text-warning"
                                                            : zone.level === "medium"
                                                                ? "bg-cyan/10 text-cyan"
                                                                : "bg-success/10 text-success"
                                                    }`}
                                            >
                                                {zone.level}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-text-muted">{zone.score}</span>
                                            <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-text-muted mt-1.5">{zone.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Incident Timeline */}
            <motion.div variants={item}>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                        <Clock size={16} className="text-cyan" />
                        <h2 className="text-sm font-semibold text-text-primary">Incident Timeline</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    {["Time", "Type", "Location", "Status", "Severity"].map((h) => (
                                        <th key={h} className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-3">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {incidents.map((inc, i) => (
                                    <tr key={i} className="hover:bg-surface-elevated/30 transition-colors cursor-pointer">
                                        <td className="px-5 py-3 text-xs font-mono text-text-secondary">{inc.time}</td>
                                        <td className="px-5 py-3 text-xs font-medium text-text-primary">{inc.type}</td>
                                        <td className="px-5 py-3 text-xs text-text-secondary">{inc.location}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${inc.status === "Investigating"
                                                        ? "bg-warning/10 text-warning"
                                                        : inc.status === "Monitoring"
                                                            ? "bg-cyan/10 text-cyan"
                                                            : "bg-success/10 text-success"
                                                    }`}
                                            >
                                                {inc.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`w-2 h-2 rounded-full inline-block ${inc.severity === "high" ? "bg-danger" : inc.severity === "medium" ? "bg-warning" : "bg-success"
                                                    }`}
                                            />
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
