import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: ✦ RPG Gacha SSR Summon
 * Mở hòm thẻ tướng thần thoại SSR với hào quang vàng kim 5 sao, viền vàng rực lửa và hiệu ứng vỡ òa
 */
export const gachaLootboxPattern: StudioPattern = {
  "id": "gacha-lootbox",
  "name": "✦ RPG Gacha SSR Summon",
  "description": "Mở hòm thẻ tướng thần thoại SSR với hào quang vàng kim 5 sao, viền vàng rực lửa và hiệu ứng vỡ òa",
  "duration": 1800,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "SSR Gacha Summon",
    "width": 930,
    "height": 280,
    "background": "radial-gradient(ellipse at 50% 50%, #451a03 0%, #1c0e05 60%, #080402 100%)",
    "elements": [
      {
        "id": "spark-particles",
        "type": "particle",
        "x": 0,
        "y": 0,
        "width": 930,
        "height": 280,
        "zIndex": 1,
        "particleConfig": {
          "count": 60,
          "size": 8,
          "speed": 160,
          "direction": 270,
          "spread": 360,
          "gravity": 35,
          "opacity": 0.95,
          "lifetime": 1.8,
          "color": "#fbbf24",
          "colorSecondary": "#ffffff",
          "shape": "spark",
          "preset": "spark",
          "glow": true
        }
      },
      {
        "id": "summon-glow",
        "type": "box",
        "borderRadius": 999,
        "x": 345,
        "y": 20,
        "width": 240,
        "height": 240,
        "backgroundColor": "rgba(245, 158, 11, 0.12)",
        "border": "2px solid rgba(251, 191, 36, 0.35)",
        "zIndex": 2
      },
      {
        "id": "ssr-badge",
        "type": "badge",
        "x": 385,
        "y": 20,
        "width": 160,
        "height": 28,
        "content": "★ SSR ULTRA RARE ★",
        "color": "#000000",
        "backgroundColor": "#fbbf24",
        "borderRadius": 999,
        "fontSize": 11,
        "fontWeight": 900,
        "textShadow": "0 0 10px #fef08a",
        "zIndex": 5
      },
      {
        "id": "avatar",
        "type": "avatar",
        "x": 405,
        "y": 62,
        "width": 120,
        "height": 120,
        "borderRadius": 24,
        "border": "3px solid #fbbf24",
        "imageUrl": "{{userAVTurl}}",
        "zIndex": 4
      },
      {
        "id": "stars-row",
        "type": "text",
        "x": 365,
        "y": 190,
        "width": 200,
        "height": 28,
        "content": "★ ★ ★ ★ ★",
        "color": "#fbbf24",
        "fontSize": 20,
        "fontWeight": 900,
        "textAlign": "center",
        "textShadow": "0 0 12px rgba(251, 191, 36, 0.9)",
        "zIndex": 5
      },
      {
        "id": "hero-name",
        "type": "text",
        "x": 265,
        "y": 220,
        "width": 400,
        "height": 32,
        "content": "{{userName}}",
        "color": "#ffffff",
        "fontSize": 24,
        "fontWeight": 800,
        "textAlign": "center",
        "textShadow": "0 2px 10px rgba(0, 0, 0, 0.9)",
        "zIndex": 5
      },
      {
        "id": "stats-badge-left",
        "type": "badge",
        "x": 60,
        "y": 115,
        "width": 200,
        "height": 50,
        "content": "ATK 9,850 // CRIT 98%",
        "color": "#fef08a",
        "backgroundColor": "rgba(245, 158, 11, 0.15)",
        "border": "1px solid rgba(251, 191, 36, 0.4)",
        "borderRadius": 12,
        "fontSize": 12,
        "fontWeight": 800,
        "zIndex": 3
      },
      {
        "id": "stats-badge-right",
        "type": "badge",
        "x": 670,
        "y": 115,
        "width": 200,
        "height": 50,
        "content": "POWER LVL 99 // DIVINE",
        "color": "#38bdf8",
        "backgroundColor": "rgba(56, 189, 248, 0.15)",
        "border": "1px solid rgba(56, 189, 248, 0.4)",
        "borderRadius": 12,
        "fontSize": 12,
        "fontWeight": 800,
        "zIndex": 3
      }
    ]
  },
  "tracks": [
    {
      "elementId": "avatar",
      "keyframes": [
        {
          "id": "gc-av-0",
          "time": 0,
          "scaleX": 0.1,
          "scaleY": 0.1,
          "opacity": 0,
          "rotation": -20,
          "easing": "bounce"
        },
        {
          "id": "gc-av-1",
          "time": 600,
          "scaleX": 1.15,
          "scaleY": 1.15,
          "opacity": 1,
          "rotation": 5,
          "easing": "ease-out"
        },
        {
          "id": "gc-av-2",
          "time": 1000,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "rotation": 0,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "ssr-badge",
      "keyframes": [
        {
          "id": "gc-bd-0",
          "time": 200,
          "y": -30,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "gc-bd-1",
          "time": 700,
          "y": 20,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "stars-row",
      "keyframes": [
        {
          "id": "gc-st-0",
          "time": 500,
          "scaleX": 0.5,
          "scaleY": 0.5,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "gc-st-1",
          "time": 950,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "hero-name",
      "keyframes": [
        {
          "id": "gc-nm-0",
          "time": 600,
          "y": 240,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "gc-nm-1",
          "time": 1100,
          "y": 220,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "stats-badge-left",
      "keyframes": [
        {
          "id": "gc-sbl-0",
          "time": 700,
          "x": -20,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "gc-sbl-1",
          "time": 1200,
          "x": 60,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "stats-badge-right",
      "keyframes": [
        {
          "id": "gc-sbr-0",
          "time": 700,
          "x": 750,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "gc-sbr-1",
          "time": 1200,
          "x": 670,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "summon-glow",
      "keyframes": [
        {
          "id": "gc-sg-0",
          "time": 0,
          "rotation": 0,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "easing": "linear"
        },
        {
          "id": "gc-sg-1",
          "time": 900,
          "rotation": 180,
          "scaleX": 1.05,
          "scaleY": 1.05,
          "easing": "linear"
        },
        {
          "id": "gc-sg-2",
          "time": 1800,
          "rotation": 360,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "easing": "linear"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.836Z"
};

export default gachaLootboxPattern;
