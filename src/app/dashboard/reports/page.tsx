"use client";

import { motion } from "framer-motion";
import { FileText, Download, Calendar, Filter } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const reports = [
    { name: "Daily Operations Summary", date: "Feb 28, 2026", type: "Automated", size: "2.4 MB", status: "ready" },
    { name: "Weekly Mobility Analytics", date: "Feb 24, 2026", type: "Automated", size: "8.1 MB", status: "ready" },
    { name: "Safety Incident Report", date: "Feb 26, 2026", type: "Manual", size: "1.2 MB", status: "ready" },
    { name: "Energy Consumption Audit", date: "Feb 20, 2026", type: "Scheduled", size: "5.6 MB", status: "ready" },
    { name: "Nudging Campaign Results", date: "Feb 18, 2026", type: "Automated", size: "3.3 MB", status: "ready" },
    { name: "Monthly Executive Summary", date: "Feb 01, 2026", type: "Manual", size: "12.4 MB", status: "ready" },
];

export default function ReportsPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={anim} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <FileText size={24} className="text-electric" />
                        Reports
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Generated reports & analytics exports</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
                        <Filter size={12} /> Filter
                    </button>
                    <button className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
                        Generate Report
                    </button>
                </div>
            </motion.div>

            <motion.div variants={anim}>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    {["Report Name", "Date", "Type", "Size", "Action"].map((h) => (
                                        <th key={h} className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-4">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {reports.map((r) => (
                                    <tr key={r.name} className="hover:bg-surface-elevated/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center">
                                                    <FileText size={14} className="text-electric" />
                                                </div>
                                                <span className="text-xs font-medium text-text-primary">{r.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-text-secondary flex items-center gap-1.5">
                                            <Calendar size={10} className="text-text-muted" /> {r.date}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-text-muted font-medium">{r.type}</span>
                                        </td>
                                        <td className="px-5 py-4 text-xs font-mono text-text-muted">{r.size}</td>
                                        <td className="px-5 py-4">
                                            <button className="text-[10px] text-cyan hover:text-cyan/80 transition-colors flex items-center gap-1">
                                                <Download size={12} /> Download
                                            </button>
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
