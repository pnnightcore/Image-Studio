import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: ✨ Spark Magic Banner
 * Hạt lấp lánh vàng kim với hiệu ứng tia lửa rực sáng
 */
export const sparkMagicPattern: StudioPattern = {
  "id": "spark-magic",
  "name": "✨ Spark Magic Banner",
  "description": "Hạt lấp lánh vàng kim với hiệu ứng tia lửa rực sáng",
  "duration": 1800,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Spark Magic Card",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #0f0728 0%, #1e1145 50%, #2b0b3a 100%)",
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
        "id": "avatar",
        "type": "avatar",
        "x": 40,
        "y": 45,
        "width": 130,
        "height": 130,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 999,
        "border": "4px solid #fbbf24",
        "zIndex": 2
      },
      {
        "id": "spark-title",
        "type": "text",
        "x": 195,
        "y": 65,
        "width": 680,
        "height": 52,
        "content": "✨ SPARK OF GLORY: {userName}",
        "color": "#fbbf24",
        "fontSize": 38,
        "fontWeight": 800,
        "textShadow": "0 0 20px rgba(251, 191, 36, 0.9), 2px 3px 6px rgba(0, 0, 0, 0.9)",
        "zIndex": 3
      },
      {
        "id": "spark-sub",
        "type": "text",
        "x": 195,
        "y": 125,
        "width": 680,
        "height": 32,
        "content": "Empowered by Celestial Starlight · {guildName}",
        "color": "#fde68a",
        "fontSize": 22,
        "fontWeight": 500,
        "zIndex": 3
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
          "scaleX": 0.8,
          "scaleY": 0.8,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "av-1",
          "time": 500,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "spark-title",
      "keyframes": [
        {
          "id": "st-0",
          "time": 100,
          "y": 80,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "st-1",
          "time": 600,
          "y": 65,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.816Z"
};

export default sparkMagicPattern;
