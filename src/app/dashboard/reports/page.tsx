"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Download, Calendar, Filter, X, AlertTriangle,
    TrendingUp, TrendingDown, ShieldCheck, Users, Car, Zap,
    Activity, Clock, Eye, CheckCircle, ChevronRight,
    BarChart3, Map, Siren, Battery
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AlertEntry {
    severity: "danger" | "warning" | "info";
    text: string;
    time: string;
    zone: string;
    resolved: boolean;
}

interface StatRow {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
}

interface HourlyPoint {
    hour: string;
    population: number;
    vehicles: number;
}

interface Report {
    id: string;
    name: string;
    date: string;
    period: string;
    type: "Automated" | "Manual" | "Scheduled";
    size: string;
    status: "ready";
    author: string;
    summary: string;
    kpis: StatRow[];
    alerts: AlertEntry[];
    hourly: HourlyPoint[];
    nudges: { name: string; compliance: string; impact: string }[];
    zones: { name: string; risk: "low" | "medium" | "high"; density: string; crowdCount: number }[];
    energyNote: string;
    recommendation: string;
}

// ── Mock report dataset ────────────────────────────────────────────────────────
const REPORTS: Report[] = [
    {
        id: "r1",
        name: "Daily Operations Summary",
        date: "Feb 28, 2026",
        period: "28 Feb 2026 · 00:00 – 23:59 IST",
        type: "Automated",
        size: "2.4 MB",
        status: "ready",
        author: "AathraOS AutoGen",
        summary: "All systems operated within normal parameters. One high-risk zone event was resolved within 18 minutes. Energy efficiency improved by 5.1% compared to the previous day.",
        kpis: [
            { label: "Peak Campus Population", value: "14,320", change: "+3.2%", trend: "up" },
            { label: "Peak Vehicle Count", value: "512", change: "+1.8%", trend: "up" },
            { label: "Energy Consumption", value: "2.4 MW", change: "-5.1%", trend: "down" },
            { label: "Risk Incidents", value: "1", change: "-66%", trend: "down" },
            { label: "Shuttle Dispatches", value: "38", change: "+12%", trend: "up" },
            { label: "Avg Crowd Response", value: "18 min", change: "-22%", trend: "down" },
        ],
        alerts: [
            { severity: "danger", text: "High collision risk zone detected — Zone C-7", time: "09:42 AM", zone: "Zone C-7", resolved: true },
            { severity: "warning", text: "Gate B congestion — predicted 12 min ahead", time: "11:15 AM", zone: "Gate B", resolved: true },
            { severity: "warning", text: "Event surge — North Auditorium", time: "02:30 PM", zone: "North Auditorium", resolved: true },
            { severity: "info", text: "Optimal shuttle dispatch window triggered", time: "05:00 PM", zone: "Loop A", resolved: true },
            { severity: "info", text: "HVAC pre-cooling automatically triggered", time: "06:20 PM", zone: "Building Zone C", resolved: true },
        ],
        hourly: [
            { hour: "06:00", population: 3200, vehicles: 120 },
            { hour: "08:00", population: 8900, vehicles: 310 },
            { hour: "10:00", population: 12400, vehicles: 440 },
            { hour: "12:00", population: 14320, vehicles: 512 },
            { hour: "14:00", population: 13100, vehicles: 480 },
            { hour: "16:00", population: 11200, vehicles: 390 },
            { hour: "18:00", population: 7600, vehicles: 250 },
            { hour: "20:00", population: 3800, vehicles: 110 },
        ],
        nudges: [
            { name: "Route A → B Diversion", compliance: "78%", impact: "Gate B congestion reduced by 34%" },
            { name: "Gate C Load Balance", compliance: "85%", impact: "Wait time reduced from 8 min to 3 min" },
            { name: "Parking Lot B Suggestion", compliance: "63%", impact: "Freed 47 parking spots in Lot A" },
        ],
        zones: [
            { name: "Zone A", risk: "low", density: "moderate", crowdCount: 2340 },
            { name: "Zone B", risk: "medium", density: "high", crowdCount: 4120 },
            { name: "Zone C-7", risk: "high", density: "critical", crowdCount: 890 },
            { name: "North Auditorium", risk: "medium", density: "surge", crowdCount: 1560 },
            { name: "Gate B", risk: "high", density: "congested", crowdCount: 780 },
        ],
        energyNote: "HVAC pre-cooling saved an estimated 0.3 MW during the afternoon peak. Off-peak EV charging schedule maintained 100% compliance.",
        recommendation: "Deploy an additional shuttle on Loop A during 10:00–14:00 window to reduce Zone B density. Consider permanent gate diversion for Route A→B.",
    },
    {
        id: "r2",
        name: "Weekly Mobility Analytics",
        date: "Feb 24, 2026",
        period: "18 Feb – 24 Feb 2026",
        type: "Automated",
        size: "8.1 MB",
        status: "ready",
        author: "AathraOS AutoGen",
        summary: "Vehicle flow increased 8% week-over-week. Monday and Wednesday recorded the highest pedestrian density. Three safety incidents were logged and all resolved without escalation.",
        kpis: [
            { label: "Weekly Avg Population", value: "11,240", change: "+6.1%", trend: "up" },
            { label: "Total Vehicle Passes", value: "3,180", change: "+8%", trend: "up" },
            { label: "Safety Incidents", value: "3", change: "0%", trend: "neutral" },
            { label: "Avg Energy / Day", value: "2.6 MW", change: "-2.4%", trend: "down" },
            { label: "Shuttle Utilization", value: "74%", change: "+9%", trend: "up" },
            { label: "Nudge Compliance", value: "81%", change: "+5%", trend: "up" },
        ],
        alerts: [
            { severity: "danger", text: "Fire drill evacuation drill — South Block", time: "Mon 10:00 AM", zone: "South Block", resolved: true },
            { severity: "warning", text: "Parking overflow — Visitor Lot", time: "Wed 01:00 PM", zone: "Visitor Lot", resolved: true },
            { severity: "warning", text: "Pedestrian bottleneck — Main Entrance", time: "Fri 09:15 AM", zone: "Main Entrance", resolved: true },
        ],
        hourly: [
            { hour: "Mon", population: 12800, vehicles: 455 },
            { hour: "Tue", population: 10900, vehicles: 390 },
            { hour: "Wed", population: 13400, vehicles: 480 },
            { hour: "Thu", population: 11600, vehicles: 415 },
            { hour: "Fri", population: 10200, vehicles: 370 },
            { hour: "Sat", population: 6400, vehicles: 180 },
            { hour: "Sun", population: 3800, vehicles: 90 },
        ],
        nudges: [
            { name: "Peak-Hour Route Splits", compliance: "81%", impact: "Reduced Gate A load by 29%" },
            { name: "EV Charging Off-Peak", compliance: "94%", impact: "Saved 0.4 MW during peak" },
        ],
        zones: [
            { name: "Zone A", risk: "low", density: "moderate", crowdCount: 1980 },
            { name: "Zone B", risk: "low", density: "normal", crowdCount: 2300 },
            { name: "Main Entrance", risk: "medium", density: "high", crowdCount: 3100 },
            { name: "Visitor Lot", risk: "medium", density: "overflow", crowdCount: 620 },
        ],
        energyNote: "Weekly energy usage was 18.2 MWh, 2.4% below the 7-day rolling average. HVAC optimization contributed 1.1 MWh savings.",
        recommendation: "Add smart signage at the Main Entrance to guide flow during 09:00–10:00 peak. Visitor Lot capacity should be expanded or restricted to pre-registered vehicles.",
    },
    {
        id: "r3",
        name: "Safety Incident Report",
        date: "Feb 26, 2026",
        period: "26 Feb 2026 · Incident Log",
        type: "Manual",
        size: "1.2 MB",
        status: "ready",
        author: "Safety Officer — Arjun K.",
        summary: "One Level-2 safety incident was recorded at Zone C-7 involving a near-miss pedestrian–vehicle interaction. AI predicted the risk 4 minutes in advance, enabling rapid response.",
        kpis: [
            { label: "Total Incidents", value: "1", change: "-50%", trend: "down" },
            { label: "AI Prediction Lead Time", value: "4 min", change: "+33%", trend: "up" },
            { label: "Response Time", value: "6 min", change: "-25%", trend: "down" },
            { label: "Zone C-7 Risk Score", value: "87%", change: "+12%", trend: "up" },
            { label: "Shuttles Re-routed", value: "2", change: "–", trend: "neutral" },
            { label: "Injuries Reported", value: "0", change: "–", trend: "neutral" },
        ],
        alerts: [
            { severity: "danger", text: "Near-miss: pedestrian–vehicle conflict at Zone C-7", time: "09:38 AM", zone: "Zone C-7", resolved: true },
            { severity: "warning", text: "Zone C-7 crowd density exceeded safe threshold", time: "09:34 AM", zone: "Zone C-7", resolved: true },
            { severity: "info", text: "Shuttle S-02 re-routed to avoid Zone C-7", time: "09:40 AM", zone: "Loop B", resolved: true },
        ],
        hourly: [
            { hour: "08:00", population: 4200, vehicles: 180 },
            { hour: "09:00", population: 9600, vehicles: 360 },
            { hour: "09:34", population: 890, vehicles: 45 },
            { hour: "10:00", population: 11200, vehicles: 410 },
            { hour: "12:00", population: 13800, vehicles: 490 },
        ],
        nudges: [
            { name: "Zone C-7 Access Restriction", compliance: "91%", impact: "Cleared zone within 8 minutes" },
        ],
        zones: [
            { name: "Zone C-7", risk: "high", density: "critical", crowdCount: 890 },
            { name: "Zone A", risk: "low", density: "normal", crowdCount: 2100 },
            { name: "Zone B", risk: "low", density: "moderate", crowdCount: 3600 },
        ],
        energyNote: "No abnormal energy usage reported during the incident. Emergency lighting briefly activated in Zone C-7 for 12 minutes.",
        recommendation: "Install a permanent speed restriction and pedestrian crossing in Zone C-7. Consider CCTV-triggered alerts with 99%+ confidence threshold.",
    },
    {
        id: "r4",
        name: "Energy Consumption Audit",
        date: "Feb 20, 2026",
        period: "1–20 Feb 2026",
        type: "Scheduled",
        size: "5.6 MB",
        status: "ready",
        author: "AathraOS AutoGen",
        summary: "Campus energy consumption for the first 20 days of February was 52 MWh, 7% below the projected baseline. HVAC pre-cooling accounted for the largest savings of 3.2 MWh.",
        kpis: [
            { label: "Total Consumption", value: "52 MWh", change: "-7%", trend: "down" },
            { label: "HVAC Savings", value: "3.2 MWh", change: "+18%", trend: "up" },
            { label: "EV Charging (Off-Peak)", value: "8.4 MWh", change: "+5%", trend: "up" },
            { label: "Lighting Efficiency", value: "94%", change: "+3%", trend: "up" },
            { label: "Peak Demand", value: "3.1 MW", change: "-9%", trend: "down" },
            { label: "Carbon Offset Est.", value: "2.4 tons", change: "+11%", trend: "up" },
        ],
        alerts: [
            { severity: "warning", text: "Unusual HVAC spike — Block D during off-hours", time: "Feb 14 · 02:00 AM", zone: "Block D", resolved: true },
            { severity: "info", text: "EV charging schedule complied 97% of the time", time: "Auto-Log", zone: "Charging Bay 3", resolved: true },
        ],
        hourly: [
            { hour: "Week 1", population: 11400, vehicles: 400 },
            { hour: "Week 2", population: 12200, vehicles: 430 },
            { hour: "Week 3", population: 11800, vehicles: 415 },
            { hour: "Week 4 (partial)", population: 10600, vehicles: 380 },
        ],
        nudges: [
            { name: "Off-Peak EV Charging", compliance: "97%", impact: "8.4 MWh shifted to off-peak" },
            { name: "HVAC Pre-cooling Schedule", compliance: "88%", impact: "3.2 MWh saved vs baseline" },
        ],
        zones: [
            { name: "Block A", risk: "low", density: "normal", crowdCount: 1400 },
            { name: "Block D", risk: "medium", density: "moderate", crowdCount: 800 },
            { name: "Charging Bay 3", risk: "low", density: "normal", crowdCount: 60 },
        ],
        energyNote: "February savings of 3.9 MWh vs January baseline. Primary driver: AI-driven HVAC pre-cooling tied to crowd density prediction. Recommend extending this policy to Block D.",
        recommendation: "Audit Block D HVAC controller firmware — unexplained 02:00 AM spike on Feb 14. Extend pre-cooling policy from Block C to all blocks with occupancy sensors.",
    },
    {
        id: "r5",
        name: "Nudging Campaign Results",
        date: "Feb 18, 2026",
        period: "11–18 Feb 2026",
        type: "Automated",
        size: "3.3 MB",
        status: "ready",
        author: "AathraOS AutoGen",
        summary: "Four nudging campaigns were active during this period. Overall compliance reached 81%, with Route Diversion nudges performing the best at 91% compliance. Crowd dispersal was 28% faster than the pre-nudge baseline.",
        kpis: [
            { label: "Active Campaigns", value: "4", change: "+1", trend: "up" },
            { label: "Overall Compliance", value: "81%", change: "+5%", trend: "up" },
            { label: "Avg Crowd Dispersal", value: "28% faster", change: "+8%", trend: "up" },
            { label: "Gate A Load Reduction", value: "34%", change: "+12%", trend: "up" },
            { label: "Route Diversion Rate", value: "91%", change: "+3%", trend: "up" },
            { label: "User Complaints", value: "2", change: "-60%", trend: "down" },
        ],
        alerts: [
            { severity: "info", text: "Nudge campaign 'Parking Lot B Suggestion' launched", time: "Feb 11", zone: "Parking Lot B", resolved: true },
            { severity: "warning", text: "Low compliance on Gate C Load Balance nudge — Day 2", time: "Feb 13", zone: "Gate C", resolved: true },
            { severity: "info", text: "Route A→B Diversion compliance exceeded 85% threshold", time: "Feb 16", zone: "Route A–B", resolved: true },
        ],
        hourly: [
            { hour: "Day 1", population: 11200, vehicles: 400 },
            { hour: "Day 3", population: 11600, vehicles: 415 },
            { hour: "Day 5", population: 12000, vehicles: 430 },
            { hour: "Day 7", population: 12400, vehicles: 450 },
        ],
        nudges: [
            { name: "Route A → B Diversion", compliance: "91%", impact: "Gate congestion down 34%; ETA improved" },
            { name: "Gate C Load Balance", compliance: "76%", impact: "Queue time reduced by 2.4 min avg" },
            { name: "Parking Lot B Suggestion", compliance: "68%", impact: "Lot A freed 52 spots during peak" },
            { name: "North Entrance Speed Limit Advisory", compliance: "89%", impact: "Near-miss events down 41%" },
        ],
        zones: [
            { name: "Gate A", risk: "low", density: "reduced", crowdCount: 640 },
            { name: "Gate C", risk: "medium", density: "moderate", crowdCount: 1200 },
            { name: "Parking Lot B", risk: "low", density: "normal", crowdCount: 310 },
        ],
        energyNote: "No direct energy impact from nudging campaigns, but reduced vehicle hold time at gates lowered idle emissions.",
        recommendation: "Increase the Gate C Load Balance nudge frequency to 3× per hour and add a digital display near the entrance for better visibility.",
    },
    {
        id: "r6",
        name: "Monthly Executive Summary",
        date: "Feb 01, 2026",
        period: "January 2026",
        type: "Manual",
        size: "12.4 MB",
        status: "ready",
        author: "Operations Director — Priya M.",
        summary: "January 2026 saw a 14% increase in campus population compared to December 2025, driven by the new semester commencement. The AathraOS platform handled 12 major crowd events, 9 emergency-level alerts (all resolved), and delivered a 7.3% reduction in energy costs.",
        kpis: [
            { label: "Monthly Avg Population", value: "10,840", change: "+14%", trend: "up" },
            { label: "Emergency Alerts Resolved", value: "9 / 9", change: "100%", trend: "up" },
            { label: "Energy Cost Saving", value: "₹1.8L", change: "-7.3%", trend: "down" },
            { label: "Shuttle Uptime", value: "98.7%", change: "+1.2%", trend: "up" },
            { label: "Avg Incident Response", value: "11 min", change: "-31%", trend: "down" },
            { label: "Crowd Events Managed", value: "12", change: "+4", trend: "up" },
        ],
        alerts: [
            { severity: "danger", text: "Emergency drill — full campus evacuation test", time: "Jan 15 · 03:00 PM", zone: "All Zones", resolved: true },
            { severity: "danger", text: "Power fluctuation — Block B UPS triggered", time: "Jan 08 · 07:12 AM", zone: "Block B", resolved: true },
            { severity: "warning", text: "Republic Day crowd surge — Main Auditorium", time: "Jan 26 · 10:00 AM", zone: "Main Auditorium", resolved: true },
            { severity: "warning", text: "Semester kickoff traffic peak — all gates", time: "Jan 03 · 08:30 AM", zone: "All Gates", resolved: true },
        ],
        hourly: [
            { hour: "Week 1", population: 9200, vehicles: 330 },
            { hour: "Week 2", population: 11600, vehicles: 415 },
            { hour: "Week 3", population: 11900, vehicles: 425 },
            { hour: "Week 4", population: 10600, vehicles: 380 },
        ],
        nudges: [
            { name: "Semester Kickoff Dispersal", compliance: "83%", impact: "Reduced Gate queues by 28%" },
            { name: "Republic Day Crowd Control", compliance: "87%", impact: "Zero incidents, 14K people managed" },
        ],
        zones: [
            { name: "All Zones", risk: "low", density: "managed", crowdCount: 10840 },
            { name: "Main Auditorium", risk: "medium", density: "event-peak", crowdCount: 3200 },
            { name: "Block B", risk: "low", density: "normal", crowdCount: 1100 },
        ],
        energyNote: "January energy total: 82.4 MWh. Savings of ₹1.8L achieved vs. December baseline. HVAC and off-peak EV charging contributed 68% of those savings.",
        recommendation: "Expand AathraOS coverage to the newly opened Block E. Procure 2 additional EV shuttles to meet semester-peak demand projections for March.",
    },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const sevColor = { danger: "#f87171", warning: "#fbbf24", info: "#06d6f2" };
const sevBg = { danger: "rgba(248,113,113,0.08)", warning: "rgba(251,191,36,0.08)", info: "rgba(6,214,242,0.08)" };
const sevBorder = { danger: "rgba(248,113,113,0.2)", warning: "rgba(251,191,36,0.2)", info: "rgba(6,214,242,0.2)" };
const riskColor = { low: "#34d399", medium: "#fbbf24", high: "#f87171" };
const riskBg = { low: "rgba(52,211,153,0.08)", medium: "rgba(251,191,36,0.08)", high: "rgba(248,113,113,0.08)" };
const typeColor: Record<string, string> = { Automated: "text-cyan", Manual: "text-accent-purple", Scheduled: "text-warning" };
const typeBg: Record<string, string> = { Automated: "rgba(6,214,242,0.08)", Manual: "rgba(167,139,250,0.08)", Scheduled: "rgba(251,191,36,0.08)" };

const maxHourly = (data: HourlyPoint[]) => Math.max(...data.map(d => d.population));

// ── Mini bar chart ─────────────────────────────────────────────────────────────
function MiniBarChart({ data, color }: { data: HourlyPoint[]; color: string }) {
    const max = maxHourly(data);
    return (
        <div className="flex items-end gap-1 h-20 mt-2">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative w-full flex items-end justify-center" style={{ height: 64 }}>
                        <div
                            className="w-full rounded-t-sm transition-all"
                            style={{
                                height: `${(d.population / max) * 64}px`,
                                background: `linear-gradient(to top, ${color}cc, ${color}44)`,
                            }}
                        />
                    </div>
                    <span className="text-[8px] text-text-muted font-mono leading-tight text-center">{d.hour}</span>
                </div>
            ))}
        </div>
    );
}

