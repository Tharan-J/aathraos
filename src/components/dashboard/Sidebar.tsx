"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Navigation,
    ShieldAlert,
    Zap,
    Map,
    Brain,
    Box,
    Calendar,
    AlertTriangle,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const coreNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Mobility Intelligence", href: "/dashboard/mobility", icon: Navigation },
    { label: "Safety Monitor", href: "/dashboard/safety", icon: ShieldAlert },
    { label: "Utilities & Energy", href: "/dashboard/utilities", icon: Zap },
    { label: "Planning & Simulation", href: "/dashboard/planning", icon: Map },
];

const advancedNav = [
    { label: "Nudging Engine", href: "/dashboard/nudging", icon: Brain },
    { label: "Digital Twin", href: "/dashboard/twin", icon: Box },
    { label: "Event Control", href: "/dashboard/events", icon: Calendar },
    { label: "Emergency Mode", href: "/dashboard/emergency", icon: AlertTriangle },
];

const systemNav = [
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const NavItem = ({ item }: { item: { label: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }> } }) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        const isEmergency = item.href === "/dashboard/emergency";

        return (
            <Link
                href={item.href}
                className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative
          ${isActive
                        ? "bg-cyan/10 text-cyan"
                        : isEmergency
                            ? "text-danger/70 hover:bg-danger/5 hover:text-danger"
                            : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                    }
        `}
                title={collapsed ? item.label : undefined}
            >
                {isActive && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <Icon size={18} className={isActive ? "text-cyan" : isEmergency ? "" : "text-text-muted group-hover:text-text-secondary"} />
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap overflow-hidden"
                        >
                            {item.label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        );
    };

    const SectionLabel = ({ label }: { label: string }) => (
        <AnimatePresence>
            {!collapsed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 pt-6 pb-2"
                >
                    <span className="text-[10px] font-semibold tracking-[2px] uppercase text-text-muted/50">
                        {label}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 bottom-0 z-40 bg-surface/80 backdrop-blur-xl border-r border-border flex flex-col"
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-5 border-b border-border gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan/20 to-blue/10 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#06d6f2" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="#06d6f2" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="#06d6f2" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
                    </svg>
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm font-semibold text-text-primary whitespace-nowrap"
                        >
                            Aathra<span className="text-cyan ml-0.5 font-light">OS</span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
                <SectionLabel label="Core" />
                {coreNav.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}

                <SectionLabel label="Advanced" />
                {advancedNav.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}

                <SectionLabel label="System" />
                {systemNav.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}
            </div>

            {/* Collapse toggle + Logout */}
            <div className="border-t border-border p-3 space-y-1">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-danger hover:bg-danger/5 transition-all"
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut size={18} />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="whitespace-nowrap"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center py-2 rounded-lg text-text-muted hover:bg-surface-elevated transition-colors"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>
        </motion.aside>
    );
}
