import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const command = process.argv[2];
const allowedCommands = new Set(["dev", "build", "start"]);

if (!allowedCommands.has(command)) {
  console.error("Usage: node scripts/run-vinext.mjs <dev|build|start>");
  process.exit(1);
}

const logPath = ".wrangler/wrangler.log";

mkdirSync(dirname(logPath), { recursive: true });

const child = spawn("vinext", [command], {
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH ?? logPath,
  },
  shell: process.platform === "win32",
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
