/**
 * Shared smoke cases used by both the Node and Cloudflare (workerd) checks.
 */
import { PRESETS, DEFAULT_TEMPLATE_VARIABLES } from "../src/lib/animation-presets.js";
import { sampleSongs } from "../src/lib/sample-data.js";

const welcome = PRESETS[0];

export const smokeCases: Array<{ name: string; ext: string; body: any }> = [
  {
    name: "quote",
    ext: "png",
    body: {
      type: "quote",
      data: {
        quote: "Xin chào Cloudflare! Tiếng Việt có dấu: ắ ằ ẳ ẵ ặ ơ ư đ.",
        author: "Image Studio",
        handle: "@imagestudio",
        tag: "#edge",
        avatar: "",
      },
    },
  },
  {
    name: "songs",
    ext: "png",
    body: { title: "lofi", items: sampleSongs.slice(0, 4), layout: "list" },
  },
  {
    name: "animated-frame",
    ext: "png",
    body: {
      type: "animated",
      data: {
        title: welcome.canvas.title,
        format: "png",
        frameTime: 350,
        canvas: welcome.canvas,
        tracks: welcome.tracks,
        templateVariables: { ...DEFAULT_TEMPLATE_VARIABLES },
      },
    },
  },
  {
    name: "animated-gif",
    ext: "gif",
    body: {
      type: "animated",
      data: {
        title: welcome.canvas.title,
        format: "gif",
        fps: 6,
        duration: 1000,
        canvas: welcome.canvas,
        tracks: welcome.tracks,
        templateVariables: { ...DEFAULT_TEMPLATE_VARIABLES },
      },
    },
  },
];
