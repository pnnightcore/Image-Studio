import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { StudioPattern } from "../lib/pattern-export.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export function generatePatternTypeScript(pattern: StudioPattern): string {
  const safeId = slugifyPatternId(pattern.id);
  const identifier = toCamelCaseIdentifier(safeId);

  const cleanPattern: StudioPattern = {
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

  return `import type { StudioPattern } from "./types.js";

/**
 * Image Studio Pattern: ${cleanPattern.name}
 * ${cleanPattern.description || "Generated from Image Studio Web"}
 */
export const ${identifier}: StudioPattern = ${JSON.stringify(cleanPattern, null, 2)};

export default ${identifier};
`;
}

export function generatePatternSdkUsage(pattern: StudioPattern, baseUrl = "https://image-studio-green.vercel.app"): string {
  const safeId = slugifyPatternId(pattern.id);
  const vars = pattern.defaultVariables && Object.keys(pattern.defaultVariables).length > 0
    ? JSON.stringify(pattern.defaultVariables, null, 2)
    : "{}";

  return `import { ImageStudio, patterns } from "image-studio";

const studio = new ImageStudio({ baseUrl: ${JSON.stringify(baseUrl)} });

// 1. Render animated GIF/WebP using pattern ID
const animation = await studio.animatePattern(${JSON.stringify(safeId)}, {
  variables: ${vars},
});
await animation.save(${JSON.stringify(safeId + ".gif")});

// 2. Or extract a single PNG frame
const frame = await studio.framePattern(${JSON.stringify(safeId)}, {
  time: ${Math.round((pattern.duration || 2000) * 0.4)},
  variables: ${vars},
});
await frame.save(${JSON.stringify(safeId + ".png")});
`;
}

/**
 * Saves a pattern directly into packages/image-studio/src/patterns/<safeId>.ts
 * and automatically updates packages/image-studio/src/patterns/index.ts
 */
export async function savePatternToSdkPackage(
  pattern: StudioPattern,
  rootDir?: string
): Promise<{
  success: boolean;
  savedToFile: boolean;
  filePath: string;
  patternId: string;
  tsCode: string;
  sdkUsage: string;
}> {
  const baseDir = rootDir || path.resolve(__dirname, "../..");
  const patternsDir = path.resolve(baseDir, "packages/image-studio/src/patterns");
  const safeId = slugifyPatternId(pattern.id);
  const identifier = toCamelCaseIdentifier(safeId);
  const filePath = path.join(patternsDir, `${safeId}.ts`);
  const tsCode = generatePatternTypeScript(pattern);
  const sdkUsage = generatePatternSdkUsage(pattern);

  await fs.promises.mkdir(patternsDir, { recursive: true });
  await fs.promises.writeFile(filePath, tsCode, "utf8");

  // Update or create index.ts in packages/image-studio/src/patterns
  const indexPath = path.join(patternsDir, "index.ts");
  await updatePatternsIndexFile(indexPath, safeId, identifier);

  return {
    success: true,
    savedToFile: true,
    filePath: `packages/image-studio/src/patterns/${safeId}.ts`,
    patternId: safeId,
    tsCode,
    sdkUsage,
  };
}

async function updatePatternsIndexFile(indexPath: string, safeId: string, identifier: string): Promise<void> {
  const patternsDir = path.dirname(indexPath);
  const files = await fs.promises.readdir(patternsDir);
  const patternFiles = files
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts")
    .map((f) => f.replace(/\.ts$/, ""));

  // Ensure current safeId is in the list
  if (!patternFiles.includes(safeId)) {
    patternFiles.push(safeId);
  }
  patternFiles.sort();

  const imports = patternFiles.map((id) => {
    const idIdent = toCamelCaseIdentifier(id);
    return `import { ${idIdent} } from "./${id}.js";`;
  });

  const exportsList = patternFiles.map((id) => `  ${toCamelCaseIdentifier(id)},`);
  const recordEntries = patternFiles.map((id) => `  ${JSON.stringify(id)}: ${toCamelCaseIdentifier(id)},`);

  const content = `import type { StudioPattern } from "./types.js";
${imports.join("\n")}

export * from "./types.js";
export {
${exportsList.join("\n")}
};

export const patterns: Record<string, StudioPattern> = {
${recordEntries.join("\n")}
};

/**
 * Retrieves a registered StudioPattern by ID.
 */
export function getPattern(id: string): StudioPattern | undefined {
  return patterns[id];
}

/**
 * Registers a new pattern into the runtime registry.
 */
export function registerPattern(pattern: StudioPattern): void {
  patterns[pattern.id] = pattern;
}

/**
 * Helper to define a typed StudioPattern.
 */
export function definePattern(pattern: StudioPattern): StudioPattern {
  return pattern;
}
`;

  await fs.promises.writeFile(indexPath, content, "utf8");
}
