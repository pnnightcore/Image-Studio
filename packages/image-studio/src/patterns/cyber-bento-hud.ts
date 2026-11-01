import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: 🎛️ Cyber Bento HUD
 * Bố cục Bento Grid 4 khối modular với telemetry năng lượng, radar active và HUD scan
 */
export const cyberBentoHudPattern: StudioPattern = {
  "id": "cyber-bento-hud",
  "name": "🎛️ Cyber Bento HUD",
  "description": "Bố cục Bento Grid 4 khối modular với telemetry năng lượng, radar active và HUD scan",
  "duration": 2000,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Cyber Bento HUD",
    "width": 930,
    "height": 280,
    "background": "#070a12",
    "elements": [
      {
        "id": "cell-left",
        "type": "box",
        "x": 20,
        "y": 20,
        "width": 220,
        "height": 240,
        "backgroundColor": "rgba(12, 22, 38, 0.8)",
        "border": "1px solid rgba(56, 189, 248, 0.25)",
        "borderRadius": 16,
        "zIndex": 1
      },
      {
        "id": "cell-center-top",
        "type": "box",
        "x": 255,
        "y": 20,
        "width": 425,
        "height": 125,
        "backgroundColor": "rgba(12, 22, 38, 0.8)",
        "border": "1px solid rgba(56, 189, 248, 0.25)",
        "borderRadius": 16,
        "zIndex": 1
      },
      {
        "id": "cell-center-bottom",
        "type": "box",
        "x": 255,
        "y": 155,
        "width": 425,
        "height": 105,
        "backgroundColor": "rgba(12, 22, 38, 0.8)",
        "border": "1px solid rgba(56, 189, 248, 0.25)",
        "borderRadius": 16,
        "zIndex": 1
      },
      {
        "id": "cell-right",
        "type": "box",
        "x": 695,
        "y": 20,
        "width": 215,
        "height": 240,
        "backgroundColor": "rgba(12, 22, 38, 0.8)",
        "border": "1px solid rgba(56, 189, 248, 0.25)",
        "borderRadius": 16,
        "zIndex": 1
      },
      {
        "id": "radar-badge",
        "type": "badge",
        "x": 35,
        "y": 35,
        "width": 190,
        "height": 24,
        "content": "● SYS.ACTIVE // PING: 18ms",
        "color": "#38bdf8",
        "backgroundColor": "rgba(56, 189, 248, 0.12)",
        "borderRadius": 999,
        "fontSize": 10,
        "fontWeight": 700,
        "border": "1px solid rgba(56, 189, 248, 0.3)",
        "zIndex": 2
      },
      {
        "id": "avatar",
        "type": "avatar",
        "x": 65,
        "y": 72,
        "width": 130,
        "height": 130,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 24,
        "border": "2px solid #38bdf8",
        "zIndex": 2
      },
      {
        "id": "rank-pill",
        "type": "badge",
        "x": 65,
        "y": 214,
        "width": 130,
        "height": 26,
        "content": "RANK // S-TIER",
        "color": "#060911",
        "backgroundColor": "#38bdf8",
        "borderRadius": 6,
        "fontSize": 11,
        "fontWeight": 800,
        "zIndex": 2
      },
      {
        "id": "hud-tag",
        "type": "text",
        "x": 275,
        "y": 35,
        "width": 385,
        "height": 18,
        "content": "◈ NEURAL INTERFACE v4.8 ◈",
        "color": "#38bdf8",
        "fontSize": 11,
        "fontWeight": 700,
        "letterSpacing": 2,
        "zIndex": 2
      },
      {
        "id": "operator-name",
        "type": "text",
        "x": 275,
        "y": 56,
        "width": 385,
        "height": 42,
        "content": "{userName}",
        "color": "#ffffff",
        "fontSize": 34,
        "fontWeight": 800,
        "textShadow": "0 0 16px rgba(56, 189, 248, 0.6)",
        "zIndex": 2
      },
      {
        "id": "guild-status",
        "type": "text",
        "x": 275,
        "y": 104,
        "width": 385,
        "height": 22,
        "content": "AFFILIATION: {guildName} · CLASSIFIED",
        "color": "#94a3b8",
        "fontSize": 13,
        "fontWeight": 500,
        "zIndex": 2
      },
      {
        "id": "sync-label",
        "type": "text",
        "x": 275,
        "y": 168,
        "width": 200,
        "height": 18,
        "content": "SYNC RATE: 99.4%",
        "color": "#38bdf8",
        "fontSize": 12,
        "fontWeight": 700,
        "zIndex": 2
      },
      {
        "id": "sync-progress",
        "type": "progress",
        "x": 275,
        "y": 192,
        "width": 385,
        "height": 10,
        "backgroundColor": "rgba(255,255,255,0.08)",
        "progressColor": "#38bdf8",
        "progressPercent": 99,
        "borderRadius": 999,
        "zIndex": 2
      },
      {
        "id": "temp-label",
        "type": "text",
        "x": 275,
        "y": 216,
        "width": 385,
        "height": 22,
        "content": "CORE TEMP: 34°C OPTIMAL // QUANTUM LOCK STABLE",
        "color": "#64748b",
        "fontSize": 11,
        "fontWeight": 600,
        "zIndex": 2
      },
      {
        "id": "right-header",
        "type": "badge",
        "x": 710,
        "y": 35,
        "width": 185,
        "height": 24,
        "content": "TELEMETRY METRICS",
        "color": "#e2e8f0",
        "backgroundColor": "rgba(255, 255, 255, 0.06)",
        "borderRadius": 6,
        "fontSize": 10,
        "fontWeight": 700,
        "zIndex": 2
      },
      {
        "id": "metric-1-val",
        "type": "text",
        "x": 710,
        "y": 72,
        "width": 185,
        "height": 32,
        "content": "85,400",
        "color": "#38bdf8",
        "fontSize": 28,
        "fontWeight": 800,
        "zIndex": 2
      },
      {
        "id": "metric-1-lbl",
        "type": "text",
        "x": 710,
        "y": 106,
        "width": 185,
        "height": 16,
        "content": "ENERGY RESERVES (XU)",
        "color": "#64748b",
        "fontSize": 10,
        "fontWeight": 600,
        "letterSpacing": 0.5,
        "zIndex": 2
      },
      {
        "id": "metric-2-val",
        "type": "text",
        "x": 710,
        "y": 136,
        "width": 185,
        "height": 32,
        "content": "LV. 88",
        "color": "#facc15",
        "fontSize": 28,
        "fontWeight": 800,
        "zIndex": 2
      },
      {
        "id": "metric-2-lbl",
        "type": "text",
        "x": 710,
        "y": 170,
        "width": 185,
        "height": 16,
        "content": "CLEARANCE LEVEL",
        "color": "#64748b",
        "fontSize": 10,
        "fontWeight": 600,
        "letterSpacing": 0.5,
        "zIndex": 2
      },
      {
        "id": "right-bar",
        "type": "progress",
        "x": 710,
        "y": 206,
        "width": 185,
        "height": 8,
        "backgroundColor": "rgba(255,255,255,0.08)",
        "progressColor": "#facc15",
        "progressPercent": 88,
        "borderRadius": 999,
        "zIndex": 2
      }
    ]
  },
  "tracks": [
    {
      "elementId": "avatar",
      "keyframes": [
        {
          "id": "hud-av-0",
          "time": 0,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "hud-av-1",
          "time": 600,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "operator-name",
      "keyframes": [
        {
          "id": "hud-op-0",
          "time": 200,
          "x": 235,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "hud-op-1",
          "time": 700,
          "x": 275,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "sync-progress",
      "keyframes": [
        {
          "id": "hud-sp-0",
          "time": 300,
          "opacity": 0,
          "easing": "linear"
        },
        {
          "id": "hud-sp-1",
          "time": 800,
          "opacity": 1,
          "easing": "ease-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.822Z"
};

export default cyberBentoHudPattern;
