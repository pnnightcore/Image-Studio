import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: 💻 Dev Terminal Neo-Vim
 * Cửa sổ Terminal Unix với nút macOS, line numbers, cú pháp code và Vim statusline
 */
export const hackerTerminalPattern: StudioPattern = {
  "id": "hacker-terminal",
  "name": "💻 Dev Terminal Neo-Vim",
  "description": "Cửa sổ Terminal Unix với nút macOS, line numbers, cú pháp code và Vim statusline",
  "duration": 1800,
  "fps": 15,
  "format": "gif",
  "defaultVariables": {
    "userAVTurl": "https://github.com/user-attachments/assets/ebbf178f-a0af-468c-bc6d-34f0502f30a8",
    "userName": "ziji",
    "guildName": "Hội Vô Danh 2"
  },
  "canvas": {
    "title": "Dev Terminal Card",
    "width": 930,
    "height": 280,
    "background": "#090d16",
    "elements": [
      {
        "id": "term-frame",
        "type": "box",
        "x": 15,
        "y": 15,
        "width": 900,
        "height": 250,
        "backgroundColor": "#0d1117",
        "border": "1px solid #30363d",
        "borderRadius": 12,
        "zIndex": 1
      },
      {
        "id": "term-titlebar",
        "type": "box",
        "x": 15,
        "y": 15,
        "width": 900,
        "height": 36,
        "backgroundColor": "#161b22",
        "border": "1px solid #30363d",
        "borderRadius": 12,
        "zIndex": 2
      },
      {
        "id": "dot-red",
        "type": "box",
        "x": 32,
        "y": 28,
        "width": 10,
        "height": 10,
        "backgroundColor": "#ff5f56",
        "borderRadius": 999,
        "zIndex": 3
      },
      {
        "id": "dot-yellow",
        "type": "box",
        "x": 48,
        "y": 28,
        "width": 10,
        "height": 10,
        "backgroundColor": "#ffbd2e",
        "borderRadius": 999,
        "zIndex": 3
      },
      {
        "id": "dot-green",
        "type": "box",
        "x": 64,
        "y": 28,
        "width": 10,
        "height": 10,
        "backgroundColor": "#27c93f",
        "borderRadius": 999,
        "zIndex": 3
      },
      {
        "id": "term-title",
        "type": "text",
        "x": 200,
        "y": 24,
        "width": 530,
        "height": 20,
        "content": "ziji@hyper-cluster: ~/workspace/operator.ts (tmux)",
        "color": "#8b949e",
        "fontSize": 11,
        "fontWeight": 500,
        "textAlign": "center",
        "zIndex": 3
      },
      {
        "id": "avatar",
        "type": "avatar",
        "x": 755,
        "y": 60,
        "width": 135,
        "height": 135,
        "imageUrl": "{userAVTurl}",
        "borderRadius": 12,
        "border": "2px solid #58a6ff",
        "zIndex": 3
      },
      {
        "id": "avatar-badge",
        "type": "badge",
        "x": 755,
        "y": 202,
        "width": 135,
        "height": 22,
        "content": "● ROOT_ADMIN",
        "color": "#0d1117",
        "backgroundColor": "#58a6ff",
        "borderRadius": 4,
        "fontSize": 10,
        "fontWeight": 800,
        "zIndex": 3
      },
      {
        "id": "gutter",
        "type": "text",
        "x": 30,
        "y": 64,
        "width": 30,
        "height": 140,
        "content": "01\n02\n03\n04\n05",
        "color": "#484f58",
        "fontSize": 13,
        "fontWeight": 600,
        "lineHeight": 28,
        "zIndex": 3
      },
      {
        "id": "code-line-1",
        "type": "text",
        "x": 72,
        "y": 64,
        "width": 660,
        "height": 22,
        "content": "import { NeuralOperator } from '@studio/core';",
        "color": "#ff7b72",
        "fontSize": 13,
        "fontWeight": 600,
        "zIndex": 3
      },
      {
        "id": "code-line-2",
        "type": "text",
        "x": 72,
        "y": 92,
        "width": 660,
        "height": 22,
        "content": "const operator = await NeuralOperator.init('{userName}');",
        "color": "#d2a8ff",
        "fontSize": 13,
        "fontWeight": 600,
        "zIndex": 3
      },
      {
        "id": "code-line-3",
        "type": "text",
        "x": 72,
        "y": 120,
        "width": 660,
        "height": 22,
        "content": "await operator.connectGuild('{guildName}', { role: 'Vanguard' });",
        "color": "#79c0ff",
        "fontSize": 13,
        "fontWeight": 600,
        "zIndex": 3
      },
      {
        "id": "code-line-4",
        "type": "text",
        "x": 72,
        "y": 148,
        "width": 660,
        "height": 22,
        "content": "console.log('⚡ Access Granted: 100% CLEARANCE');",
        "color": "#7ee787",
        "fontSize": 13,
        "fontWeight": 600,
        "zIndex": 3
      },
      {
        "id": "cursor",
        "type": "badge",
        "x": 72,
        "y": 178,
        "width": 170,
        "height": 24,
        "content": "$ EXECUTE_SUCCESS █",
        "color": "#58a6ff",
        "backgroundColor": "rgba(88, 166, 255, 0.12)",
        "borderRadius": 4,
        "fontSize": 11,
        "fontWeight": 700,
        "zIndex": 3
      },
      {
        "id": "statusline",
        "type": "box",
        "x": 15,
        "y": 230,
        "width": 900,
        "height": 35,
        "backgroundColor": "#161b22",
        "border": "1px solid #30363d",
        "borderRadius": 10,
        "zIndex": 2
      },
      {
        "id": "status-mode",
        "type": "badge",
        "x": 25,
        "y": 236,
        "width": 80,
        "height": 22,
        "content": "NORMAL",
        "color": "#0d1117",
        "backgroundColor": "#58a6ff",
        "borderRadius": 3,
        "fontSize": 10,
        "fontWeight": 900,
        "zIndex": 3
      },
      {
        "id": "status-file",
        "type": "text",
        "x": 115,
        "y": 238,
        "width": 350,
        "height": 18,
        "content": "operator.ts [utf-8] [typescript] 5 lines",
        "color": "#c9d1d9",
        "fontSize": 11,
        "fontWeight": 500,
        "zIndex": 3
      },
      {
        "id": "status-right",
        "type": "text",
        "x": 710,
        "y": 238,
        "width": 185,
        "height": 18,
        "content": "100%  col:24  ln:5",
        "color": "#8b949e",
        "fontSize": 11,
        "fontWeight": 600,
        "textAlign": "right",
        "zIndex": 3
      }
    ]
  },
  "tracks": [
    {
      "elementId": "avatar",
      "keyframes": [
        {
          "id": "tm-av-0",
          "time": 0,
          "opacity": 0,
          "scaleX": 0.8,
          "scaleY": 0.8,
          "easing": "bounce"
        },
        {
          "id": "tm-av-1",
          "time": 500,
          "opacity": 1,
          "scaleX": 1,
          "scaleY": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "code-line-2",
      "keyframes": [
        {
          "id": "cl2-0",
          "time": 100,
          "opacity": 0,
          "easing": "linear"
        },
        {
          "id": "cl2-1",
          "time": 400,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "code-line-4",
      "keyframes": [
        {
          "id": "cl4-0",
          "time": 400,
          "opacity": 0,
          "easing": "linear"
        },
        {
          "id": "cl4-1",
          "time": 750,
          "opacity": 1,
          "easing": "ease-in-out"
        }
      ]
    },
    {
      "elementId": "cursor",
      "keyframes": [
        {
          "id": "csr-0",
          "time": 0,
          "opacity": 1,
          "easing": "linear"
        },
        {
          "id": "csr-1",
          "time": 450,
          "opacity": 0.2,
          "easing": "linear"
        },
        {
          "id": "csr-2",
          "time": 900,
          "opacity": 1,
          "easing": "linear"
        },
        {
          "id": "csr-3",
          "time": 1350,
          "opacity": 0.2,
          "easing": "linear"
        },
        {
          "id": "csr-4",
          "time": 1800,
          "opacity": 1,
          "easing": "linear"
        }
      ]
    }
  ],
  "category": "builtin",
  "createdAt": "2026-11-01T15:13:18.826Z"
};

export default hackerTerminalPattern;
