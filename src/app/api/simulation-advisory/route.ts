import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    const { event, phase, currentMetrics } = await req.json();

    const prompt = `You are AathraOS Live Simulation AI. An event simulation is currently running for the following event.

## Event
- Name: ${event.name}
- Date: ${event.date}, Time: ${event.startTime}–${event.endTime}
- Venue: ${event.venue}
- Attendees: ${event.attendees}
- Type: ${event.type}
- Impact Level: ${event.impact}

## Current Simulation Phase: ${phase}
${phase === "pre-event" ? "T-60 min: Pre-event preparation window" : ""}
${phase === "arrival" ? "T-0: Attendees arriving. Entry surge in progress." : ""}
${phase === "peak" ? "Peak occupancy reached. Maximum crowd density active." : ""}
${phase === "event" ? "Event in progress. Sustained crowd at venue." : ""}
${phase === "dispersal" ? "Event ended. Dispersal in progress." : ""}

## Live Campus Metrics (Simulated)
- Campus Population: ${currentMetrics.population.toLocaleString()} (${currentMetrics.populationDelta > 0 ? "+" : ""}${currentMetrics.populationDelta}%)
- Active Vehicles: ${currentMetrics.vehicles}
- Gate B Load: ${currentMetrics.gateBLoad}%
- Zone C-7 Risk: ${currentMetrics.zoneRisk}
- Energy Draw: ${currentMetrics.energy} MW
- Shuttle Utilization: ${currentMetrics.shuttleUtil}%
- Parking Usage: ${currentMetrics.parking}%

## Generate a real-time operational advisory. Be concise — max 4 bullet points total. Cover:
1. The most critical action needed RIGHT NOW for this phase
2. One specific resource redeployment (shuttle, gate, zone)
3. One energy or utility adjustment
4. One proactive risk mitigation

Format each point starting with a bold label like **[ACTION]**, **[FLEET]**, **[ENERGY]**, **[RISK]**.
Be specific with zone names, gate names, shuttle IDs, and times. No preamble.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.75, maxOutputTokens: 400 },
    });

    return NextResponse.json({ advisory: response.text ?? "" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
