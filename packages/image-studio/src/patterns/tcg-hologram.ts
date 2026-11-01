import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: 🎴 Holographic TCG Mythic
 * Thẻ bài ma thuật / Anime TCG Secret Rare với viền hoa văn vàng kim, Mana Sphere và ATK / DEF
 */
export const tcgHologramPattern: StudioPattern = {
  "id": "tcg-hologram",
  "name": "🎴 Holographic TCG Mythic",
  "description": "Thẻ bài ma thuật / Anime TCG Secret Rare với viền hoa văn vàng kim, Mana Sphere và ATK / DEF",
  "duration": 2000,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Holographic TCG Card",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(135deg, #130a22 0%, #250f3e 50%, #3e1463 100%)",
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
        "id": "tcg-card-border",
        "type": "box",
        "x": 15,
        "y": 15,
        "width": 900,
        "height": 250,
        "backgroundColor": "#110b1a",
        "border": "4px solid #fbbf24",
        "borderRadius": 16,
        "zIndex": 2
      },
      {
        "id": "tcg-inner-frame",
        "type": "box",
        "x": 25,
        "y": 25,
        "width": 880,
        "height": 230,
        "backgroundColor": "transparent",
        "border": "1px solid rgba(251, 191, 36, 0.4)",
        "borderRadius": 10,
        "zIndex": 3
      },
      {
        "id": "art-frame",
        "type": "box",
        "x": 42,
        "y": 38,
        "width": 190,
        "height": 204,
        "backgroundColor": "rgba(0,0,0,0.5)",
        "border": "2px solid #fbbf24",
        "borderRadius": 8,
        "zIndex": 4
      },
      {
        "id": "avatar",
        "type": "avatar",
        "x": 48,
        "y": 44,
        "width": 178,
        "height": 192,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 6,
        "zIndex": 5
      },
      {
        "id": "rarity-badge",
        "type": "badge",
        "x": 48,
        "y": 206,
        "width": 178,
        "height": 24,
        "content": "✦ SECRET RARE 001/100 ✦",
        "color": "#000000",
        "backgroundColor": "#fbbf24",
        "borderRadius": 3,
        "fontSize": 9,
        "fontWeight": 900,
        "zIndex": 6
      },
      {
        "id": "mana-sphere",
        "type": "badge",
        "x": 255,
        "y": 38,
        "width": 130,
        "height": 26,
        "content": "[✦ DIVINE / LIGHT]",
        "color": "#ffffff",
        "backgroundColor": "#7c3aed",
        "borderRadius": 4,
        "fontSize": 10,
        "fontWeight": 800,
        "border": "1px solid #c084fc",
        "zIndex": 4
      },
      {
        "id": "level-stars",
        "type": "text",
        "x": 720,
        "y": 38,
        "width": 165,
        "height": 24,
        "content": "★★★★★★★★",
        "color": "#fbbf24",
        "fontSize": 16,
        "textAlign": "right",
        "zIndex": 4
      },
      {
        "id": "card-name",
        "type": "text",
        "x": 255,
        "y": 68,
        "width": 630,
        "height": 40,
        "content": "{userName}",
        "color": "#fde047",
        "fontSize": 32,
        "fontWeight": 900,
        "textShadow": "0 0 16px rgba(251, 191, 36, 0.8), 2px 2px 4px #000000",
        "zIndex": 4
      },
      {
        "id": "card-type",
        "type": "text",
        "x": 255,
        "y": 110,
        "width": 630,
        "height": 20,
        "content": "[ Sovereign Archon / Effect ]",
        "color": "#e9d5ff",
        "fontSize": 13,
        "fontWeight": 700,
        "zIndex": 4
      },
      {
        "id": "ability-box",
        "type": "box",
        "x": 255,
        "y": 134,
        "width": 630,
        "height": 64,
        "backgroundColor": "rgba(255,255,255,0.06)",
        "border": "1px solid rgba(251, 191, 36, 0.3)",
        "borderRadius": 6,
        "zIndex": 4
      },
      {
        "id": "ability-text",
        "type": "text",
        "x": 265,
        "y": 140,
        "width": 610,
        "height": 52,
        "content": "When this champion enters with guild [{guildName}], grants all allies +5,000 EXP. Once per battle, can negate all defeat conditions.",
        "color": "#f3e8ff",
        "fontSize": 12,
        "fontWeight": 500,
        "lineHeight": 18,
        "zIndex": 5
      },
      {
        "id": "stat-bar",
        "type": "box",
        "x": 255,
        "y": 204,
        "width": 630,
        "height": 38,
        "backgroundColor": "rgba(0,0,0,0.6)",
        "border": "1px solid #fbbf24",
        "borderRadius": 6,
        "zIndex": 4
      },
      {
        "id": "atk-def",
        "type": "text",
        "x": 270,
        "y": 212,
        "width": 590,
        "height": 22,
        "content": "ATK / 99999          DEF / 88888          EDITION: 1ST PRINT",
        "color": "#fef08a",
        "fontSize": 13,
        "fontWeight": 800,
        "letterSpacing": 1,
        "zIndex": 5
      }
    ]
  },
  "tracks": [
    {
      "elementId": "card-name",
      "keyframes": [
        {
          "id": "cn-0",
          "time": 100,
          "x": 220,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "cn-1",
          "time": 700,
          "x": 255,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "avatar",
      "keyframes": [
        {
          "id": "tc-av-0",
          "time": 0,
          "scaleX": 0.85,
          "scaleY": 0.85,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "tc-av-1",
          "time": 600,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.832Z"
};

export default tcgHologramPattern;
