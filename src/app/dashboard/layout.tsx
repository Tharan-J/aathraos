"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import Chatbot from "@/components/dashboard/Chatbot";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="ml-[260px] transition-all duration-300">
                <TopBar />
                <main className="p-6">{children}</main>
            </div>
            {/* AI Command Chatbot — available across all dashboard pages */}
            <Chatbot />
        </div>
    );
}
