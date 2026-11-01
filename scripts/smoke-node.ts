import fs from "node:fs";
import path from "node:path";
import "../src/lib/runtime-node.js";
import { dispatchGenerate } from "../src/lib/animated-generator.js";
import { smokeCases } from "./smoke-cases.js";

const outDir = path.resolve("./dist/out-node");
fs.mkdirSync(outDir, { recursive: true });
for (const c of smokeCases) {
  const t = Date.now();
  try {
    const r = await dispatchGenerate(c.body);
    fs.writeFileSync(path.join(outDir, `${c.name}.${c.ext}`), r.buffer);
    console.log(`OK   ${c.name.padEnd(16)} ${r.mime} ${r.buffer.length}B ${Date.now() - t}ms`);
  } catch (e) {
    console.log(`FAIL ${c.name}:`, (e as Error).message);
  }
}
