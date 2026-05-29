import { spawn } from "node:child_process";

const env = {
  ...Object.fromEntries(
    Object.entries(process.env).filter((entry) => typeof entry[1] === "string"),
  ),
  VERCEL: "1",
  NITRO_PRESET: "vercel",
};

const vite = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "build"], {
  env,
  stdio: "inherit",
});

vite.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

vite.on("exit", async (code) => {
  if (code !== 0) {
    process.exit(code ?? 1);
  }

  await import("./prepare-vercel-output.mjs");
});
