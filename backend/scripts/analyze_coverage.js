const fs = require('fs');
const path = require('path');

const recipes = require('../recipes_dump.json');

const analysis = {
    total: recipes.length,
    types: {},
    tags: {},
    combinations: {}
};

recipes.forEach(recipe => {
    // Count Types (Breakfast, Lunch, Dinner)
    analysis.types[recipe.type] = (analysis.types[recipe.type] || 0) + 1;

    // Count Tags
    recipe.tags.forEach(tag => {
        analysis.tags[tag] = (analysis.tags[tag] || 0) + 1;
    });

    // Check combination gaps (e.g. Vegetarian Lunch)
    const mainTags = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Gluten-Free'];
    mainTags.forEach(tag => {
        if (recipe.tags.includes(tag)) {
            const key = `${tag} ${recipe.type}`;
            analysis.combinations[key] = (analysis.combinations[key] || 0) + 1;
        }
    });
});

console.log('--- Recipe Analysis ---');
console.log(`Total Recipes: ${analysis.total}`);
console.log('\nBy Type:');
console.table(analysis.types);
console.log('\nBy Tag:');
console.table(analysis.tags);
console.log('\nBy Combination (Potential Gaps):');
console.table(analysis.combinations);
