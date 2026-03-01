"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, ChevronDown } from "lucide-react";

const roles = [
    { value: "admin", label: "Admin" },
    { value: "mobility", label: "Mobility Operator" },
    { value: "safety", label: "Safety Control" },
    { value: "planner", label: "Planner" },
];

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 1200);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-background" />
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute inset-0 gradient-mesh" />

            {/* Animated grid lines */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-px bg-gradient-to-r from-transparent via-cyan/10 to-transparent"
                        style={{ top: `${20 + i * 15}%`, left: 0, right: 0 }}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 4, delay: i * 0.8, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="glass-card rounded-2xl p-8 neon-border">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/20 to-blue/10 flex items-center justify-center">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#06d6f2" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="#06d6f2" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="#06d6f2" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold text-text-primary">
                                Aathra<span className="text-cyan ml-1 font-light">OS</span>
                            </span>
                        </Link>
                        <h1 className="text-xl font-bold text-text-primary mb-1">
                            Urban Kernel Access
                        </h1>
                        <p className="text-sm text-text-muted">
                            Authenticate to enter the command center
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-2">
                                Email / Operator ID
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@aathra.sys"
                                className="w-full bg-surface-light/50 border border-border-light rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-cyan/30 focus:ring-1 focus:ring-cyan/20 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className="w-full bg-surface-light/50 border border-border-light rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-cyan/30 focus:ring-1 focus:ring-cyan/20 transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-2">
                                Access Role
                            </label>
                            <div className="relative">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-surface-light/50 border border-border-light rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-cyan/30 focus:ring-1 focus:ring-cyan/20 transition-all appearance-none cursor-pointer"
                                >
                                    {roles.map((r) => (
                                        <option key={r.value} value={r.value} className="bg-surface text-text-primary">
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-3.5 h-3.5 rounded border-border-light bg-surface-light accent-cyan"
                                />
                                <span className="text-xs text-text-muted">Remember me</span>
                            </label>
                            <button type="button" className="text-xs text-cyan/70 hover:text-cyan transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                                />
                            ) : (
                                <>
                                    Access Command Center
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security */}
                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-center gap-2">
                        <Shield size={12} className="text-success" />
                        <span className="text-[11px] text-text-muted">
                            Secure access for authorized operators
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
