"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Thermometer,
    Sun,
    Battery,
    Activity,
    TrendingDown,
    ArrowDownRight,
    Plug,
} from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const energySources = [
    { name: "Solar Array A", output: "420 kW", status: "optimal", percentage: 84 },
    { name: "Solar Array B", output: "380 kW", status: "optimal", percentage: 76 },
    { name: "Grid Supply", output: "1.2 MW", status: "active", percentage: 60 },
    { name: "Battery Storage", output: "340 kW", status: "discharging", percentage: 45 },
];

const hvacZones = [
    { zone: "Block A", temp: "23°C", target: "22°C", mode: "Cooling", efficiency: "92%" },
    { zone: "Hub Central", temp: "24°C", target: "23°C", mode: "Pre-cool", efficiency: "88%" },
    { zone: "Lab Wing", temp: "21°C", target: "21°C", mode: "Stable", efficiency: "96%" },
    { zone: "Residential", temp: "25°C", target: "23°C", mode: "Cooling", efficiency: "78%" },
];

export default function UtilitiesPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={anim}>
                <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                    <Zap size={24} className="text-warning" />
                    Utilities & Energy
                </h1>
                <p className="text-sm text-text-muted mt-1">Energy management, HVAC coupling & lighting control</p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={anim} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Consumption", value: "2.34 MW", icon: Zap, color: "text-warning", bg: "bg-warning/10", change: "-5.1%" },
                    { label: "Solar Generation", value: "800 kW", icon: Sun, color: "text-neon-green", bg: "bg-neon-green/10", change: "+12%" },
                    { label: "Grid Dependency", value: "56%", icon: Plug, color: "text-electric", bg: "bg-electric/10", change: "-8%" },
                    { label: "Avg. Temperature", value: "23.4°C", icon: Thermometer, color: "text-accent-pink", bg: "bg-accent-pink/10", change: "+0.2°" },
                ].map((s) => (
                    <div key={s.label} className="glass-card rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                                <s.icon size={16} className={s.color} />
                            </div>
                            <span className="text-[10px] flex items-center gap-0.5 text-success">
                                <ArrowDownRight size={10} />
                                {s.change}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-text-primary">{s.value}</div>
                        <div className="text-[10px] text-text-muted mt-1">{s.label}</div>
                    </div>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Energy Sources */}
                <motion.div variants={anim}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <Battery size={16} className="text-neon-green" />
                            <h2 className="text-sm font-semibold text-text-primary">Energy Sources</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {energySources.map((s) => (
                                <div key={s.name} className="px-5 py-4 hover:bg-surface-elevated/30 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-text-primary">{s.name}</span>
                                        <span className="text-xs font-mono text-cyan">{s.output}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${s.percentage > 70 ? "bg-success" : s.percentage > 40 ? "bg-warning" : "bg-danger"
                                                    }`}
                                                style={{ width: `${s.percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-text-muted">{s.percentage}%</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${s.status === "optimal" ? "bg-success/10 text-success" : s.status === "discharging" ? "bg-warning/10 text-warning" : "bg-cyan/10 text-cyan"
                                            }`}>
                                            {s.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* HVAC Control */}
                <motion.div variants={anim}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <Thermometer size={16} className="text-accent-pink" />
                            <h2 className="text-sm font-semibold text-text-primary">HVAC Zone Control</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        {["Zone", "Current", "Target", "Mode", "Efficiency"].map((h) => (
                                            <th key={h} className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-3">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {hvacZones.map((z) => (
                                        <tr key={z.zone} className="hover:bg-surface-elevated/30 transition-colors">
                                            <td className="px-5 py-3 text-xs font-medium text-text-primary">{z.zone}</td>
                                            <td className="px-5 py-3 text-xs font-mono text-text-secondary">{z.temp}</td>
                                            <td className="px-5 py-3 text-xs font-mono text-cyan">{z.target}</td>
                                            <td className="px-5 py-3">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${z.mode === "Stable" ? "bg-success/10 text-success" : z.mode === "Pre-cool" ? "bg-cyan/10 text-cyan" : "bg-warning/10 text-warning"
                                                    }`}>{z.mode}</span>
                                            </td>
                                            <td className="px-5 py-3 text-xs font-mono text-text-secondary">{z.efficiency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Energy Usage Chart */}
            <motion.div variants={anim}>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-warning" />
                            <h2 className="text-sm font-semibold text-text-primary">24h Energy Profile</h2>
                        </div>
                        <div className="flex gap-4 text-[10px]">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" /> Consumption</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-green" /> Solar</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-electric" /> Grid</span>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-end gap-1 h-40">
                            {Array.from({ length: 24 }, (_, i) => {
                                const consumption = 40 + Math.sin(i * 0.4 + 1) * 25 + Math.random() * 15;
                                const solar = i >= 6 && i <= 18 ? Math.sin((i - 6) * (Math.PI / 12)) * 35 : 0;
                                return (
                                    <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
                                        <div className="w-full relative" style={{ height: `${consumption}%` }}>
                                            <div className="absolute bottom-0 inset-x-0 rounded-t bg-warning/20" style={{ height: "100%" }} />
                                            {solar > 0 && (
                                                <div className="absolute bottom-0 inset-x-0 rounded-t bg-neon-green/30" style={{ height: `${(solar / consumption) * 100}%` }} />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-2 text-[9px] text-text-muted font-mono">
                            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
