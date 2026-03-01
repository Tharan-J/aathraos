import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy_key_for_build" });

// ── Mock live data context ─────────────────────────────────────────────────────
const MOCK_DATA = {
  campus: {
    population: 12847,
    vehicleCount: 450,
    riskLevel: "Low",
    energyConsumption: "2.4 MW",
    timestamp: new Date().toISOString(),
  },
  alerts: [
    { text: "Gate B congestion predicted in 12 minutes", severity: "warning", confidence: "94%", time: "2 min ago" },
    { text: "High collision risk zone detected — Zone C-7", severity: "danger", confidence: "87%", time: "5 min ago" },
    { text: "Event surge expected — North Auditorium", severity: "warning", confidence: "91%", time: "8 min ago" },
    { text: "Optimal shuttle dispatch window in 4 min", severity: "info", confidence: "96%", time: "10 min ago" },
    { text: "HVAC pre-cooling recommendation triggered", severity: "info", confidence: "89%", time: "15 min ago" },
  ],
  shuttles: [
    { id: "S-01", status: "active", route: "Loop A", battery: 72 },
    { id: "S-02", status: "active", route: "Loop B", battery: 58 },
    { id: "S-03", status: "charging", route: "—", battery: 34 },
    { id: "S-04", status: "idle", route: "—", battery: 91 },
    { id: "S-05", status: "active", route: "Express", battery: 65 },
  ],
  nudges: [
    { name: "Route A → B diversion", status: "active", compliance: "78%" },
    { name: "Gate C load balance", status: "active", compliance: "85%" },
    { name: "Parking lot B suggestion", status: "pending", compliance: "—" },
  ],
  utilities: {
    hvac: { status: "Triggered", zone: "Building Zone C", reason: "Mobility surge detected", note: "Building Zone C pre-cooling activated" },
    charging: { status: "Optimized", note: "Off-peak charging aligned with demand forecast" },
    lighting: { status: "Active", note: "Ambient light adjusted based on crowd density" },
  },
  zones: {
    "Zone A": { density: "moderate", crowdCount: 2340, risk: "low" },
    "Zone B": { density: "high", crowdCount: 4120, risk: "medium" },
    "Zone C-7": { density: "critical", crowdCount: 890, risk: "high" },
    "North Auditorium": { density: "surge-expected", crowdCount: 1560, risk: "medium" },
    "Gate B": { density: "congestion-predicted", crowdCount: 780, risk: "high" },
    "Parking Lot B": { density: "normal", crowdCount: 230, risk: "low" },
  },
  emergencyState: {
    active: false,
    level: null,
    activatedAt: null,
    affectedZones: [],
  },
};

// ── System Prompt ──────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are AathraOS Command AI — an intelligent operations assistant embedded in the AathraOS Smart Campus Management System. You assist the admin with real-time situational awareness, emergency guidance, and operational decisions.

## Your Role
- Provide current system status from the live data feed
- Identify and explain active alerts and their risk levels
- Suggest alternate solutions and corrective actions for issues
- Help activate and manage emergency protocols via text commands
- Stay strictly focused on campus operations, safety, mobility, utilities, and emergency management

## Live System Data (as of ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })})

### Campus Overview
- **Population**: ${MOCK_DATA.campus.population.toLocaleString()} people on campus
- **Vehicle Count**: ${MOCK_DATA.campus.vehicleCount} vehicles active
- **Risk Level**: ${MOCK_DATA.campus.riskLevel}
- **Energy Consumption**: ${MOCK_DATA.campus.energyConsumption}

### Active Alerts (${MOCK_DATA.alerts.length} total)
${MOCK_DATA.alerts.map((a, i) => `${i + 1}. [${a.severity.toUpperCase()}] ${a.text} — Confidence: ${a.confidence} (${a.time})`).join("\n")}

### Shuttle Fleet Status
${MOCK_DATA.shuttles.map(s => `- ${s.id}: ${s.status.toUpperCase()} | Route: ${s.route} | Battery: ${s.battery}%`).join("\n")}

### Active Nudges / Traffic Management
${MOCK_DATA.nudges.map(n => `- ${n.name}: ${n.status} (Compliance: ${n.compliance})`).join("\n")}

### Utilities Status
- HVAC: ${MOCK_DATA.utilities.hvac.status} — ${MOCK_DATA.utilities.hvac.note || MOCK_DATA.utilities.hvac.zone}
- EV Charging: ${MOCK_DATA.utilities.charging.status} — ${MOCK_DATA.utilities.charging.note}
- Lighting: ${MOCK_DATA.utilities.lighting.status} — ${MOCK_DATA.utilities.lighting.note}

### Zone Densities
${Object.entries(MOCK_DATA.zones).map(([zone, data]) => `- ${zone}: ${data.density} (${data.crowdCount} people) | Risk: ${(data as any).risk}`).join("\n")}

## Emergency Commands
The admin can type commands like:
- "activate emergency level 1" / "emergency red" → Critical emergency (evacuation)
- "activate emergency level 2" / "emergency orange" → High alert (restrict access)
- "activate emergency level 3" / "emergency yellow" → Caution (monitor closely)
- "deactivate emergency" / "all clear" → Deactivate emergency mode
- "evacuate zone [name]" → Zone-specific evacuation

When an emergency command is detected, respond with:
1. Confirmation of the command
2. What the emergency level means
3. Recommended immediate actions
4. Which zones/systems are affected
5. Include the JSON trigger at the end in this exact format:
   EMERGENCY_ACTION:{"type":"activate","level":1,"zones":["Zone C-7","Gate B"],"message":"Emergency Level 1 Activated"}
   or for deactivation:
   EMERGENCY_ACTION:{"type":"deactivate","message":"All Clear - Emergency Deactivated"}

## Response Guidelines
- Be concise but comprehensive — you are talking to a trained admin
- Use bullet points and structured responses for clarity
- Always lead with the most critical information
- For emergency situations, be direct and action-oriented
- If asked about topics unrelated to campus operations, politely decline and redirect
- Use data from the live system feed to back up your assessments
- Suggest proactive measures, not just reactive ones
- Current time context: India Standard Time (IST)`;

// ── POST handler ───────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    // Build conversation history for multi-turn chat
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const text = response.text ?? "";

    // Parse emergency action if present
    let emergencyAction = null;
    const emergencyMatch = text.match(/EMERGENCY_ACTION:(\{[\s\S]*?\})/);
    if (emergencyMatch) {
      try {
        emergencyAction = JSON.parse(emergencyMatch[1]);
      } catch { }
    }

    // Strip the EMERGENCY_ACTION line from the displayed text
    const cleanText = text.replace(/EMERGENCY_ACTION:\{[\s\S]*?\}/, "").trim();

    return NextResponse.json({ text: cleanText, emergencyAction });
  } catch (err: any) {
    console.error("Chatbot API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
