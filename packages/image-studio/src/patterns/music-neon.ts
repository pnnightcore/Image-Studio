import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: 🎵 Music Neon Wave
 * Nốt nhạc bay bổng rực rỡ màu sắc âm nhạc sống động
 */
export const musicNeonPattern: StudioPattern = {
  "id": "music-neon",
  "name": "🎵 Music Neon Wave",
  "description": "Nốt nhạc bay bổng rực rỡ màu sắc âm nhạc sống động",
  "duration": 2000,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Neon Soundwave Banner",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #050616 0%, #0d0c2e 50%, #170733 100%)",
    "elements": [
      {
        "id": "music-particles",
        "type": "particle",
        "x": 0,
        "y": 0,
        "width": 930,
        "height": 280,
        "zIndex": 1,
        "particleConfig": {
          "count": 32,
          "size": 18,
          "speed": 65,
          "direction": 280,
          "spread": 80,
          "gravity": -25,
          "opacity": 0.9,
          "lifetime": 2.8,
          "color": "#a855f7",
          "colorSecondary": "#06b6d4",
          "shape": "music",
          "preset": "music",
          "glow": true
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
        "border": "4px solid #a855f7",
        "zIndex": 2
      },
      {
        "id": "music-title",
        "type": "text",
        "x": 195,
        "y": 65,
        "width": 680,
        "height": 52,
        "content": "🎵 NOW PLAYING: {userName}",
        "color": "#c084fc",
        "fontSize": 38,
        "fontWeight": 800,
        "textShadow": "0 0 18px rgba(168, 85, 247, 0.9), 2px 3px 6px rgba(0, 0, 0, 0.9)",
        "zIndex": 3
      },
      {
        "id": "music-sub",
        "type": "text",
        "x": 195,
        "y": 125,
        "width": 680,
        "height": 32,
        "content": "Volume 100% · Bass Boosted · {guildName}",
        "color": "#38bdf8",
        "fontSize": 22,
        "fontWeight": 500,
        "zIndex": 3
      }
    ]
  },
  "tracks": [
    {
      "elementId": "music-title",
      "keyframes": [
        {
          "id": "mt-0",
          "time": 0,
          "x": 160,
          "opacity": 0,
          "easing": "elastic"
        },
        {
          "id": "mt-1",
          "time": 700,
          "x": 195,
          "opacity": 1,
          "easing": "ease-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.820Z"
};

export default musicNeonPattern;
