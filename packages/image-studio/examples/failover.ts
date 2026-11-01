import { ImageStudio } from "../src/index.js";

// Cloudflare first (fast, free egress). If it hits a CPU/memory limit (error 1102), is down, or
// can't encode animated WebP, the same request is transparently replayed on the Vercel deployment.
const studio = new ImageStudio({
  baseUrl: ["https://image.example.workers.dev", "https://image-studio.vercel.app"],
  retries: 1,
  timeoutMs: 20_000,
  onFailover: ({ from, to, error }) => console.warn(`fail-over ${from} → ${to} (${error.code})`),
});

const image = await studio.animate({
  title: "demo",
  format: "webp",
  canvas: { title: "demo", width: 400, height: 200, background: "#101820", elements: [] },
  tracks: [],
  duration: 1000,
  fps: 10,
});
console.log("served by", image.baseUrl, image.runtime);
