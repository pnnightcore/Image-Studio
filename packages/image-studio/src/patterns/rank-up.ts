import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: Rank Up / XP
 * Level progression and glowing badge pop
 */
export const rankUpPattern: StudioPattern = {
  "id": "rank-up",
  "name": "Rank Up / XP",
  "description": "Level progression and glowing badge pop",
  "duration": 1400,
  "fps": 12,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Level Up Banner",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #180d04 0%, #381907 50%, #7c2d12 100%)",
    "elements": [
      {
        "id": "rank-badge",
        "type": "badge",
        "x": 45,
        "y": 45,
        "width": 130,
        "height": 130,
        "content": "LV. 50",
        "color": "#fef08a",
        "backgroundColor": "#b45309",
        "borderRadius": 30,
        "fontSize": 32,
        "border": "3px solid #f59e0b",
        "textShadow": "0 0 10px rgba(254, 240, 138, 0.7)"
      },
      {
        "id": "rank-title",
        "type": "text",
        "x": 210,
        "y": 50,
        "width": 600,
        "height": 48,
        "content": "LEVEL UP: {userName}!",
        "color": "#fbbf24",
        "fontSize": 38,
        "fontWeight": 800,
        "textShadow": "0 0 18px rgba(251, 191, 36, 0.8), 2px 3px 6px rgba(0, 0, 0, 0.95)",
        "shadowEnabled": true,
        "shadowOffsetX": 2,
        "shadowOffsetY": 3,
        "shadowBlur": 6,
        "shadowColor": "rgba(0, 0, 0, 0.95)",
        "glowEnabled": true,
        "glowBlur": 18,
        "glowColor": "#facc15",
        "glowIntensity": "medium"
      },
      {
        "id": "rank-sub",
        "type": "text",
        "x": 210,
        "y": 110,
        "width": 600,
        "height": 32,
        "content": "XP: 14,850 / 15,000 · {guildName}",
        "color": "#fed7aa",
        "fontSize": 22,
        "fontWeight": 500,
        "textShadow": "1px 2px 4px rgba(0, 0, 0, 0.8)",
        "shadowEnabled": true,
        "shadowOffsetX": 1,
        "shadowOffsetY": 2,
        "shadowBlur": 4,
        "shadowColor": "rgba(0, 0, 0, 0.8)"
      },
      {
        "id": "xp-bar",
        "type": "progress",
        "x": 210,
        "y": 165,
        "width": 620,
        "height": 18,
        "backgroundColor": "rgba(0,0,0,0.4)",
        "progressColor": "#f59e0b",
        "progressPercent": 20,
        "borderRadius": 999
      }
    ]
  },
  "tracks": [
    {
      "elementId": "rank-badge",
      "keyframes": [
        {
          "id": "rb-0",
          "time": 0,
          "x": 45,
          "y": 45,
          "width": 90,
          "height": 90,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "rb-1",
          "time": 600,
          "x": 45,
          "y": 45,
          "width": 130,
          "height": 130,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "rank-title",
      "keyframes": [
        {
          "id": "rt-0",
          "time": 200,
          "x": 180,
          "y": 50,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "rt-1",
          "time": 700,
          "x": 210,
          "y": 50,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T11:46:55.472Z"
};

export default rankUpPattern;
