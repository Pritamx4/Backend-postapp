import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const routes = ["feed", "create-post"];
const distDir = "dist";
const indexFile = join(distDir, "index.html");

if (!existsSync(indexFile)) {
  throw new Error("dist/index.html was not found. Run vite build first.");
}

for (const route of routes) {
  const routeDir = join(distDir, route);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(indexFile, join(routeDir, "index.html"));
}
