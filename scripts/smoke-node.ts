import fs from "node:fs";
import "../src/lib/runtime-node.js";
import { dispatchGenerate } from "../src/lib/animated-generator.js";
import { smokeCases } from "./smoke-cases.js";

fs.mkdirSync("/tmp/out-node", { recursive: true });
for (const c of smokeCases) {
  const t = Date.now();
  try {
    const r = await dispatchGenerate(c.body);
    fs.writeFileSync(`/tmp/out-node/${c.name}.${c.ext}`, r.buffer);
    console.log(`OK   ${c.name.padEnd(16)} ${r.mime} ${r.buffer.length}B ${Date.now() - t}ms`);
  } catch (e) {
    console.log(`FAIL ${c.name}:`, (e as Error).message);
  }
}
