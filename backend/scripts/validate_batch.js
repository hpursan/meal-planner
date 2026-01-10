const fs = require('fs');
const path = require('path');

const previewPath = path.join(__dirname, '../recipes_batch_preview.json');
const outputPath = path.join(__dirname, '../recipes_batch_refined.json');

const recipes = require(previewPath);

// RE-USE LOGIC FROM refine_and_validate.js
const TAG_HIERARCHY = {
    'Beef': ['Meat'],
    'Pork': ['Meat'],
    'Chicken': ['Meat'],
    'Turkey': ['Meat'],
    'Fish': ['Meat', 'Pescatarian'],
    'Shrimp': ['Meat', 'Pescatarian'],
    'Salmon': ['Meat', 'Pescatarian', 'Fish'],
    'Bacon': ['Meat', 'Pork'],
    'Egg': ['Vegetarian'],
    'Vegan': ['Vegetarian', 'Dairy-Free', 'Egg-Free'],
    'Paleo': ['Gluten-Free', 'Dairy-Free', 'Grain-Free']
};

function validateRecipe(recipe) {
    const issues = [];

    // Tag Conflicts
    if (recipe.tags.includes('Vegan') && recipe.tags.includes('Meat')) issues.push('CONFLICT: Vegan + Meat');

    // Calorie Sanity
    if (recipe.calories > 1500) issues.push(`High Calories: ${recipe.calories}`);
    if (recipe.calories < 100) issues.push(`Low Calories: ${recipe.calories}`);

    // Complexity
    if (recipe.instructions.length < 2) issues.push('Too simple (instructions)');
    if (recipe.ingredients.length < 3) issues.push('Too simple (ingredients)');

    return issues;
}

const refinedRecipes = recipes.map(recipe => {
    let newTags = new Set(recipe.tags);

    // Apply Hierarchy
    recipe.tags.forEach(tag => {
        if (TAG_HIERARCHY[tag]) {
            TAG_HIERARCHY[tag].forEach(parentTag => newTags.add(parentTag));
        }
    });

    return {
        ...recipe,
        tags: Array.from(newTags)
    };
});

// Run Validation Report
const report = [];
refinedRecipes.forEach(r => {
    const issues = validateRecipe(r);
    if (issues.length > 0) {
        report.push({ name: r.name, issues });
    }
});

// Write Refined Data
fs.writeFileSync(outputPath, JSON.stringify(refinedRecipes, null, 2));

console.log(`✅ Refined ${refinedRecipes.length} recipes.`);
if (report.length > 0) {
    console.table(report);
} else {
    console.log("No issues found! These recipes are clean.");
}

// Show Before/After Tags for a sample
console.log('\n--- Tag Expansion Check (Sample) ---');
console.log(`Original: ${recipes[0].tags.join(', ')}`);
console.log(`Refined:  ${refinedRecipes[0].tags.join(', ')}`);
console.log(`Original: ${recipes[1].tags.join(', ')}`);
console.log(`Refined:  ${refinedRecipes[1].tags.join(', ')}`);
