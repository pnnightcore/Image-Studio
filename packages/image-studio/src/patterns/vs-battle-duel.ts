import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: ⚔️ Arcade VS Battle Duel
 * Màn hình đối đầu võ đài game đối kháng với thanh máu song song, cúp vô địch và huy hiệu VS
 */
export const vsBattleDuelPattern: StudioPattern = {
  "id": "vs-battle-duel",
  "name": "⚔️ Arcade VS Battle Duel",
  "description": "Màn hình đối đầu võ đài game đối kháng với thanh máu song song, cúp vô địch và huy hiệu VS",
  "duration": 1600,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Arcade VS Duel",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #1e0909 0%, #0d0d0f 50%, #06152b 100%)",
    "elements": [
      {
        "id": "fire-particles",
        "type": "particle",
        "x": 0,
        "y": 0,
        "width": 930,
        "height": 280,
        "zIndex": 1,
        "particleConfig": {
          "count": 85,
          "size": 13,
          "speed": 140,
          "direction": 270,
          "spread": 55,
          "gravity": -85,
          "opacity": 0.85,
          "lifetime": 1.5,
          "color": "#f97316",
          "colorSecondary": "#facc15",
          "shape": "fire",
          "preset": "fire",
          "glow": true
        }
      },
      {
        "id": "round-banner",
        "type": "badge",
        "x": 380,
        "y": 15,
        "width": 170,
        "height": 26,
        "content": "ROUND 1 · FIGHT!",
        "color": "#ffffff",
        "backgroundColor": "#dc2626",
        "borderRadius": 4,
        "fontSize": 11,
        "fontWeight": 900,
        "textShadow": "0 0 8px #ffffff",
        "zIndex": 4
      },
      {
        "id": "timer-box",
        "type": "badge",
        "x": 435,
        "y": 46,
        "width": 60,
        "height": 32,
        "content": "99",
        "color": "#fef08a",
        "backgroundColor": "#1e1b4b",
        "borderRadius": 6,
        "fontSize": 20,
        "fontWeight": 900,
        "border": "2px solid #fbbf24",
        "zIndex": 4
      },
      {
        "id": "p1-avatar",
        "type": "avatar",
        "x": 30,
        "y": 45,
        "width": 120,
        "height": 120,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 16,
        "border": "3px solid #ef4444",
        "zIndex": 3
      },
      {
        "id": "p1-tag",
        "type": "badge",
        "x": 30,
        "y": 174,
        "width": 120,
        "height": 24,
        "content": "PLAYER 1",
        "color": "#ffffff",
        "backgroundColor": "#ef4444",
        "borderRadius": 4,
        "fontSize": 10,
        "fontWeight": 900,
        "zIndex": 3
      },
      {
        "id": "p1-name",
        "type": "text",
        "x": 165,
        "y": 48,
        "width": 250,
        "height": 36,
        "content": "{userName}",
        "color": "#f87171",
        "fontSize": 28,
        "fontWeight": 900,
        "zIndex": 3
      },
      {
        "id": "p1-title",
        "type": "text",
        "x": 165,
        "y": 86,
        "width": 250,
        "height": 22,
        "content": "CHALLENGER // LV. 99",
        "color": "#fca5a5",
        "fontSize": 12,
        "fontWeight": 700,
        "zIndex": 3
      },
      {
        "id": "p1-hp-label",
        "type": "text",
        "x": 165,
        "y": 112,
        "width": 250,
        "height": 16,
        "content": "HP: 100% [MAX]",
        "color": "#ef4444",
        "fontSize": 10,
        "fontWeight": 800,
        "zIndex": 3
      },
      {
        "id": "p1-hp-bar",
        "type": "progress",
        "x": 165,
        "y": 130,
        "width": 240,
        "height": 14,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#ef4444",
        "progressPercent": 100,
        "borderRadius": 2,
        "zIndex": 3
      },
      {
        "id": "p1-super-bar",
        "type": "progress",
        "x": 165,
        "y": 152,
        "width": 240,
        "height": 8,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#facc15",
        "progressPercent": 100,
        "borderRadius": 2,
        "zIndex": 3
      },
      {
        "id": "vs-circle",
        "type": "box",
        "x": 420,
        "y": 95,
        "width": 90,
        "height": 90,
        "backgroundColor": "#000000",
        "border": "4px solid #f59e0b",
        "borderRadius": 999,
        "zIndex": 4
      },
      {
        "id": "vs-text",
        "type": "text",
        "x": 420,
        "y": 112,
        "width": 90,
        "height": 55,
        "content": "VS",
        "color": "#facc15",
        "fontSize": 44,
        "fontWeight": 900,
        "textAlign": "center",
        "textShadow": "0 0 20px #ef4444, 0 0 35px #facc15",
        "zIndex": 5
      },
      {
        "id": "p2-avatar",
        "type": "avatar",
        "x": 780,
        "y": 45,
        "width": 120,
        "height": 120,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 16,
        "border": "3px solid #3b82f6",
        "zIndex": 3
      },
      {
        "id": "p2-tag",
        "type": "badge",
        "x": 780,
        "y": 174,
        "width": 120,
        "height": 24,
        "content": "OPPONENT",
        "color": "#ffffff",
        "backgroundColor": "#3b82f6",
        "borderRadius": 4,
        "fontSize": 10,
        "fontWeight": 900,
        "zIndex": 3
      },
      {
        "id": "p2-name",
        "type": "text",
        "x": 525,
        "y": 48,
        "width": 240,
        "height": 36,
        "content": "{guildName}",
        "color": "#60a5fa",
        "fontSize": 26,
        "fontWeight": 900,
        "textAlign": "right",
        "zIndex": 3
      },
      {
        "id": "p2-title",
        "type": "text",
        "x": 525,
        "y": 86,
        "width": 240,
        "height": 22,
        "content": "DEFENDING GUILD // TIER SSS",
        "color": "#93c5fd",
        "fontSize": 12,
        "fontWeight": 700,
        "textAlign": "right",
        "zIndex": 3
      },
      {
        "id": "p2-hp-label",
        "type": "text",
        "x": 525,
        "y": 112,
        "width": 240,
        "height": 16,
        "content": "HP: 100% [MAX]",
        "color": "#3b82f6",
        "fontSize": 10,
        "fontWeight": 800,
        "textAlign": "right",
        "zIndex": 3
      },
      {
        "id": "p2-hp-bar",
        "type": "progress",
        "x": 525,
        "y": 130,
        "width": 240,
        "height": 14,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#3b82f6",
        "progressPercent": 100,
        "borderRadius": 2,
        "zIndex": 3
      },
      {
        "id": "p2-super-bar",
        "type": "progress",
        "x": 525,
        "y": 152,
        "width": 240,
        "height": 8,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#06b6d4",
        "progressPercent": 90,
        "borderRadius": 2,
        "zIndex": 3
      },
      {
        "id": "arena-status",
        "type": "badge",
        "x": 165,
        "y": 215,
        "width": 600,
        "height": 34,
        "content": "COMBO x32 · CRITICAL HIT · ARENA: THE HYPER SPHERE",
        "color": "#fef08a",
        "backgroundColor": "rgba(0,0,0,0.6)",
        "borderRadius": 6,
        "fontSize": 11,
        "fontWeight": 800,
        "border": "1px solid rgba(251, 191, 36, 0.4)",
        "zIndex": 3
      }
    ]
  },
  "tracks": [
    {
      "elementId": "p1-avatar",
      "keyframes": [
        {
          "id": "p1-av-0",
          "time": 0,
          "x": -60,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "p1-av-1",
          "time": 500,
          "x": 30,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "p2-avatar",
      "keyframes": [
        {
          "id": "p2-av-0",
          "time": 0,
          "x": 870,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "p2-av-1",
          "time": 500,
          "x": 780,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "vs-circle",
      "keyframes": [
        {
          "id": "vsc-0",
          "time": 200,
          "scaleX": 0.1,
          "scaleY": 0.1,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "vsc-1",
          "time": 700,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.834Z"
};

export default vsBattleDuelPattern;
