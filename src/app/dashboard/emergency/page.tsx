"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    AlertTriangle,
    Siren,
    Navigation,
    Users,
    Truck,
    Shield,
    Radio,
    MapPin,
    Phone,
    Volume2,
    ArrowRight,
} from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const evacuationRoutes = [
    { name: "Route Alpha — North Exit", capacity: "2,500", status: "active", load: "42%" },
    { name: "Route Beta — East Wing", capacity: "1,800", status: "active", load: "67%" },
    { name: "Route Gamma — South Gate", capacity: "3,200", status: "standby", load: "—" },
    { name: "Route Delta — Underground", capacity: "1,200", status: "active", load: "28%" },
];

const resources = [
    { type: "Medical Teams", deployed: 4, available: 8, icon: Shield },
    { type: "Ambulances", deployed: 2, available: 5, icon: Truck },
    { type: "Security Units", deployed: 12, available: 20, icon: Users },
    { type: "Fire Response", deployed: 1, available: 3, icon: Siren },
];

const corridors = [
    { name: "Emergency Lane A", from: "Hub Central", to: "North Exit", ets: "4 min", clear: true },
    { name: "Emergency Lane B", from: "Lab Wing", to: "East Gate", ets: "6 min", clear: true },
    { name: "Emergency Lane C", from: "Residential", to: "South Gate", ets: "8 min", clear: false },
];

export default function EmergencyPage() {
    const [activated, setActivated] = useState(false);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={`space-y-6 ${activated ? "emergency-mode" : ""}`}
        >
            {/* Header */}
            <motion.div variants={anim} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <AlertTriangle size={24} className={activated ? "text-danger animate-pulse" : "text-danger"} />
                        Emergency Mode
                    </h1>
                    <p className="text-sm text-text-muted mt-1">
                        {activated ? "EMERGENCY PROTOCOL ACTIVE — All systems redirected" : "Standby — Ready for activation"}
                    </p>
                </div>
                <button
                    onClick={() => setActivated(!activated)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all ${activated
                            ? "bg-surface-elevated text-text-primary border border-border hover:bg-surface-light"
                            : "bg-danger text-white hover:bg-danger/80 animate-pulse"
                        }`}
                >
                    <Siren size={16} />
                    {activated ? "Deactivate Emergency" : "ACTIVATE EMERGENCY MODE"}
                </button>
            </motion.div>

            {/* Emergency banner when active */}
            {activated && (
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    className="rounded-xl border-2 border-danger/30 bg-danger/5 p-4 flex items-center gap-4"
                >
                    <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center flex-shrink-0">
                        <Volume2 size={18} className="text-danger animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-danger">Emergency Protocol Active</p>
                        <p className="text-xs text-text-muted mt-0.5">
                            All non-essential systems suspended. Evacuation routes activated. Emergency vehicle corridors cleared.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-[10px] px-3 py-1.5 rounded bg-danger/10 text-danger border border-danger/20 font-medium flex items-center gap-1">
                            <Phone size={10} />
                            Emergency Contact
                        </button>
                        <button className="text-[10px] px-3 py-1.5 rounded bg-danger/10 text-danger border border-danger/20 font-medium flex items-center gap-1">
                            <Radio size={10} />
                            Broadcast Alert
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Stats */}
            <motion.div variants={anim} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {resources.map((r) => (
                    <div
                        key={r.type}
                        className={`glass-card rounded-xl p-5 ${activated ? "border-danger/10" : ""}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <r.icon size={16} className={activated ? "text-danger" : "text-text-muted"} />
                            <span className={`text-[10px] font-medium ${activated ? "text-danger" : "text-cyan"}`}>
                                {r.deployed}/{r.available}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-text-primary">{r.deployed}</div>
                        <div className="text-[10px] text-text-muted mt-1">{r.type} Deployed</div>
                        <div className="mt-2 h-1 rounded-full bg-surface-elevated overflow-hidden">
                            <div
                                className={`h-full rounded-full ${activated ? "bg-danger" : "bg-cyan"}`}
                                style={{ width: `${(r.deployed / r.available) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Evacuation Routes */}
                <motion.div variants={anim}>
                    <div className={`glass-card rounded-xl overflow-hidden ${activated ? "border-danger/10" : ""}`}>
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <Navigation size={16} className={activated ? "text-danger" : "text-cyan"} />
                            <h2 className="text-sm font-semibold text-text-primary">Evacuation Routes</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {evacuationRoutes.map((route) => (
                                <div key={route.name} className="px-5 py-4 hover:bg-surface-elevated/30 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-text-primary">{route.name}</span>
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${route.status === "active"
                                                    ? activated
                                                        ? "bg-danger/10 text-danger"
                                                        : "bg-success/10 text-success"
                                                    : "bg-surface-elevated text-text-muted"
                                                }`}
                                        >
                                            {route.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] text-text-muted">
                                        <span>Capacity: {route.capacity}</span>
                                        <span>Load: {route.load}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Emergency Corridors */}
                <motion.div variants={anim}>
                    <div className={`glass-card rounded-xl overflow-hidden ${activated ? "border-danger/10" : ""}`}>
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <MapPin size={16} className={activated ? "text-danger" : "text-accent-purple"} />
                            <h2 className="text-sm font-semibold text-text-primary">Emergency Vehicle Corridors</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {corridors.map((c) => (
                                <div key={c.name} className="px-5 py-4 hover:bg-surface-elevated/30 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-text-primary">{c.name}</span>
                                        <span className={`text-[10px] font-medium ${c.clear ? "text-success" : "text-warning"}`}>
                                            {c.clear ? "Clear" : "Obstructed"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                                        <span>{c.from}</span>
                                        <ArrowRight size={10} />
                                        <span>{c.to}</span>
                                        <span className="ml-auto">ETS: {c.ets}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
