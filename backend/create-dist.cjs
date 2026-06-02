const fs = require("node:fs");
const path = require("node:path");

const distDir = path.join(__dirname, "dist");

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(
  path.join(distDir, "index.html"),
  "StudentsResearchLab backend build output",
);

console.log("dist directory created");
