const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');
const files = fs.readdirSync(routesDir);

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace router.METHOD("/path"...) with router.METHOD("/api/path"...)
  // Need to be careful not to end up with /api/api if it is already there.
  let modified = false;
  
  content = content.replace(/(router\.(?:get|post|put|delete|patch)\()([\"'])(?!\/api\/)(\/.*?)(\2)/g, (match, prefix, quote, routePath) => {
    modified = true;
    return `${prefix}${quote}/api${routePath}${quote}`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

// Now update src/index.js
const indexPath = path.join(__dirname, 'src', 'index.js');
let indexContent = fs.readFileSync(indexPath, 'utf8');
let indexModified = false;

// Replace app.use("/api", routerPattern) with app.use(routerPattern)
indexContent = indexContent.replace(/app\.use\(\s*["']\/api["']\s*,\s*([a-zA-Z0-9_]+)\s*\);/g, (match, routerName) => {
  indexModified = true;
  return `app.use(${routerName});`;
});

if (indexModified) {
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Updated src/index.js');
}

console.log('Done refactoring routes.');
