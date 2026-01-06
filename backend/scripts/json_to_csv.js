const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

const inputPath = path.join(__dirname, '../recipes_dump.json');
const outputPath = path.join(__dirname, '../recipes_dump.csv');

try {
    const jsonData = require(inputPath);

    // Flatten complex objects (arrays/objects) to JSON strings for CSV compatibility with Supabase
    // Supabase CSV import expects JSONB columns to be strings or standard JSON formatting
    const flattenedData = jsonData.map(recipe => ({
        ...recipe,
        tags: JSON.stringify(recipe.tags),
        ingredients: JSON.stringify(recipe.ingredients),
        instructions: JSON.stringify(recipe.instructions),
        macros: JSON.stringify(recipe.macros),
        // Ensure ID is present if we want to upsert/overwrite
        created_at: recipe.created_at || new Date().toISOString()
    }));

    const fields = ['id', 'name', 'type', 'calories', 'tags', 'ingredients', 'instructions', 'image', 'is_premium', 'macros', 'created_at'];
    const json2csvParser = new Parser({ fields, quote: '"', escapedQuote: '""' });
    const csv = json2csvParser.parse(flattenedData);

    fs.writeFileSync(outputPath, csv);
    console.log(`✅ Successfully converted ${jsonData.length} recipes to CSV at: ${outputPath}`);
} catch (err) {
    console.error('❌ Error converting to CSV:', err);
}
