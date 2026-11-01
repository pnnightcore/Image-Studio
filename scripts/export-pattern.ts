import path from "path";
import { fileURLToPath } from "url";
import { PRESETS, DEFAULT_TEMPLATE_VARIABLES } from "../src/lib/animation-presets.js";
import { savePatternToSdkPackage } from "../src/server/pattern-storage.js";
import type { StudioPattern } from "../src/lib/pattern-export.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function main() {
  const targetId = process.argv[2];

  console.log("🎨 Exporting presets to packages/image-studio/src/patterns/...");

  const presetsToExport = targetId && targetId !== "--all"
    ? PRESETS.filter((p) => p.id === targetId)
    : PRESETS;

  if (presetsToExport.length === 0) {
    console.error(`Preset "${targetId}" not found. Available: ${PRESETS.map((p) => p.id).join(", ")}`);
    process.exit(1);
  }

  for (const preset of presetsToExport) {
    const pattern: StudioPattern = {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      duration: preset.duration,
      fps: preset.fps,
      format: "gif",
      defaultVariables: DEFAULT_TEMPLATE_VARIABLES,
      canvas: preset.canvas,
      tracks: preset.tracks,
      category: "builtin",
    };

    const res = await savePatternToSdkPackage(pattern, rootDir);
    console.log(` ✅ Exported pattern [${preset.id}] -> ${res.filePath}`);
  }

  console.log("\n✨ All patterns exported successfully to packages/image-studio!");
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
