import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";

const outputDir = ".vercel/output";
const functionDir = `${outputDir}/functions/__server.func`;

if (!existsSync("dist/config.json") || !existsSync("dist/client") || !existsSync("dist/server")) {
  throw new Error("Missing Nitro build output. Run vite build before preparing Vercel output.");
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(`${outputDir}/static`, { recursive: true });
await mkdir(functionDir, { recursive: true });

await cp("dist/config.json", `${outputDir}/config.json`);
await cp("dist/client", `${outputDir}/static`, { recursive: true });
await cp("dist/server", functionDir, { recursive: true });

console.log("Prepared Vercel Build Output API files in .vercel/output.");
