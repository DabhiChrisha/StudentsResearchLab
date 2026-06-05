const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const frontendDist = path.join(rootDir, "frontend", "dist");
const rootDist = path.join(rootDir, "dist");

if (!fs.existsSync(frontendDist)) {
  throw new Error(`Frontend build output not found: ${frontendDist}`);
}

fs.rmSync(rootDist, { recursive: true, force: true });
fs.cpSync(frontendDist, rootDist, { recursive: true });

console.log(`Created ${path.relative(rootDir, rootDist)} from ${path.relative(rootDir, frontendDist)}`);
