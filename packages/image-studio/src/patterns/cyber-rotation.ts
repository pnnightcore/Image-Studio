import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: Cyber Dynamic Entrance
 * Multi-axis rotation (-15° -> 10° -> 0°), scaling and cyber glow
 */
export const cyberRotationPattern: StudioPattern = {
  "id": "cyber-rotation",
  "name": "Cyber Dynamic Entrance",
  "description": "Multi-axis rotation (-15° -> 10° -> 0°), scaling and cyber glow",
  "duration": 1500,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Holo Cyber Card",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #050b14 0%, #0d1b2a 45%, #1b263b 100%)",
    "elements": [
      {
        "id": "cyber-avatar",
        "type": "avatar",
        "x": 40,
        "y": 40,
        "width": 140,
        "height": 140,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 28,
        "border": "3px solid #38bdf8",
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1
      },
      {
        "id": "cyber-title",
        "type": "text",
        "x": 215,
        "y": 50,
        "width": 620,
        "height": 50,
        "content": "OPERATOR: {userName}",
        "color": "#38bdf8",
        "fontSize": 42,
        "fontWeight": 700,
        "letterSpacing": 1,
        "textShadow": "0 0 16px #0284c7, 0 0 24px #38bdf8"
      },
      {
        "id": "cyber-sub",
        "type": "text",
        "x": 215,
        "y": 112,
        "width": 620,
        "height": 34,
        "content": "CYBER CORE ACTIVE · {guildName}",
        "color": "#94a3b8",
        "fontSize": 22,
        "fontWeight": 500,
        "letterSpacing": 0.5
      },
      {
        "id": "cyber-tag",
        "type": "badge",
        "x": 215,
        "y": 170,
        "width": 160,
        "height": 34,
        "content": "⚡ ROTATION SYSTEM",
        "color": "#0f172a",
        "backgroundColor": "#38bdf8",
        "borderRadius": 6,
        "fontSize": 12,
        "fontWeight": 700
      }
    ]
  },
  "tracks": [
    {
      "elementId": "cyber-avatar",
      "keyframes": [
        {
          "id": "ca-0",
          "time": 0,
          "x": 40,
          "y": 40,
          "width": 140,
          "height": 140,
          "rotation": -18,
          "scaleX": 0.6,
          "scaleY": 0.6,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "ca-1",
          "time": 600,
          "x": 40,
          "y": 40,
          "width": 140,
          "height": 140,
          "rotation": 10,
          "scaleX": 1.1,
          "scaleY": 1.1,
          "opacity": 1,
          "easing": "ease-out"
        },
        {
          "id": "ca-2",
          "time": 1100,
          "x": 40,
          "y": 40,
          "width": 140,
          "height": 140,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "cyber-title",
      "keyframes": [
        {
          "id": "ct-0",
          "time": 200,
          "x": 170,
          "y": 50,
          "rotation": -3,
          "scaleX": 0.9,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "ct-1",
          "time": 700,
          "x": 215,
          "y": 50,
          "rotation": 0,
          "scaleX": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "cyber-tag",
      "keyframes": [
        {
          "id": "cg-0",
          "time": 500,
          "x": 215,
          "y": 190,
          "rotation": -10,
          "scaleX": 0.8,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "cg-1",
          "time": 900,
          "x": 215,
          "y": 170,
          "rotation": 4,
          "scaleX": 1.05,
          "opacity": 1,
          "easing": "ease-out"
        },
        {
          "id": "cg-2",
          "time": 1300,
          "x": 215,
          "y": 170,
          "rotation": 0,
          "scaleX": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.810Z"
};

export default cyberRotationPattern;
