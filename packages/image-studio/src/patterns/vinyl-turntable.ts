import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: 💿 Retro Vinyl & Hi-Fi Amp
 * Đĩa than xoay tròn 360° với kim đọc cơ học, Amply đèn điện tử và thước đo sóng âm
 */
export const vinylTurntablePattern: StudioPattern = {
  "id": "vinyl-turntable",
  "name": "💿 Retro Vinyl & Hi-Fi Amp",
  "description": "Đĩa than xoay tròn 360° với kim đọc cơ học, Amply đèn điện tử và thước đo sóng âm",
  "duration": 2400,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Retro Vinyl Turntable",
    "width": 930,
    "height": 280,
    "background": "#0d0e12",
    "elements": [
      {
        "id": "turntable-body",
        "type": "box",
        "x": 15,
        "y": 15,
        "width": 900,
        "height": 250,
        "backgroundColor": "#16181f",
        "border": "2px solid #2e3440",
        "borderRadius": 16,
        "zIndex": 1
      },
      {
        "id": "platter-outer",
        "type": "box",
        "x": 35,
        "y": 25,
        "width": 230,
        "height": 230,
        "backgroundColor": "#08090b",
        "border": "3px solid #282c37",
        "borderRadius": 999,
        "zIndex": 2
      },
      {
        "id": "vinyl-groove-1",
        "type": "box",
        "x": 50,
        "y": 40,
        "width": 200,
        "height": 200,
        "backgroundColor": "#0e1014",
        "border": "1px solid #1a1e27",
        "borderRadius": 999,
        "zIndex": 3
      },
      {
        "id": "vinyl-groove-2",
        "type": "box",
        "x": 70,
        "y": 60,
        "width": 160,
        "height": 160,
        "backgroundColor": "#0a0b0e",
        "border": "1px solid #222834",
        "borderRadius": 999,
        "zIndex": 4
      },
      {
        "id": "avatar",
        "type": "avatar",
        "x": 95,
        "y": 85,
        "width": 110,
        "height": 110,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 999,
        "border": "4px solid #f59e0b",
        "zIndex": 5
      },
      {
        "id": "vinyl-spindle",
        "type": "box",
        "x": 142,
        "y": 132,
        "width": 16,
        "height": 16,
        "backgroundColor": "#e2e8f0",
        "border": "2px solid #475569",
        "borderRadius": 999,
        "zIndex": 6
      },
      {
        "id": "tonearm-base",
        "type": "box",
        "x": 255,
        "y": 35,
        "width": 24,
        "height": 24,
        "backgroundColor": "#475569",
        "borderRadius": 999,
        "border": "2px solid #94a3b8",
        "zIndex": 6
      },
      {
        "id": "tonearm-bar",
        "type": "box",
        "x": 215,
        "y": 52,
        "width": 50,
        "height": 7,
        "backgroundColor": "#94a3b8",
        "borderRadius": 3,
        "zIndex": 6
      },
      {
        "id": "amp-panel",
        "type": "box",
        "x": 295,
        "y": 28,
        "width": 605,
        "height": 224,
        "backgroundColor": "#1c202a",
        "border": "1px solid #374151",
        "borderRadius": 12,
        "zIndex": 2
      },
      {
        "id": "hi-fi-badge",
        "type": "badge",
        "x": 315,
        "y": 44,
        "width": 250,
        "height": 24,
        "content": "HIGH RESOLUTION AUDIO · 24-BIT / 192KHZ",
        "color": "#f59e0b",
        "backgroundColor": "rgba(245, 158, 11, 0.12)",
        "borderRadius": 4,
        "fontSize": 9,
        "fontWeight": 800,
        "border": "1px solid rgba(245, 158, 11, 0.3)",
        "zIndex": 3
      },
      {
        "id": "stereo-badge",
        "type": "badge",
        "x": 790,
        "y": 44,
        "width": 95,
        "height": 24,
        "content": "STEREO [L R]",
        "color": "#38bdf8",
        "backgroundColor": "rgba(56, 189, 248, 0.12)",
        "borderRadius": 4,
        "fontSize": 9,
        "fontWeight": 800,
        "zIndex": 3
      },
      {
        "id": "track-title",
        "type": "text",
        "x": 315,
        "y": 78,
        "width": 570,
        "height": 38,
        "content": "NOW SPINNING: {userName}",
        "color": "#ffffff",
        "fontSize": 30,
        "fontWeight": 800,
        "textShadow": "0 0 12px rgba(245, 158, 11, 0.4)",
        "zIndex": 3
      },
      {
        "id": "album-info",
        "type": "text",
        "x": 315,
        "y": 122,
        "width": 570,
        "height": 22,
        "content": "Analog Master Tape · Guild: {guildName}",
        "color": "#94a3b8",
        "fontSize": 15,
        "fontWeight": 500,
        "zIndex": 3
      },
      {
        "id": "eq-bar-1",
        "type": "progress",
        "x": 315,
        "y": 160,
        "width": 70,
        "height": 8,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#10b981",
        "progressPercent": 85,
        "borderRadius": 2,
        "zIndex": 3
      },
      {
        "id": "eq-bar-2",
        "type": "progress",
        "x": 395,
        "y": 160,
        "width": 70,
        "height": 8,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#f59e0b",
        "progressPercent": 95,
        "borderRadius": 2,
        "zIndex": 3
      },
      {
        "id": "eq-bar-3",
        "type": "progress",
        "x": 475,
        "y": 160,
        "width": 70,
        "height": 8,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#ef4444",
        "progressPercent": 70,
        "borderRadius": 2,
        "zIndex": 3
      },
      {
        "id": "time-display",
        "type": "text",
        "x": 755,
        "y": 154,
        "width": 130,
        "height": 20,
        "content": "03:42 / 04:15",
        "color": "#f59e0b",
        "fontSize": 13,
        "fontWeight": 700,
        "textAlign": "right",
        "zIndex": 3
      },
      {
        "id": "track-progress",
        "type": "progress",
        "x": 315,
        "y": 188,
        "width": 570,
        "height": 8,
        "backgroundColor": "rgba(255,255,255,0.1)",
        "progressColor": "#f59e0b",
        "progressPercent": 78,
        "borderRadius": 999,
        "zIndex": 3
      },
      {
        "id": "vu-label",
        "type": "text",
        "x": 315,
        "y": 208,
        "width": 570,
        "height": 16,
        "content": "-20dB      -10dB      -5dB      0dB      +3dB PEAK",
        "color": "#64748b",
        "fontSize": 10,
        "fontWeight": 600,
        "letterSpacing": 2,
        "zIndex": 3
      }
    ]
  },
  "tracks": [
    {
      "elementId": "avatar",
      "keyframes": [
        {
          "id": "vn-av-0",
          "time": 0,
          "rotation": 0,
          "easing": "linear"
        },
        {
          "id": "vn-av-1",
          "time": 1200,
          "rotation": 180,
          "easing": "linear"
        },
        {
          "id": "vn-av-2",
          "time": 2400,
          "rotation": 360,
          "easing": "linear"
        }
      ]
    },
    {
      "elementId": "track-title",
      "keyframes": [
        {
          "id": "tt-0",
          "time": 100,
          "x": 285,
          "opacity": 0,
          "easing": "ease-out"
        },
        {
          "id": "tt-1",
          "time": 700,
          "x": 315,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.830Z"
};

export default vinylTurntablePattern;