// ── Download helper (generates a text blob) ────────────────────────────────────
function downloadReport(report: Report) {
    const lines: string[] = [
        `════════════════════════════════════════════════════════`,
        `  AATHRAOS — ${report.name.toUpperCase()}`,
        `════════════════════════════════════════════════════════`,
        `Period    : ${report.period}`,
        `Generated : ${report.date}`,
        `Author    : ${report.author}`,
        `Type      : ${report.type}`,
        ``,
        `EXECUTIVE SUMMARY`,
        `─────────────────`,
        report.summary,
        ``,
        `KEY PERFORMANCE INDICATORS`,
        `──────────────────────────`,
        ...report.kpis.map(k => `  ${k.label.padEnd(30)} ${k.value.padEnd(12)} ${k.change}`),
        ``,
        `ALERTS & INCIDENTS (${report.alerts.length})`,
        `────────────────────────`,
        ...report.alerts.map(a => `  [${a.severity.toUpperCase()}] ${a.time.padEnd(20)} ${a.zone.padEnd(20)} ${a.text}${a.resolved ? " ✓" : ""}`),
        ``,
        `ZONE STATUS`,
        `───────────`,
        ...report.zones.map(z => `  ${z.name.padEnd(24)} Risk: ${z.risk.toUpperCase().padEnd(8)} Crowd: ${z.crowdCount}`),
        ``,
        `NUDGING CAMPAIGNS`,
        `─────────────────`,
        ...report.nudges.map(n => `  ${n.name.padEnd(34)} Compliance: ${n.compliance.padEnd(6)} Impact: ${n.impact}`),
        ``,
        `ENERGY NOTES`,
        `────────────`,
        report.energyNote,
        ``,
        `AI RECOMMENDATION`,
        `─────────────────`,
        report.recommendation,
        ``,
        `════════════════════════════════════════════════════════`,
        `  Generated by AathraOS Command Intelligence Platform`,
        `════════════════════════════════════════════════════════`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AathraOS_${report.name.replace(/\s+/g, "_")}_${report.date.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ── Report Preview Modal ───────────────────────────────────────────────────────
function ReportModal({ report, onClose }: { report: Report; onClose: () => void }) {
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
                className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(18,18,26,0.98) 0%, rgba(26,26,38,0.98) 100%)",
                    border: "1px solid rgba(6,214,242,0.15)",
                    boxShadow: "0 0 60px rgba(6,214,242,0.06), 0 32px 80px rgba(0,0,0,0.7)",
                }}
            >
                {/* Modal Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center">
                            <FileText size={18} className="text-electric" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-text-primary">{report.name}</h2>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[11px] text-text-muted flex items-center gap-1">
                                    <Clock size={10} /> {report.period}
                                </span>
                                <span
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{ color: typeColor[report.type].replace("text-", ""), background: typeBg[report.type] }}
                                >
                                    {report.type}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            id={`download-${report.id}`}
                            onClick={() => downloadReport(report)}
                            className="flex items-center gap-2 btn-primary text-xs py-2 px-4"
                        >
                            <Download size={13} /> Download
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-all"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Summary */}
                    <div
                        className="rounded-xl p-4"
                        style={{ background: "rgba(6,214,242,0.04)", border: "1px solid rgba(6,214,242,0.1)" }}
                    >
                        <h3 className="text-[10px] font-bold tracking-widest uppercase text-cyan/70 mb-2">Executive Summary</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{report.summary}</p>
                        <div className="text-[10px] text-text-muted mt-2 flex items-center gap-2">
                            <span>By {report.author}</span>
                            <span>·</span>
                            <span>{report.size}</span>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div>
                        <h3 className="text-[10px] font-bold tracking-widest uppercase text-text-muted/60 mb-3 flex items-center gap-2">
                            <BarChart3 size={12} className="text-text-muted" /> Key Metrics
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {report.kpis.map((k, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl p-4"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    <div className="text-[9px] font-medium text-text-muted uppercase tracking-wider mb-2">{k.label}</div>
                                    <div className="text-xl font-bold text-text-primary">{k.value}</div>
                                    <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium ${k.trend === "up" ? "text-success" : k.trend === "down" ? "text-cyan" : "text-text-muted"}`}>
                                        {k.trend === "up" ? <TrendingUp size={10} /> : k.trend === "down" ? <TrendingDown size={10} /> : null}
                                        {k.change}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Traffic/Population Chart */}
                    <div
                        className="rounded-xl p-5"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <h3 className="text-[10px] font-bold tracking-widest uppercase text-text-muted/60 mb-1 flex items-center gap-2">
                            <Activity size={12} /> Campus Population Over Period
                        </h3>
                        <MiniBarChart data={report.hourly} color="#06d6f2" />
                    </div>

                    {/* Two-column: Alerts + Zones */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Alerts */}
                        <div>
                            <h3 className="text-[10px] font-bold tracking-widest uppercase text-text-muted/60 mb-3 flex items-center gap-2">
                                <AlertTriangle size={12} /> Alerts &amp; Incidents
                                <span className="ml-auto text-[10px] font-normal">
                                    {report.alerts.filter(a => a.resolved).length}/{report.alerts.length} resolved
                                </span>
                            </h3>
                            <div className="space-y-2">
                                {report.alerts.map((a, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg p-3"
                                        style={{ background: sevBg[a.severity], border: `1px solid ${sevBorder[a.severity]}` }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-[11px] text-text-primary leading-snug flex-1">{a.text}</p>
                                            {a.resolved && <CheckCircle size={12} className="text-success flex-shrink-0 mt-0.5" />}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: sevColor[a.severity] }}>{a.severity}</span>
                                            <span className="text-[9px] text-text-muted">{a.time}</span>
                                            <span
                                                className="text-[9px] px-1.5 rounded"
                                                style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}
                                            >
                                                {a.zone}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Zone Status */}
                        <div>
                            <h3 className="text-[10px] font-bold tracking-widest uppercase text-text-muted/60 mb-3 flex items-center gap-2">
                                <Map size={12} /> Zone Status
                            </h3>
                            <div className="space-y-2">
                                {report.zones.map((z, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg px-4 py-3 flex items-center justify-between"
                                        style={{ background: riskBg[z.risk], border: `1px solid ${riskColor[z.risk]}22` }}
                                    >
                                        <div>
                                            <div className="text-xs font-medium text-text-primary">{z.name}</div>
                                            <div className="text-[10px] text-text-muted mt-0.5 flex items-center gap-2">
                                                <Users size={9} /> {z.crowdCount.toLocaleString()} · {z.density}
                                            </div>
                                        </div>
                                        <span
                                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                            style={{ color: riskColor[z.risk], background: riskBg[z.risk], border: `1px solid ${riskColor[z.risk]}33` }}
                                        >
                                            {z.risk}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Nudging Campaigns */}
                    <div>
                        <h3 className="text-[10px] font-bold tracking-widest uppercase text-text-muted/60 mb-3 flex items-center gap-2">
                            <TrendingUp size={12} /> Nudging Campaigns
                        </h3>
                        <div className="space-y-2">
                            {report.nudges.map((n, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl px-4 py-3 flex items-center justify-between"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    <div>
                                        <div className="text-xs font-medium text-text-primary">{n.name}</div>
                                        <div className="text-[10px] text-text-muted mt-0.5">{n.impact}</div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                                        <div className="w-20 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-success"
                                                style={{ width: n.compliance }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-success">{n.compliance}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Energy + Recommendation */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div
                            className="rounded-xl p-4"
                            style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}
                        >
                            <h3 className="text-[10px] font-bold tracking-widest uppercase text-accent-purple/70 mb-2 flex items-center gap-2">
                                <Zap size={11} /> Energy Notes
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed">{report.energyNote}</p>
                        </div>
                        <div
                            className="rounded-xl p-4"
                            style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}
                        >
                            <h3 className="text-[10px] font-bold tracking-widest uppercase text-success/70 mb-2 flex items-center gap-2">
                                <ShieldCheck size={11} /> AI Recommendation
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed">{report.recommendation}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [filter, setFilter] = useState<"All" | "Automated" | "Manual" | "Scheduled">("All");

    const filtered = filter === "All" ? REPORTS : REPORTS.filter(r => r.type === filter);

    return (
        <>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {/* Header */}
                <motion.div variants={anim} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                            <FileText size={24} className="text-electric" />
                            Reports
                        </h1>
                        <p className="text-sm text-text-muted mt-1">Click any report to preview · download as needed</p>
                    </div>
                    <div className="flex gap-2">
                        {(["All", "Automated", "Manual", "Scheduled"] as const).map(f => (
                            <button
                                key={f}
                                id={`filter-${f.toLowerCase()}`}
                                onClick={() => setFilter(f)}
                                className={`text-xs py-2 px-3 rounded-lg border transition-all ${filter === f
                                    ? "bg-cyan/10 text-cyan border-cyan/30"
                                    : "text-text-muted border-border hover:border-border-light hover:text-text-secondary"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Summary strip */}
                <motion.div variants={anim} className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Reports", value: REPORTS.length.toString(), icon: FileText, color: "text-electric", bg: "bg-electric/10" },
                        { label: "Automated", value: REPORTS.filter(r => r.type === "Automated").length.toString(), icon: Activity, color: "text-cyan", bg: "bg-cyan/10" },
                        { label: "Latest Report", value: "Feb 28, 2026", icon: Calendar, color: "text-success", bg: "bg-success/10" },
                    ].map((s) => (
                        <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                                <s.icon size={16} className={s.color} />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-text-primary">{s.value}</div>
                                <div className="text-[10px] text-text-muted">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Reports table */}
                <motion.div variants={anim}>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        {["Report Name", "Period", "Type", "Size", "Actions"].map((h) => (
                                            <th key={h} className="text-left text-[10px] font-semibold text-text-muted tracking-wider uppercase px-5 py-4">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filtered.map((r) => (
                                        <motion.tr
                                            key={r.id}
                                            id={`report-row-${r.id}`}
                                            whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                                            className="cursor-pointer transition-colors group"
                                            onClick={() => setSelectedReport(r)}
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center group-hover:bg-electric/20 transition-colors">
                                                        <FileText size={14} className="text-electric" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-medium text-text-primary group-hover:text-cyan transition-colors">{r.name}</span>
                                                        <p className="text-[10px] text-text-muted mt-0.5 truncate max-w-[240px]">{r.summary.slice(0, 64)}…</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-xs text-text-secondary flex items-center gap-1.5 whitespace-nowrap">
                                                    <Calendar size={10} className="text-text-muted" /> {r.date}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className="text-[10px] px-2 py-0.5 rounded font-semibold"
                                                    style={{ color: typeColor[r.type].replace("text-", ""), background: typeBg[r.type] }}
                                                >
                                                    {r.type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs font-mono text-text-muted">{r.size}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        id={`preview-${r.id}`}
                                                        className="text-[10px] text-text-secondary hover:text-cyan transition-colors flex items-center gap-1"
                                                        onClick={(e) => { e.stopPropagation(); setSelectedReport(r); }}
                                                    >
                                                        <Eye size={12} /> Preview
                                                    </button>
                                                    <button
                                                        id={`dl-${r.id}`}
                                                        className="text-[10px] text-text-secondary hover:text-electric transition-colors flex items-center gap-1"
                                                        onClick={(e) => { e.stopPropagation(); downloadReport(r); }}
                                                    >
                                                        <Download size={12} /> Download
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <motion.div variants={anim} className="text-center py-16 text-text-muted">
                        <FileText size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No {filter} reports found.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Preview Modal */}
            <AnimatePresence>
                {selectedReport && (
                    <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
                )}
            </AnimatePresence>
        </>
    );
}
