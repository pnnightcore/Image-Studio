import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: Welcome Card Animation
 * Pattern created in Image Studio (930x280)
 */
export const welcomeCardAnimationPattern: StudioPattern = {
  "id": "welcome-card-animation",
  "name": "Welcome Card Animation",
  "description": "Pattern created in Image Studio (930x280)",
  "duration": 1500,
  "fps": 12,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Welcome Card Animation",
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
          "time": 0,
          "easing": "bounce",
          "x": 20,
          "y": 40,
          "width": 110,
          "height": 110,
          "rotation": -12,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "opacity": 0,
          "transform": {
            "x": 20,
            "y": 40,
            "width": 110,
            "height": 110,
            "rotation": -12,
            "scaleX": 0.8,
            "scaleY": 0.8
          }
        },
        {
          "time": 450,
          "easing": "ease-out",
          "x": 36,
          "y": 40,
          "width": 140,
          "height": 140,
          "rotation": 6,
          "scaleX": 1.05,
          "scaleY": 1.05,
          "opacity": 1,
          "transform": {
            "x": 36,
            "y": 40,
            "width": 140,
            "height": 140,
            "rotation": 6,
            "scaleX": 1.05,
            "scaleY": 1.05
          }
        },
        {
          "time": 800,
          "x": 36,
          "y": 40,
          "width": 140,
          "height": 140,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "transform": {
            "x": 36,
            "y": 40,
            "width": 140,
            "height": 140,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1
          }
        }
      ]
    },
    {
      "elementId": "title",
      "keyframes": [
        {
          "time": 200,
          "easing": "ease-out",
          "x": 160,
          "y": 55,
          "width": 650,
          "height": 52,
          "rotation": -2,
          "scaleX": 0.95,
          "opacity": 0,
          "transform": {
            "x": 160,
            "y": 55,
            "width": 650,
            "height": 52,
            "rotation": -2,
            "scaleX": 0.95
          }
        },
        {
          "time": 650,
          "x": 205,
          "y": 55,
          "width": 650,
          "height": 52,
          "rotation": 0,
          "scaleX": 1,
          "opacity": 1,
          "transform": {
            "x": 205,
            "y": 55,
            "width": 650,
            "height": 52,
            "rotation": 0,
            "scaleX": 1
          }
        }
      ]
    },
    {
      "elementId": "subtitle",
      "keyframes": [
        {
          "time": 400,
          "easing": "ease-out",
          "x": 170,
          "y": 115,
          "width": 650,
          "height": 38,
          "opacity": 0,
          "transform": {
            "x": 170,
            "y": 115,
            "width": 650,
            "height": 38
          }
        },
        {
          "time": 850,
          "x": 205,
          "y": 115,
          "width": 650,
          "height": 38,
          "opacity": 1,
          "transform": {
            "x": 205,
            "y": 115,
            "width": 650,
            "height": 38
          }
        }
      ]
    },
    {
      "elementId": "badge",
      "keyframes": [
        {
          "time": 600,
          "easing": "bounce",
          "x": 205,
          "y": 195,
          "width": 130,
          "height": 32,
          "rotation": -6,
          "scaleX": 0.85,
          "opacity": 0,
          "transform": {
            "x": 205,
            "y": 195,
            "width": 130,
            "height": 32,
            "rotation": -6,
            "scaleX": 0.85
          }
        },
        {
          "time": 1050,
          "x": 205,
          "y": 175,
          "width": 130,
          "height": 32,
          "rotation": 0,
          "scaleX": 1,
          "opacity": 1,
          "transform": {
            "x": 205,
            "y": 175,
            "width": 130,
            "height": 32,
            "rotation": 0,
            "scaleX": 1
          }
        }
      ]
    }
  ],
  "category": "custom",
  "createdAt": "2026-11-01T11:17:36.563Z"
};

export default welcomeCardAnimationPattern;
