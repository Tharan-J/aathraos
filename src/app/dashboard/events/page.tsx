"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const events = [
    {
        name: "Annual Tech Summit",
        date: "Mar 5, 2026",
        time: "09:00 - 18:00",
        location: "Hub Central Auditorium",
        attendees: 2500,
        status: "upcoming",
        impact: "high",
    },
    {
        name: "Campus Marathon",
        date: "Mar 8, 2026",
        time: "06:00 - 12:00",
        location: "Main Campus Loop",
        attendees: 800,
        status: "planning",
        impact: "medium",
    },
    {
        name: "Career Fair",
        date: "Mar 12, 2026",
        time: "10:00 - 16:00",
        location: "Exhibition Hall",
        attendees: 3000,
        status: "upcoming",
        impact: "high",
    },
    {
        name: "Cultural Night",
        date: "Mar 15, 2026",
        time: "17:00 - 22:00",
        location: "Open Air Theater",
        attendees: 1500,
        status: "planning",
        impact: "medium",
    },
];

export default function EventsPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={anim} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <Calendar size={24} className="text-accent-pink" />
                        Event Control
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Manage campus events and their infrastructure impact</p>
                </div>
                <button className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
                    <Plus size={14} />
                    Schedule Event
                </button>
            </motion.div>

            <motion.div variants={anim} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Upcoming Events", value: "4", icon: Calendar, color: "text-accent-pink", bg: "bg-accent-pink/10" },
                    { label: "Expected Attendees", value: "7,800", icon: Users, color: "text-cyan", bg: "bg-cyan/10" },
                    { label: "High Impact", value: "2", icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
                    { label: "Route Adjustments", value: "3", icon: MapPin, color: "text-accent-purple", bg: "bg-accent-purple/10" },
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

            <motion.div variants={anim}>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                        <Calendar size={16} className="text-accent-pink" />
                        <h2 className="text-sm font-semibold text-text-primary">Event Schedule</h2>
                    </div>
                    <div className="divide-y divide-border/50">
                        {events.map((event) => (
                            <div key={event.name} className="px-5 py-5 hover:bg-surface-elevated/30 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-sm font-semibold text-text-primary">{event.name}</h3>
                                        <div className="flex items-center gap-4 mt-1.5 text-[10px] text-text-muted">
                                            <span className="flex items-center gap-1"><Calendar size={10} />{event.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} />{event.time}</span>
                                            <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
                                            <span className="flex items-center gap-1"><Users size={10} />{event.attendees.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${event.impact === "high" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
                                            }`}>{event.impact} impact</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${event.status === "upcoming" ? "bg-cyan/10 text-cyan" : "bg-surface-elevated text-text-muted"
                                            }`}>{event.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
