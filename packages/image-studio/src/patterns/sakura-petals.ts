import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: 🌸 Sakura Petals Anime
 * Cánh hoa anh đào lãng mạn bay nhẹ nhàng trong gió
 */
export const sakuraPetalsPattern: StudioPattern = {
  "id": "sakura-petals",
  "name": "🌸 Sakura Petals Anime",
  "description": "Cánh hoa anh đào lãng mạn bay nhẹ nhàng trong gió",
  "duration": 2400,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Sakura Blossom Banner",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #18091e 0%, #2e082d 50%, #4c1135 100%)",
    "elements": [
      {
        "id": "sakura-particles",
        "type": "particle",
        "x": 0,
        "y": 0,
        "width": 930,
        "height": 280,
        "zIndex": 1,
        "particleConfig": {
          "count": 36,
          "size": 15,
          "speed": 50,
          "direction": 110,
          "spread": 45,
          "gravity": 30,
          "opacity": 0.85,
          "lifetime": 3.8,
          "color": "#f472b6",
          "colorSecondary": "#fda4af",
          "shape": "petal",
          "preset": "petals",
          "glow": false
        }
      },
      {
        "id": "avatar",
        "type": "avatar",
        "x": 40,
        "y": 45,
        "width": 130,
        "height": 130,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 999,
        "border": "4px solid #f472b6",
        "zIndex": 2
      },
      {
        "id": "sakura-title",
        "type": "text",
        "x": 195,
        "y": 65,
        "width": 680,
        "height": 52,
        "content": "🌸 Sakura Melody · {userName}",
        "color": "#fbcfe8",
        "fontSize": 38,
        "fontWeight": 700,
        "textShadow": "0 0 16px rgba(244, 114, 182, 0.85), 2px 2px 4px rgba(0, 0, 0, 0.9)",
        "zIndex": 3
      },
      {
        "id": "sakura-sub",
        "type": "text",
        "x": 195,
        "y": 125,
        "width": 680,
        "height": 32,
        "content": "Spring Bloom Edition · {guildName}",
        "color": "#f472b6",
        "fontSize": 22,
        "fontWeight": 500,
        "zIndex": 3
      }
    ]
  },
  "tracks": [
    {
      "elementId": "sakura-title",
      "keyframes": [
        {
          "id": "skt-0",
          "time": 0,
          "opacity": 0,
          "easing": "ease-in"
        },
        {
          "id": "skt-1",
          "time": 700,
          "opacity": 1,
          "easing": "ease-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.818Z"
};

export default sakuraPetalsPattern;
