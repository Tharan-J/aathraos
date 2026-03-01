"use client";

import { useEffect, useRef } from "react";

interface HeatPoint {
    x: number;
    y: number;
    intensity: number;
    vx: number;
    vy: number;
}

export default function MobilityMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (!rect) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.scale(dpr, dpr);
            return { w: rect.width, h: rect.height };
        };

        const dims = resize();
        if (!dims) return;
        const { w, h } = dims;

        // Create heat points for crowd density
        const heatPoints: HeatPoint[] = [];
        for (let i = 0; i < 8; i++) {
            heatPoints.push({
                x: Math.random() * w,
                y: Math.random() * h,
                intensity: 0.3 + Math.random() * 0.7,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
            });
        }

        // Shuttle routes
        const routes = [
            { points: [{ x: w * 0.1, y: h * 0.3 }, { x: w * 0.3, y: h * 0.2 }, { x: w * 0.5, y: h * 0.25 }, { x: w * 0.7, y: h * 0.4 }, { x: w * 0.9, y: h * 0.35 }], color: "#06d6f2" },
            { points: [{ x: w * 0.15, y: h * 0.7 }, { x: w * 0.35, y: h * 0.6 }, { x: w * 0.5, y: h * 0.55 }, { x: w * 0.65, y: h * 0.65 }, { x: w * 0.85, y: h * 0.7 }], color: "#a78bfa" },
            { points: [{ x: w * 0.2, y: h * 0.5 }, { x: w * 0.4, y: h * 0.45 }, { x: w * 0.6, y: h * 0.5 }, { x: w * 0.8, y: h * 0.45 }], color: "#34d399" },
        ];

        // Gates
        const gates = [
            { x: w * 0.08, y: h * 0.5, label: "Gate A", load: 0.4 },
            { x: w * 0.92, y: h * 0.5, label: "Gate B", load: 0.85 },
            { x: w * 0.5, y: h * 0.08, label: "Gate C", load: 0.6 },
            { x: w * 0.5, y: h * 0.92, label: "Gate D", load: 0.3 },
        ];

        // Grid
        const drawGrid = () => {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
            ctx.lineWidth = 0.5;
            const spacing = 40;
            for (let x = 0; x < w; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        };

        // Buildings (rectangles)
        const buildings = [
            { x: w * 0.25, y: h * 0.2, w: 60, h: 40 },
            { x: w * 0.45, y: h * 0.35, w: 80, h: 50 },
            { x: w * 0.65, y: h * 0.55, w: 55, h: 45 },
            { x: w * 0.3, y: h * 0.65, w: 70, h: 35 },
            { x: w * 0.7, y: h * 0.25, w: 50, h: 50 },
            { x: w * 0.15, y: h * 0.45, w: 45, h: 30 },
        ];

        let time = 0;

        const animate = () => {
            time += 0.01;
            ctx.clearRect(0, 0, w, h);

            // Background
            ctx.fillStyle = "#0d0d14";
            ctx.fillRect(0, 0, w, h);

            drawGrid();

            // Draw buildings
            buildings.forEach((b) => {
                ctx.fillStyle = "rgba(26, 26, 38, 0.8)";
                ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                ctx.lineWidth = 1;
                ctx.strokeRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
            });

            // Heat map
            heatPoints.forEach((hp) => {
                hp.x += hp.vx;
                hp.y += hp.vy;
                if (hp.x < 0 || hp.x > w) hp.vx *= -1;
                if (hp.y < 0 || hp.y > h) hp.vy *= -1;

                const radius = 60 + hp.intensity * 40;
                const grad = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, radius);
                const alpha = hp.intensity * 0.12;
                grad.addColorStop(0, `rgba(6, 214, 242, ${alpha})`);
                grad.addColorStop(0.5, `rgba(6, 214, 242, ${alpha * 0.3})`);
                grad.addColorStop(1, "rgba(6, 214, 242, 0)");
                ctx.beginPath();
                ctx.arc(hp.x, hp.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            });

            // Draw routes
            routes.forEach((route) => {
                ctx.beginPath();
                ctx.moveTo(route.points[0].x, route.points[0].y);
                for (let i = 1; i < route.points.length; i++) {
                    const prev = route.points[i - 1];
                    const curr = route.points[i];
                    const cpx = (prev.x + curr.x) / 2;
                    const cpy = (prev.y + curr.y) / 2;
                    ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
                }
                const last = route.points[route.points.length - 1];
                ctx.lineTo(last.x, last.y);
                ctx.strokeStyle = route.color + "30";
                ctx.lineWidth = 2;
                ctx.stroke();

                // Moving shuttle dot
                const segLen = route.points.length - 1;
                const tNorm = ((time * 0.5) % 1);
                const seg = Math.floor(tNorm * segLen);
                const segT = (tNorm * segLen) - seg;
                if (seg < segLen) {
                    const px = route.points[seg].x + (route.points[seg + 1].x - route.points[seg].x) * segT;
                    const py = route.points[seg].y + (route.points[seg + 1].y - route.points[seg].y) * segT;
                    // Glow
                    const gf = ctx.createRadialGradient(px, py, 0, px, py, 12);
                    gf.addColorStop(0, route.color + "40");
                    gf.addColorStop(1, route.color + "00");
                    ctx.beginPath();
                    ctx.arc(px, py, 12, 0, Math.PI * 2);
                    ctx.fillStyle = gf;
                    ctx.fill();
                    // Dot
                    ctx.beginPath();
                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                    ctx.fillStyle = route.color;
                    ctx.fill();
                }
            });

            // Draw gates
            gates.forEach((gate) => {
                // Ring
                const ringColor = gate.load > 0.7 ? "#f87171" : gate.load > 0.5 ? "#fbbf24" : "#34d399";
                ctx.beginPath();
                ctx.arc(gate.x, gate.y, 14, 0, Math.PI * 2);
                ctx.strokeStyle = ringColor + "60";
                ctx.lineWidth = 2;
                ctx.stroke();

                // Arc showing load
                ctx.beginPath();
                ctx.arc(gate.x, gate.y, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * gate.load);
                ctx.strokeStyle = ringColor;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Center dot
                ctx.beginPath();
                ctx.arc(gate.x, gate.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = ringColor;
                ctx.fill();

                // Label
                ctx.font = "9px Inter, sans-serif";
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.textAlign = "center";
                ctx.fillText(gate.label, gate.x, gate.y + 26);
            });

            animRef.current = requestAnimationFrame(animate);
        };

        animate();

        const resizeHandler = () => {
            cancelAnimationFrame(animRef.current);
            resize();
            animate();
        };
        window.addEventListener("resize", resizeHandler);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    );
}
