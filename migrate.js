// migrate.js
require('dotenv').config({ path: './backend/.env' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Both your folders
const IMAGE_DIRS = [
  './frontend/src/assets',
  './frontend/public',
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Recursively get all image files from a folder
function getAllImages(dirPath) {
  let results = [];
  if (!fs.existsSync(dirPath)) {
    console.warn(`⚠️  Folder not found, skipping: ${dirPath}`);
    return results;
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllImages(fullPath)); // goes into subfolders
    } else if (IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

async function migrateImages() {
  let allImages = [];
  for (const dir of IMAGE_DIRS) {
    const found = getAllImages(dir);
    console.log(`📁 Found ${found.length} images in ${dir}`);
    allImages = allImages.concat(found);
  }

  console.log(`\n🚀 Starting migration of ${allImages.length} total images...\n`);

  const urlMap = {};
  let successCount = 0;
  let failCount = 0;

  for (const filePath of allImages) {
    const fileName = path.parse(filePath).name;
    // Preserve subfolder structure as part of public_id
    const relativePath = filePath
      .replace(/\\/g, '/')
      .replace('./frontend/', '');
    const publicId = relativePath
      .substring(0, relativePath.lastIndexOf('.'))
      .replace(/&/g, 'and');  // ✅ fixes the & issue

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,       // e.g. src/assets/logo
        folder: 'my-project',      // groups everything in Cloudinary
        overwrite: false,          // skip if already uploaded
        resource_type: 'auto',     // handles images + svgs
      });

      urlMap[relativePath] = result.secure_url;
      console.log(`✅ ${relativePath}`);
      console.log(`   → ${result.secure_url}\n`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed: ${relativePath}`);
      console.error(`   ${err.message}\n`);
      failCount++;
    }
  }

  // Save the URL map
  fs.writeFileSync('./cloudinary-url-map.json', JSON.stringify(urlMap, null, 2));

  console.log('─────────────────────────────────');
  console.log(`✅ Uploaded:  ${successCount} images`);
  console.log(`❌ Failed:    ${failCount} images`);
  console.log(`📄 URL map saved → cloudinary-url-map.json`);
}

migrateImages();