const fs = require('fs');
const path = require('path');

const batchFile = path.join(__dirname, '../recipes_batch_refined.json');
const mainFile = path.join(__dirname, '../recipes_dump.json'); // We should merge into the main one, or v3 if that was the "latest"

// Let's assume we are merging into recipes_v3_refined.json as that was the latest clean state
const targetFile = path.join(__dirname, '../recipes_v3_refined.json');

const batchRecipes = require(batchFile);
const targetRecipes = require(targetFile);

// Calculate new IDs starting from the end of target
let maxId = targetRecipes.reduce((max, r) => Math.max(max, r.id || 0), 0);

const finalBatch = batchRecipes.map(r => {
    maxId++;
    // Update image extension to .png since our generator produces pngs
    // (The generator tool saves as .png, we will move them shortly)
    const pngImage = r.image.replace('.jpg', '.png');

    return {
        ...r,
        id: maxId,
        created_at: new Date().toISOString(),
        image: pngImage
    };
});

const merged = [...targetRecipes, ...finalBatch];

fs.writeFileSync(targetFile, JSON.stringify(merged, null, 2));

console.log(`✅ Merged ${finalBatch.length} new recipes.`);
console.log(`Total Database Size: ${merged.length}`);
console.log(`Updated images to use .png extension automatically.`);
