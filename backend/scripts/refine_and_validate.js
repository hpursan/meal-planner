const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../recipes_v3_ready.json');
const outputPath = path.join(__dirname, '../recipes_v3_refined.json');

const recipes = require(inputPath);

// 1. Tag Hierarchy Logic
// If specific tag exists, ensure parent tag exists
const TAG_HIERARCHY = {
    'Beef': ['Meat'],
    'Pork': ['Meat'],
    'Chicken': ['Meat'],
    'Turkey': ['Meat'],
    'Fish': ['Meat', 'Pescatarian'],
    'Shrimp': ['Meat', 'Pescatarian'],
    'Salmon': ['Meat', 'Pescatarian', 'Fish'],
    'Bacon': ['Meat', 'Pork'],
    'Egg': ['Vegetarian'], // Eggs are vegetarian but not vegan
    'Vegan': ['Vegetarian', 'Dairy-Free', 'Egg-Free'], // All vegans are vegetarian
    'Paleo': ['Gluten-Free', 'Dairy-Free'] // Paleo implies these usually
};

// 2. Safety/Sanity Checks
function validateRecipe(recipe) {
    const issues = [];

    // Check 1: Tag consistency
    if (recipe.tags.includes('Vegan') && recipe.tags.includes('Meat')) {
        issues.push('CONFLICT: Vegan + Meat');
    }
    if (recipe.tags.includes('Vegan') && recipe.tags.includes('Egg')) {
        issues.push('CONFLICT: Vegan + Egg');
    }

    // Check 2: Calorie Sanity
    if (recipe.calories > 1200) issues.push(`High Calories: ${recipe.calories}`);
    if (recipe.calories < 100) issues.push(`Low Calories: ${recipe.calories}`);

    // Check 3: Complexity
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

    // Special Case: Auto-remove 'Vegetarian' if Meat is added via hierarchy logic (fix bad data)
    if (newTags.has('Meat') && newTags.has('Vegetarian')) {
        // If it was originally meat, strip veg
        newTags.delete('Vegetarian');
        newTags.delete('Vegan');
    }

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
console.log(`--- Validation Report (${report.length} Potential Issues) ---`);
if (report.length > 0) {
    console.table(report);
} else {
    console.log("No issues found!");
}
