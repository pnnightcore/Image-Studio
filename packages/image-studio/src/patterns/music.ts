import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: Now Playing Wave
 * Album art pulse and equalizer animation
 */
export const musicPattern: StudioPattern = {
  "id": "music",
  "name": "Now Playing Wave",
  "description": "Album art pulse and equalizer animation",
  "duration": 1600,
  "fps": 12,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Now Playing Card",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #0b0f19 0%, #111827 50%, #064e3b 100%)",
    "elements": [
      {
        "id": "album",
        "type": "image",
        "x": 40,
        "y": 40,
        "width": 140,
        "height": 140,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 20,
        "border": "2px solid rgba(52, 211, 153, 0.4)"
      },
      {
        "id": "track-title",
        "type": "text",
        "x": 215,
        "y": 50,
        "width": 600,
        "height": 48,
        "content": "Midnight City Lights",
        "color": "#ffffff",
        "fontSize": 40,
        "fontWeight": 700,
        "textShadow": "0 0 16px rgba(52, 211, 153, 0.7), 2px 3px 6px rgba(0, 0, 0, 0.85)",
        "shadowEnabled": true,
        "shadowOffsetX": 2,
        "shadowOffsetY": 3,
        "shadowBlur": 6,
        "shadowColor": "rgba(0, 0, 0, 0.85)",
        "glowEnabled": true,
        "glowBlur": 16,
        "glowColor": "#34d399",
        "glowIntensity": "medium"
      },
      {
        "id": "artist",
        "type": "text",
        "x": 215,
        "y": 108,
        "width": 600,
        "height": 32,
        "content": "DJ {userName} · {guildName}",
        "color": "#6ee7b7",
        "fontSize": 22,
        "fontWeight": 500,
        "textShadow": "1px 2px 4px rgba(0, 0, 0, 0.7)",
        "shadowEnabled": true,
        "shadowOffsetX": 1,
        "shadowOffsetY": 2,
        "shadowBlur": 4,
        "shadowColor": "rgba(0, 0, 0, 0.7)"
      },
      {
        "id": "progress",
        "type": "progress",
        "x": 215,
        "y": 165,
        "width": 580,
        "height": 14,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#10b981",
        "progressPercent": 35,
        "borderRadius": 999
      }
    ]
  },
  "tracks": [
    {
      "elementId": "album",
      "keyframes": [
        {
          "id": "alb-0",
          "time": 0,
          "x": 40,
          "y": 40,
          "width": 140,
          "height": 140,
          "opacity": 1,
          "easing": "ease-in-out"
        },
        {
          "id": "alb-1",
          "time": 800,
          "x": 38,
          "y": 38,
          "width": 144,
          "height": 144,
          "opacity": 1,
          "easing": "ease-in-out"
        },
        {
          "id": "alb-2",
          "time": 1600,
          "x": 40,
          "y": 40,
          "width": 140,
          "height": 140,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "progress",
      "keyframes": [
        {
          "id": "prg-0",
          "time": 0,
          "width": 580,
          "height": 14,
          "opacity": 1,
          "easing": "linear"
        },
        {
          "id": "prg-1",
          "time": 1600,
          "width": 580,
          "height": 14,
          "opacity": 1,
          "easing": "linear"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T11:46:55.470Z"
};

export default musicPattern;
