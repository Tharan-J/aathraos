"use client";

import { motion } from "framer-motion";
import {
    Users,
    Car,
    ShieldCheck,
    Zap,
    AlertTriangle,
    Navigation,
    Battery,
    Thermometer,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
} from "lucide-react";
import MobilityMap from "@/components/dashboard/widgets/MobilityMap";

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};

const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any } },
};

// Nudges
const nudges = [
    { name: "Route A → B diversion", status: "active", compliance: "78%" },
    { name: "Gate C load balance", status: "active", compliance: "85%" },
    { name: "Parking lot B suggestion", status: "pending", compliance: "—" },
];

// Shuttle data
const shuttles = [
    { id: "S-01", status: "active", route: "Loop A", battery: 72 },
    { id: "S-02", status: "active", route: "Loop B", battery: 58 },
    { id: "S-03", status: "charging", route: "—", battery: 34 },
    { id: "S-04", status: "idle", route: "—", battery: 91 },
    { id: "S-05", status: "active", route: "Express", battery: 65 },
];

import { useState, useEffect } from "react";

export default function DashboardOverview() {
    const [personCount, setPersonCount] = useState<number>(12847);
    const [vehicleCount, setVehicleCount] = useState<number>(450); // Raw count instead of %

    const [alerts, setAlerts] = useState<any[]>([
        { text: "Gate B congestion predicted in 12 minutes", severity: "warning", time: "2 min ago", confidence: "94%" },
        { text: "High collision risk zone detected — Zone C-7", severity: "danger", time: "5 min ago", confidence: "87%" },
        { text: "Event surge expected — North Auditorium", severity: "warning", time: "8 min ago", confidence: "91%" },
        { text: "Optimal shuttle dispatch window in 4 min", severity: "info", time: "10 min ago", confidence: "96%" },
        { text: "HVAC pre-cooling recommendation triggered", severity: "info", time: "15 min ago", confidence: "89%" },
    ]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/backend/stream/status");
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "running") {
                        setPersonCount(data.persons);
                        setVehicleCount(data.vehicles);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch stream status", err);
            }
        };

        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const res = await fetch("/api/backend/forecast/peaks");
                if (res.ok) {
                    const data = await res.json();
                    // data is a list of { Day: string, 'Peak 1': string, 'Peak 2': string, 'Peak 3': string }
                    if (data && data.length > 0) {
                        const newAlerts = data.slice(0, 3).map((item: any) => ({
                            text: `High vehicle congestion predicted on ${item.Day} at ${item['Peak 1'].split(' ')[0]}`,
                            severity: "warning",
                            time: "ml forecast",
                            confidence: "80%",
                        }));
                        setAlerts(prev => [...newAlerts, ...prev].slice(0, 7)); // max 7 alerts
                    }
                }
            } catch (err) {
                console.error("Failed to fetch peak forecasts", err);
            }
        };
        fetchPredictions();
    }, []);

    const statusCards = [
        {
            label: "Campus Population",
            value: personCount.toLocaleString(),
            change: "+3.2%",
            trend: "up",
            icon: Users,
            color: "text-cyan",
            bgColor: "bg-cyan/10",
        },
        {
            label: "Mobility Load",
            value: vehicleCount.toLocaleString(), // Show raw vehicle count now
            change: "+1.8%",
            trend: "up",
            icon: Car,
            color: "text-warning",
            bgColor: "bg-warning/10",
        },
        {
            label: "Risk Level",
            value: "Low",
            change: "-12%",
            trend: "down",
            icon: ShieldCheck,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            label: "Energy Consumption",
            value: "2.4 MW",
            change: "-5.1%",
            trend: "down",
            icon: Zap,
            color: "text-accent-purple",
            bgColor: "bg-accent-purple/10",
        },
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Page Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Command Center</h1>
                    <p className="text-sm text-text-muted mt-1">
                        Real-time urban infrastructure overview
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-muted px-2 py-1 rounded bg-surface-elevated">
                        LIVE
                    </span>
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                </div>
            </motion.div>

            {/* Status Cards */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statusCards.map((card) => (
                    <div
                        key={card.label}
                        className="glass-card rounded-xl p-5 group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                                <card.icon size={18} className={card.color} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${card.trend === "up" ? "text-success" : "text-success"}`}>
                                {card.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {card.change}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-text-primary mb-1">{card.value}</div>
                        <div className="text-xs text-text-muted">{card.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Mobility Map */}
                <motion.div variants={item} className="lg:col-span-2">
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <Navigation size={16} className="text-cyan" />
                                <h2 className="text-sm font-semibold text-text-primary">Live Mobility Map</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="text-[10px] font-medium text-text-muted px-2 py-1 rounded border border-border hover:border-cyan/20 hover:text-cyan transition-all">
                                    Layers
                                </button>
                                <button className="text-[10px] font-medium text-text-muted px-2 py-1 rounded border border-border hover:border-cyan/20 hover:text-cyan transition-all">
                                    Predict
                                </button>
                            </div>
                        </div>
                        <div className="aspect-[16/9] relative">
                            <MobilityMap />
                        </div>
                        {/* Time Slider */}
                        <div className="px-5 py-3 border-t border-border flex items-center gap-4">
                            <span className="text-[10px] text-text-muted font-mono">NOW</span>
                            <input
                                type="range"
                                min="0"
                                max="60"
                                defaultValue="0"
                                className="flex-1 h-1 accent-cyan bg-surface-elevated rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan"
                            />
                            <span className="text-[10px] text-text-muted font-mono">+60 MIN</span>
                        </div>
                    </div>
                </motion.div>

                {/* Predictive Alerts */}
                <motion.div variants={item}>
                    <div className="glass-card rounded-xl overflow-hidden h-full">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <AlertTriangle size={16} className="text-warning" />
                                <h2 className="text-sm font-semibold text-text-primary">Predictive Alerts</h2>
                            </div>
                            <span className="text-[10px] font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                                {alerts.length} Active
                            </span>
                        </div>
                        <div className="divide-y divide-border/50 max-h-[420px] overflow-y-auto">
                            {alerts.map((alert: any, i: number) => (
                                <div
                                    key={i}
                                    className="px-5 py-3.5 hover:bg-surface-elevated/30 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${alert.severity === "danger"
                                                ? "bg-danger"
                                                : alert.severity === "warning"
                                                    ? "bg-warning"
                                                    : "bg-cyan"
                                                }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-text-primary leading-relaxed">{alert.text}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[10px] text-text-muted">{alert.time}</span>
                                                <span className="text-[10px] text-text-muted">
                                                    Confidence: <span className="text-cyan">{alert.confidence}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight
                                            size={14}
                                            className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Nudging Panel */}
                <motion.div variants={item}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <TrendingUp size={16} className="text-neon-green" />
                                <h2 className="text-sm font-semibold text-text-primary">Safe-Mobility Nudging</h2>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            {nudges.map((nudge, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-lg bg-surface-light/30 border border-border/50"
                                >
                                    <div>
                                        <div className="text-xs font-medium text-text-primary">{nudge.name}</div>
                                        <div className="text-[10px] text-text-muted mt-0.5">
                                            Compliance: {nudge.compliance}
                                        </div>
                                    </div>
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${nudge.status === "active"
                                            ? "bg-success/10 text-success"
                                            : "bg-warning/10 text-warning"
                                            }`}
                                    >
                                        {nudge.status}
                                    </span>
                                </div>
                            ))}
                            <div className="flex gap-2 pt-2">
                                <button className="flex-1 btn-outline text-[11px] py-2">Deploy Route</button>
                                <button className="flex-1 btn-primary text-[11px] py-2">Disperse</button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Shuttle Monitor */}
                <motion.div variants={item}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <Car size={16} className="text-electric" />
                                <h2 className="text-sm font-semibold text-text-primary">Shuttle Monitor</h2>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-text-muted">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success" /> 3 Active
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-warning" /> 1 Charging
                                </span>
                            </div>
                        </div>
                        <div className="divide-y divide-border/50">
                            {shuttles.map((shuttle) => (
                                <div
                                    key={shuttle.id}
                                    className="px-5 py-3 flex items-center justify-between hover:bg-surface-elevated/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-medium text-text-primary">{shuttle.id}</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${shuttle.status === "active"
                                                ? "bg-success/10 text-success"
                                                : shuttle.status === "charging"
                                                    ? "bg-warning/10 text-warning"
                                                    : "bg-surface-elevated text-text-muted"
                                                }`}
                                        >
                                            {shuttle.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-text-muted">{shuttle.route}</span>
                                        <div className="flex items-center gap-1.5">
                                            <Battery size={12} className="text-text-muted" />
                                            <div className="w-16 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${shuttle.battery > 60 ? "bg-success" : shuttle.battery > 30 ? "bg-warning" : "bg-danger"
                                                        }`}
                                                    style={{ width: `${shuttle.battery}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono text-text-muted">{shuttle.battery}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Utilities Coupling */}
                <motion.div variants={item}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <Activity size={16} className="text-accent-purple" />
                                <h2 className="text-sm font-semibold text-text-primary">Utilities Coupling</h2>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* HVAC */}
                            <div className="p-3 rounded-lg bg-surface-light/30 border border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Thermometer size={14} className="text-accent-pink" />
                                        <span className="text-xs font-medium text-text-primary">HVAC Pre-cooling</span>
                                    </div>
                                    <span className="text-[10px] text-success font-medium">Triggered</span>
                                </div>
                                <p className="text-[10px] text-text-muted">
                                    Mobility surge → Building zone C pre-cooling activated
                                </p>
                            </div>

                            {/* Charging */}
                            <div className="p-3 rounded-lg bg-surface-light/30 border border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Battery size={14} className="text-neon-green" />
                                        <span className="text-xs font-medium text-text-primary">Charging Schedule</span>
                                    </div>
                                    <span className="text-[10px] text-cyan font-medium">Optimized</span>
                                </div>
                                <p className="text-[10px] text-text-muted">
                                    Off-peak charging aligned with demand forecast
                                </p>
                            </div>

                            {/* Lighting */}
                            <div className="p-3 rounded-lg bg-surface-light/30 border border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Zap size={14} className="text-warning" />
                                        <span className="text-xs font-medium text-text-primary">Lighting Adaptation</span>
                                    </div>
                                    <span className="text-[10px] text-success font-medium">Active</span>
                                </div>
                                <p className="text-[10px] text-text-muted">
                                    Ambient light adjusted based on crowd density
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
