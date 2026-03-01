import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const CAMPUS_CONTEXT = `
Campus Baseline Data:
- Normal peak population: 12,847 people
- Normal vehicle count: 450 vehicles
- Active zones: Zone A (2,340 people, low risk), Zone B (4,120 people, medium risk), Zone C-7 (890 people, high risk), North Auditorium (1,560 people), Gate B (780 people, congested), Parking Lot B (230 people)
- Shuttle fleet: S-01 (Loop A, 72% battery), S-02 (Loop B, 58% battery), S-03 (charging, 34%), S-04 (idle, 91%), S-05 (Express, 65%)
- Current energy: 2.4 MW consumption
- Active nudges: Route A→B diversion (78% compliance), Gate C load balance (85% compliance)
- Current alerts: Gate B congestion predicted, Zone C-7 high collision risk, North Auditorium event surge expected
- Campus venue capacities: Hub Central Auditorium (3,000), Main Campus Loop (outdoor, unlimited), Exhibition Hall (3,500), Open Air Theater (2,000), North Auditorium (2,200), Sports Complex (1,800), Block C Seminar Hall (400)
- Parking capacity: Lot A (350 spots), Lot B (280 spots), Visitor Lot (120 spots)
- Gate capacities: Gate A (primary, high capacity), Gate B (currently congested), Gate C (medium capacity), Gate D (secondary)
`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    const { event } = await req.json();

    const prompt = `You are AathraOS Event Intelligence AI. Analyze the following scheduled campus event and provide structured operational insights.

${CAMPUS_CONTEXT}

## Event Details to Analyze:
- **Name**: ${event.name}
- **Date**: ${event.date}
- **Time**: ${event.startTime} – ${event.endTime}
- **Venue**: ${event.venue}
- **Expected Attendees**: ${event.attendees}
- **Event Type**: ${event.type}
- **Description**: ${event.description || "Not provided"}

## Your Analysis Must Cover:

### 1. Impact Assessment
- Overall impact level (Low / Medium / High / Critical) and why
- Crowd density impact on affected zones
- Vehicle and parking load estimation
- Energy demand spike estimate

### 2. Pre-Event Preparations (24–48 hours before)
- Infrastructure changes needed
- Shuttle route adjustments
- Gate management recommendations
- Parking allocations

### 3. During-Event Operations
- Real-time crowd management nudges to activate
- HVAC/energy pre-cooling schedule
- Recommended shuttle dispatch frequency
- Zone access restrictions if any

### 4. Risk Flags
- List specific risks based on current campus state and this event
- Conflict with existing alerts (Gate B congestion, Zone C-7 high risk)
- Bottleneck zones

### 5. Post-Event Dispersal Plan
- Estimated dispersal time
- Recommended dispersal nudges
- Shuttle surge plan

Keep the response structured, concise and action-oriented. Use bullet points. Be specific with zone names, gate names, shuttle IDs, and time windows.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.65,
        maxOutputTokens: 1200,
      },
    });

    const text = response.text ?? "";
    return NextResponse.json({ insights: text });
  } catch (err: any) {
    console.error("Event insights API error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate insights" }, { status: 500 });
  }
}
