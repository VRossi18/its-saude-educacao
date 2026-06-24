import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const proxyPath = path.join(process.cwd(), "src", "proxy.ts");
const proxyBackupPath = path.join(process.cwd(), "src", "proxy.ts.bak");

function disableProxy() {
  if (process.env.GITHUB_PAGES !== "true") return;
  if (fs.existsSync(proxyPath)) {
    fs.renameSync(proxyPath, proxyBackupPath);
  }
}

function enableProxy() {
  if (fs.existsSync(proxyBackupPath)) {
    fs.renameSync(proxyBackupPath, proxyPath);
  }
}

disableProxy();

const env = {
  ...process.env,
  GITHUB_PAGES: process.env.GITHUB_PAGES ?? "",
};

const result = spawnSync("next", ["build"], {
  stdio: "inherit",
  shell: true,
  env,
});

enableProxy();

process.exit(result.status ?? 1);
