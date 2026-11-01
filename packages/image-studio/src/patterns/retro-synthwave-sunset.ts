import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: ✦ Retro Synthwave Outrun 1986
 * Mặt trời neon vector 80s, lưới horizon neon tím hồng chuyển động và bảng đồng hồ cockpit nitro
 */
export const retroSynthwaveSunsetPattern: StudioPattern = {
  "id": "retro-synthwave-sunset",
  "name": "✦ Retro Synthwave Outrun 1986",
  "description": "Mặt trời neon vector 80s, lưới horizon neon tím hồng chuyển động và bảng đồng hồ cockpit nitro",
  "duration": 1800,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Retro Synthwave Sunset",
    "width": 930,
    "height": 280,
    "background": "linear-gradient(180deg, #090014 0%, #20043b 46%, #ff4b72 50%, #15002a 52%, #080010 100%)",
    "elements": [
      {
        "id": "neon-sun",
        "type": "box",
        "borderRadius": 999,
        "x": 385,
        "y": 15,
        "width": 160,
        "height": 160,
        "backgroundColor": "#ec4899",
        "border": "2px solid rgba(251, 191, 36, 0.6)",
        "zIndex": 1
      },
      {
        "id": "horizon-grid-bar",
        "type": "badge",
        "x": 0,
        "y": 140,
        "width": 930,
        "height": 2,
        "content": "",
        "backgroundColor": "#38bdf8",
        "zIndex": 2
      },
      {
        "id": "avatar",
        "type": "avatar",
        "x": 60,
        "y": 65,
        "width": 130,
        "height": 130,
        "borderRadius": 20,
        "border": "3px solid #38bdf8",
        "imageUrl": "{{userAVTurl}}",
        "zIndex": 4
      },
      {
        "id": "driver-tag",
        "type": "badge",
        "x": 215,
        "y": 60,
        "width": 180,
        "height": 26,
        "content": "PILOT // OUTRUN 1986",
        "color": "#38bdf8",
        "backgroundColor": "rgba(56, 189, 248, 0.15)",
        "border": "1px solid rgba(56, 189, 248, 0.4)",
        "borderRadius": 6,
        "fontSize": 11,
        "fontWeight": 900,
        "zIndex": 4
      },
      {
        "id": "driver-name",
        "type": "text",
        "x": 215,
        "y": 92,
        "width": 450,
        "height": 44,
        "content": "{{userName}}",
        "color": "#ffffff",
        "fontSize": 32,
        "fontWeight": 900,
        "textShadow": "0 0 15px rgba(244, 114, 182, 0.8), 0 0 30px rgba(56, 189, 248, 0.5)",
        "zIndex": 4
      },
      {
        "id": "synth-music",
        "type": "text",
        "x": 215,
        "y": 142,
        "width": 450,
        "height": 24,
        "content": "♫ Kavinsky - Nightcall (Drive Synth OST)",
        "color": "#f472b6",
        "fontSize": 13,
        "fontWeight": 600,
        "zIndex": 4
      },
      {
        "id": "speedo-hud",
        "type": "badge",
        "x": 710,
        "y": 65,
        "width": 160,
        "height": 60,
        "content": "188 MPH\nTURBO ACTIVE",
        "color": "#fbbf24",
        "backgroundColor": "rgba(0, 0, 0, 0.6)",
        "border": "2px solid #fbbf24",
        "borderRadius": 10,
        "fontSize": 13,
        "fontWeight": 900,
        "textAlign": "center",
        "zIndex": 4
      },
      {
        "id": "cockpit-telemetry",
        "type": "text",
        "x": 60,
        "y": 220,
        "width": 810,
        "height": 26,
        "content": "SYS: 100% OK  ·  NITRO: FULL  ·  HORIZON GRID: LOCKED  ·  SYNTH ENGINE 8.8 KHZ",
        "color": "#38bdf8",
        "fontSize": 11,
        "fontWeight": 700,
        "textAlign": "center",
        "zIndex": 4
      }
    ]
  },
  "tracks": [
    {
      "elementId": "avatar",
      "keyframes": [
        {
          "id": "sw-av-0",
          "time": 0,
          "x": -30,
          "opacity": 0,
          "rotation": -8,
          "easing": "ease-out"
        },
        {
          "id": "sw-av-1",
          "time": 600,
          "x": 60,
          "opacity": 1,
          "rotation": 0,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "driver-name",
      "keyframes": [
        {
          "id": "sw-nm-0",
          "time": 200,
          "x": 170,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "sw-nm-1",
          "time": 700,
          "x": 215,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "synth-music",
      "keyframes": [
        {
          "id": "sw-sm-0",
          "time": 400,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "sw-sm-1",
          "time": 900,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "speedo-hud",
      "keyframes": [
        {
          "id": "sw-sp-0",
          "time": 500,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "sw-sp-1",
          "time": 1000,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "cockpit-telemetry",
      "keyframes": [
        {
          "id": "sw-cp-0",
          "time": 600,
          "y": 245,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "sw-cp-1",
          "time": 1100,
          "y": 220,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "neon-sun",
      "keyframes": [
        {
          "id": "sw-sn-0",
          "time": 0,
          "scaleX": 1,
          "scaleY": 1,
          "y": 15,
          "easing": "ease-in-out"
        },
        {
          "id": "sw-sn-1",
          "time": 900,
          "scaleX": 1.06,
          "scaleY": 1.06,
          "y": 10,
          "easing": "ease-in-out"
        },
        {
          "id": "sw-sn-2",
          "time": 1800,
          "scaleX": 1,
          "scaleY": 1,
          "y": 15,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.838Z"
};

export default retroSynthwaveSunsetPattern;
