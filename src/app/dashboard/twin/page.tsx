"use client";

import { motion } from "framer-motion";
import { Box, Layers, Eye, RotateCcw, Maximize2 } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DigitalTwinPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={anim} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <Box size={24} className="text-cyan" />
                        Digital Twin
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Interactive 3D model of the campus infrastructure</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
                        <RotateCcw size={12} /> Reset View
                    </button>
                    <button className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
                        <Maximize2 size={12} /> Fullscreen
                    </button>
                </div>
            </motion.div>

            {/* 3D Viewport */}
            <motion.div variants={anim}>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="aspect-[21/9] relative bg-[#080810]">
                        {/* SVG isometric campus view */}
                        <svg className="w-full h-full" viewBox="0 0 1200 500" fill="none">
                            {/* Ground grid */}
                            {Array.from({ length: 30 }, (_, i) => (
                                <line key={`g${i}`} x1={100 + i * 35} y1={50} x2={100 + i * 35} y2={450}
                                    stroke="rgba(6,214,242,0.02)" strokeWidth="0.5" />
                            ))}
                            {Array.from({ length: 15 }, (_, i) => (
                                <line key={`gh${i}`} x1={100} y1={50 + i * 30} x2={1100} y2={50 + i * 30}
                                    stroke="rgba(6,214,242,0.02)" strokeWidth="0.5" />
                            ))}

                            {/* Buildings - isometric style */}
                            {[
                                { x: 200, y: 150, w: 100, h: 70, bh: 60, label: "Admin Block", color: "6,214,242" },
                                { x: 380, y: 200, w: 130, h: 80, bh: 80, label: "Hub Central", color: "167,139,250" },
                                { x: 580, y: 160, w: 90, h: 60, bh: 50, label: "Lab Wing A", color: "6,214,242" },
                                { x: 750, y: 220, w: 110, h: 70, bh: 70, label: "Research Park", color: "52,211,153" },
                                { x: 300, y: 320, w: 80, h: 50, bh: 40, label: "Dormitory", color: "244,114,182" },
                                { x: 500, y: 350, w: 120, h: 65, bh: 55, label: "Sports Complex", color: "6,214,242" },
                                { x: 700, y: 370, w: 95, h: 55, bh: 45, label: "Energy Hub", color: "251,191,36" },
                                { x: 900, y: 180, w: 80, h: 55, bh: 65, label: "Tower A", color: "96,165,250" },
                            ].map((b, i) => (
                                <g key={i}>
                                    {/* Building base */}
                                    <rect x={b.x} y={b.y} width={b.w} height={b.h}
                                        fill={`rgba(${b.color},0.06)`} stroke={`rgba(${b.color},0.15)`} rx="3" />
                                    {/* Height indicator */}
                                    <rect x={b.x + 2} y={b.y - b.bh * 0.3} width={b.w - 4} height={b.bh * 0.3}
                                        fill={`rgba(${b.color},0.03)`} stroke={`rgba(${b.color},0.08)`} rx="2" />
                                    {/* Label */}
                                    <text x={b.x + b.w / 2} y={b.y + b.h + 15}
                                        fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle" fontFamily="Inter">{b.label}</text>
                                    {/* Active indicator */}
                                    <circle cx={b.x + b.w - 8} cy={b.y + 8} r="3" fill={`rgba(${b.color},0.6)`}>
                                        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                                    </circle>
                                </g>
                            ))}

                            {/* Connection paths */}
                            <path d="M300 185 Q340 210 380 240" stroke="rgba(6,214,242,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                            <path d="M510 240 Q545 210 580 190" stroke="rgba(6,214,242,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                            <path d="M670 190 Q710 210 750 255" stroke="rgba(52,211,153,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                            <path d="M380 345 Q440 350 500 380" stroke="rgba(244,114,182,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                        </svg>

                        {/* Controls overlay */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-text-muted hover:text-cyan transition-colors">
                                <Layers size={14} />
                            </button>
                            <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-text-muted hover:text-cyan transition-colors">
                                <Eye size={14} />
                            </button>
                        </div>

                        {/* Info panel */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <div className="glass rounded-lg px-3 py-2 flex items-center gap-4 text-[10px] text-text-muted">
                                <span>847 entities</span>
                                <span className="w-px h-3 bg-border" />
                                <span>12 buildings</span>
                                <span className="w-px h-3 bg-border" />
                                <span>3 active routes</span>
                                <span className="w-px h-3 bg-border" />
                                <span>Last sync: 2s ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Building Details */}
            <motion.div variants={anim}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { name: "Hub Central", pop: 1247, energy: "340 kW", temp: "23°C", status: "normal" },
                        { name: "Lab Wing A", pop: 89, energy: "120 kW", temp: "21°C", status: "normal" },
                        { name: "Research Park", pop: 456, energy: "280 kW", temp: "22°C", status: "warning" },
                        { name: "Tower A", pop: 312, energy: "190 kW", temp: "24°C", status: "normal" },
                    ].map((b) => (
                        <div key={b.name} className="glass-card rounded-xl p-4">
                            <h3 className="text-xs font-semibold text-text-primary mb-3">{b.name}</h3>
                            <div className="space-y-2 text-[10px] text-text-muted">
                                <div className="flex justify-between"><span>Population</span><span className="text-text-secondary font-mono">{b.pop}</span></div>
                                <div className="flex justify-between"><span>Energy</span><span className="text-text-secondary font-mono">{b.energy}</span></div>
                                <div className="flex justify-between"><span>Temperature</span><span className="text-text-secondary font-mono">{b.temp}</span></div>
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className={`font-medium ${b.status === "normal" ? "text-success" : "text-warning"}`}>{b.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
