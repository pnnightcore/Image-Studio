import type { CustomCanvasData, TrackData, AnimatedImageFormat } from "./types";

export interface StudioPattern {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  fps?: number;
  format?: AnimatedImageFormat;
  canvas: CustomCanvasData;
  tracks?: TrackData[];
  defaultVariables?: Record<string, string>;
  category?: string;
  author?: string;
  createdAt?: string;
}

export interface PatternExportResult {
  success: boolean;
  savedToFile?: boolean;
  readOnly?: boolean;
  filePath?: string;
  patternId: string;
  message?: string;
  tsCode: string;
  sdkUsage: string;
}

export function slugifyPatternId(id: string): string {
  return (id || "custom-pattern")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "custom-pattern";
}

export function toCamelCaseIdentifier(safeId: string): string {
  const camel = safeId.replace(/[-_]+([a-z0-9])/g, (_, char) => char.toUpperCase());
  return camel + "Pattern";
}

export function sanitizePatternData(pattern: StudioPattern): StudioPattern {
  const safeId = slugifyPatternId(pattern.id);
  return {
    id: safeId,
    name: pattern.name || safeId,
    description: pattern.description || "",
    duration: typeof pattern.duration === "number" ? pattern.duration : 2000,
    fps: typeof pattern.fps === "number" ? pattern.fps : 15,
    format: pattern.format === "webp" ? "webp" : "gif",
    defaultVariables: pattern.defaultVariables || {},
    canvas: pattern.canvas,
    tracks: pattern.tracks || [],
    category: pattern.category || "custom",
    createdAt: pattern.createdAt || new Date().toISOString(),
  };
}

export function generatePatternTypeScript(
  pattern: StudioPattern,
  options: { importSource?: string } = {}
): string {
  const safeId = slugifyPatternId(pattern.id);
  const identifier = toCamelCaseIdentifier(safeId);
  const importSource = options.importSource || "image-studio";
  const cleanPattern = sanitizePatternData(pattern);

  return `import type { StudioPattern } from ${JSON.stringify(importSource)};

/**
 * Image Studio Pattern: ${cleanPattern.name}
 * ${cleanPattern.description || "Generated from Image Studio Web"}
 */
export const ${identifier}: StudioPattern = ${JSON.stringify(cleanPattern, null, 2)};

export default ${identifier};
`;
}

export function generatePatternJson(pattern: StudioPattern): string {
  const cleanPattern = sanitizePatternData(pattern);
  return JSON.stringify(cleanPattern, null, 2);
}

export function generatePatternSdkUsage(
  pattern: StudioPattern,
  baseUrl = "https://image-studio-green.vercel.app"
): string {
  const safeId = slugifyPatternId(pattern.id);
  const identifier = toCamelCaseIdentifier(safeId);
  const vars = pattern.defaultVariables && Object.keys(pattern.defaultVariables).length > 0
    ? JSON.stringify(pattern.defaultVariables, null, 2)
    : "{}";

  return `import { ImageStudio } from "image-studio";
// Option A: If downloaded as a TypeScript module into your project (e.g. ./patterns/${safeId}.ts)
import { ${identifier} } from "./patterns/${safeId}.js";

const studio = new ImageStudio({ baseUrl: ${JSON.stringify(baseUrl)} });

// 1. Render animated GIF/WebP using imported pattern object or pattern ID
const animation = await studio.animatePattern(${identifier}, {
  variables: ${vars},
});
await animation.save(${JSON.stringify(safeId + ".gif")});

// 2. Or extract a single PNG frame at 40% duration
const frame = await studio.framePattern(${identifier}, {
  time: ${Math.round((pattern.duration || 2000) * 0.4)},
  variables: ${vars},
});
await frame.save(${JSON.stringify(safeId + ".png")});
`;
}

/**
 * Browser download helper: exports the pattern as a .ts or .json file.
 */
export function downloadPatternFile(
  pattern: StudioPattern,
  format: "ts" | "json" = "ts",
  importSource = "image-studio"
): void {
  const safeId = slugifyPatternId(pattern.id);
  const content = format === "json"
    ? generatePatternJson(pattern)
    : generatePatternTypeScript(pattern, { importSource });
  const ext = format === "json" ? "json" : "ts";
  const mimeType = format === "json" ? "application/json" : "text/typescript";

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeId}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Modern Native Save: Uses window.showSaveFilePicker to let user choose
 * their local project folder directly from the browser!
 */
export async function savePatternWithNativePicker(
  pattern: StudioPattern,
  format: "ts" | "json" = "ts",
  importSource = "image-studio"
): Promise<{ success: boolean; canceled?: boolean; method: "native-picker" | "download" }> {
  const safeId = slugifyPatternId(pattern.id);
  const content = format === "json"
    ? generatePatternJson(pattern)
    : generatePatternTypeScript(pattern, { importSource });
  const ext = format === "json" ? "json" : "ts";
  const filename = `${safeId}.${ext}`;

  if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          format === "json"
            ? {
                description: "JSON Pattern File",
                accept: { "application/json": [".json"] },
              }
            : {
                description: "TypeScript Pattern File",
                accept: { "text/typescript": [".ts"] },
              },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return { success: true, method: "native-picker" };
    } catch (err: any) {
      if (err.name === "AbortError") {
        return { success: false, canceled: true, method: "native-picker" };
      }
      // If user denied permission or API failed, fall through to download
    }
  }

  // Fallback to classic browser download
  downloadPatternFile(pattern, format, importSource);
  return { success: true, method: "download" };
}

/**
 * Web API caller: exports pattern directly to local SDK package via dev server (only in local dev).
 */
export async function exportPatternToSdkPackage(
  pattern: StudioPattern,
  apiUrl = ""
): Promise<PatternExportResult> {
  const endpoint = `${apiUrl.replace(/\/+$/, "")}/api/dev/export-sdk-pattern`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pattern }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `HTTP ${res.status}: Failed to export pattern`);
  }

  return await res.json();
}
