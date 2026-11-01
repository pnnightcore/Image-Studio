import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: 🎫 Orbital Boarding Pass
 * Vé bay không gian với vạch đục lỗ rách vé, barcode ma trận, Gate & Seat chuẩn hàng không
 */
export const spaceBoardingPassPattern: StudioPattern = {
  "id": "space-boarding-pass",
  "name": "🎫 Orbital Boarding Pass",
  "description": "Vé bay không gian với vạch đục lỗ rách vé, barcode ma trận, Gate & Seat chuẩn hàng không",
  "duration": 2000,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Orbital Boarding Pass",
    "width": 930,
    "height": 280,
    "background": "#080c14",
    "elements": [
      {
        "id": "ticket-main",
        "type": "box",
        "x": 20,
        "y": 20,
        "width": 630,
        "height": 240,
        "backgroundColor": "#0f172a",
        "border": "2px solid #38bdf8",
        "borderRadius": 16,
        "zIndex": 1
      },
      {
        "id": "ticket-stub",
        "type": "box",
        "x": 670,
        "y": 20,
        "width": 240,
        "height": 240,
        "backgroundColor": "#0f172a",
        "border": "2px solid #38bdf8",
        "borderRadius": 16,
        "zIndex": 1
      },
      {
        "id": "perforation-line",
        "type": "box",
        "x": 659,
        "y": 30,
        "width": 2,
        "height": 220,
        "backgroundColor": "rgba(56, 189, 248, 0.4)",
        "zIndex": 2
      },
      {
        "id": "ticket-header",
        "type": "text",
        "x": 44,
        "y": 36,
        "width": 580,
        "height": 18,
        "content": "◈ ORBITAL HYPERLOOP AIRWAYS ◈  FLIGHT: NX-2077",
        "color": "#38bdf8",
        "fontSize": 11,
        "fontWeight": 800,
        "letterSpacing": 2,
        "zIndex": 2
      },
      {
        "id": "route-from",
        "type": "text",
        "x": 44,
        "y": 60,
        "width": 220,
        "height": 40,
        "content": "EARTH [HND]",
        "color": "#ffffff",
        "fontSize": 28,
        "fontWeight": 900,
        "zIndex": 2
      },
      {
        "id": "route-arrow",
        "type": "text",
        "x": 270,
        "y": 60,
        "width": 70,
        "height": 40,
        "content": "✈ ➔",
        "color": "#38bdf8",
        "fontSize": 22,
        "fontWeight": 800,
        "textAlign": "center",
        "zIndex": 2
      },
      {
        "id": "route-to",
        "type": "text",
        "x": 350,
        "y": 60,
        "width": 220,
        "height": 40,
        "content": "MARS [OLY]",
        "color": "#f59e0b",
        "fontSize": 28,
        "fontWeight": 900,
        "zIndex": 2
      },
      {
        "id": "lbl-passenger",
        "type": "text",
        "x": 44,
        "y": 114,
        "width": 200,
        "height": 16,
        "content": "PASSENGER NAME",
        "color": "#64748b",
        "fontSize": 10,
        "fontWeight": 700,
        "zIndex": 2
      },
      {
        "id": "val-passenger",
        "type": "text",
        "x": 44,
        "y": 132,
        "width": 240,
        "height": 28,
        "content": "{userName}",
        "color": "#f8fafc",
        "fontSize": 20,
        "fontWeight": 800,
        "zIndex": 2
      },
      {
        "id": "lbl-seat",
        "type": "text",
        "x": 300,
        "y": 114,
        "width": 100,
        "height": 16,
        "content": "SEAT / CLASS",
        "color": "#64748b",
        "fontSize": 10,
        "fontWeight": 700,
        "zIndex": 2
      },
      {
        "id": "val-seat",
        "type": "text",
        "x": 300,
        "y": 132,
        "width": 140,
        "height": 28,
        "content": "01A · VIP",
        "color": "#38bdf8",
        "fontSize": 20,
        "fontWeight": 800,
        "zIndex": 2
      },
      {
        "id": "lbl-gate",
        "type": "text",
        "x": 450,
        "y": 114,
        "width": 100,
        "height": 16,
        "content": "GATE / TIME",
        "color": "#64748b",
        "fontSize": 10,
        "fontWeight": 700,
        "zIndex": 2
      },
      {
        "id": "val-gate",
        "type": "text",
        "x": 450,
        "y": 132,
        "width": 170,
        "height": 28,
        "content": "G-42 · 08:30",
        "color": "#f59e0b",
        "fontSize": 20,
        "fontWeight": 800,
        "zIndex": 2
      },
      {
        "id": "guild-ticket-bar",
        "type": "badge",
        "x": 44,
        "y": 176,
        "width": 580,
        "height": 32,
        "content": "GUILD: {guildName} // SECURITY CLEARANCE APPROVED // ZONE 1",
        "color": "#f8fafc",
        "backgroundColor": "rgba(56, 189, 248, 0.12)",
        "borderRadius": 6,
        "fontSize": 11,
        "fontWeight": 700,
        "border": "1px solid rgba(56, 189, 248, 0.25)",
        "zIndex": 2
      },
      {
        "id": "barcode-main",
        "type": "text",
        "x": 44,
        "y": 218,
        "width": 580,
        "height": 20,
        "content": "||| | ||||| || |||||| | |||| ||| ||||||| ||| ||||| |||| || |||",
        "color": "#475569",
        "fontSize": 13,
        "letterSpacing": 4,
        "zIndex": 2
      },
      {
        "id": "stub-header",
        "type": "text",
        "x": 688,
        "y": 36,
        "width": 200,
        "height": 16,
        "content": "BOARDING PASS STUB",
        "color": "#94a3b8",
        "fontSize": 10,
        "fontWeight": 800,
        "letterSpacing": 1,
        "zIndex": 2
      },
      {
        "id": "avatar",
        "type": "avatar",
        "x": 735,
        "y": 60,
        "width": 110,
        "height": 110,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 14,
        "border": "2px solid #38bdf8",
        "zIndex": 2
      },
      {
        "id": "stub-seat",
        "type": "badge",
        "x": 700,
        "y": 180,
        "width": 180,
        "height": 24,
        "content": "SEAT: 01A FIRST",
        "color": "#0f172a",
        "backgroundColor": "#38bdf8",
        "borderRadius": 4,
        "fontSize": 10,
        "fontWeight": 800,
        "zIndex": 2
      },
      {
        "id": "barcode-stub",
        "type": "text",
        "x": 688,
        "y": 216,
        "width": 204,
        "height": 18,
        "content": "|||| ||| |||| ||||||",
        "color": "#64748b",
        "fontSize": 12,
        "letterSpacing": 6,
        "textAlign": "center",
        "zIndex": 2
      }
    ]
  },
  "tracks": [
    {
      "elementId": "ticket-main",
      "keyframes": [
        {
          "id": "tkm-0",
          "time": 0,
          "x": -30,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "tkm-1",
          "time": 600,
          "x": 20,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "ticket-stub",
      "keyframes": [
        {
          "id": "tks-0",
          "time": 200,
          "x": 720,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "tks-1",
          "time": 800,
          "x": 670,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "avatar",
      "keyframes": [
        {
          "id": "tk-av-0",
          "time": 300,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "opacity": 0,
          "easing": "bounce"
        },
        {
          "id": "tk-av-1",
          "time": 850,
          "scaleX": 1,
          "scaleY": 1,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.829Z"
};

export default spaceBoardingPassPattern;
