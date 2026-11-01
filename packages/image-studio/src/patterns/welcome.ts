import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: Welcome Card
 * Avatar pop-in với biến {userName} và {guildName}
 */
export const welcomePattern: StudioPattern = {
  "id": "welcome",
  "name": "Welcome Card",
  "description": "Avatar pop-in với biến {userName} và {guildName}",
  "duration": 1500,
  "fps": 12,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Welcome Card",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #090614 0%, #1e1035 50%, #4a1d6e 100%)",
    "elements": [
      {
        "id": "avatar",
        "type": "avatar",
        "x": 36,
        "y": 40,
        "width": 140,
        "height": 140,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 999,
        "border": "4px solid rgba(168, 85, 247, 0.6)"
      },
      {
        "id": "title",
        "type": "text",
        "x": 205,
        "y": 55,
        "width": 650,
        "height": 52,
        "content": "Welcome, {userName}!",
        "color": "#ffffff",
        "fontSize": 44,
        "fontWeight": 700,
        "textShadow": "0 0 16px rgba(192, 132, 252, 0.75), 2px 3px 6px rgba(0, 0, 0, 0.9)",
        "shadowEnabled": true,
        "shadowOffsetX": 2,
        "shadowOffsetY": 3,
        "shadowBlur": 6,
        "shadowColor": "rgba(0, 0, 0, 0.9)",
        "glowEnabled": true,
        "glowBlur": 16,
        "glowColor": "#c084fc",
        "glowIntensity": "medium"
      },
      {
        "id": "subtitle",
        "type": "text",
        "x": 205,
        "y": 115,
        "width": 650,
        "height": 38,
        "content": "Joined {guildName} · Ready for battle",
        "color": "#c084fc",
        "fontSize": 24,
        "fontWeight": 500,
        "textShadow": "1px 2px 4px rgba(0, 0, 0, 0.8)",
        "shadowEnabled": true,
        "shadowOffsetX": 1,
        "shadowOffsetY": 2,
        "shadowBlur": 4,
        "shadowColor": "rgba(0, 0, 0, 0.8)"
      },
      {
        "id": "badge",
        "type": "badge",
        "x": 205,
        "y": 175,
        "width": 130,
        "height": 32,
        "content": "✦ NEW MEMBER",
        "color": "#ffffff",
        "backgroundColor": "#7e22ce",
        "borderRadius": 8,
        "fontSize": 13,
        "textShadow": "0 0 8px rgba(255, 255, 255, 0.5)"
      }
    ]
  },
  "tracks": [
    {
      "elementId": "avatar",
      "keyframes": [
        {
          "id": "av-0",
          "time": 0,
          "x": 20,
          "y": 40,
          "width": 110,
          "height": 110,
          "rotation": -12,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "av-1",
          "time": 450,
          "x": 36,
          "y": 40,
          "width": 140,
          "height": 140,
          "rotation": 6,
          "scaleX": 1.05,
          "scaleY": 1.05,
          "opacity": 1,
          "easing": "ease-out"
        },
        {
          "id": "av-2",
          "time": 800,
          "x": 36,
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
      "elementId": "title",
      "keyframes": [
        {
          "id": "ti-0",
          "time": 200,
          "x": 160,
          "y": 55,
          "width": 650,
          "height": 52,
          "rotation": -2,
          "scaleX": 0.95,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "ti-1",
          "time": 650,
          "x": 205,
          "y": 55,
          "width": 650,
          "height": 52,
          "rotation": 0,
          "scaleX": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "subtitle",
      "keyframes": [
        {
          "id": "sub-0",
          "time": 400,
          "x": 170,
          "y": 115,
          "width": 650,
          "height": 38,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "sub-1",
          "time": 850,
          "x": 205,
          "y": 115,
          "width": 650,
          "height": 38,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "badge",
      "keyframes": [
        {
          "id": "bd-0",
          "time": 600,
          "x": 205,
          "y": 195,
          "width": 130,
          "height": 32,
          "rotation": -6,
          "scaleX": 0.85,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "bd-1",
          "time": 1050,
          "x": 205,
          "y": 175,
          "width": 130,
          "height": 32,
          "rotation": 0,
          "scaleX": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.798Z"
};

export default welcomePattern;
