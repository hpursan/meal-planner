const { getRecipes } = require('./services/recipeService');

const filterRecipes = (allRecipes, preferences, mealType) => {
    return allRecipes.filter(recipe => {
        // Must match meal type
        if (recipe.type !== mealType) return false;

        if (!preferences || preferences.length === 0) return true;

        // Separate inclusions and exclusions
        const exclusions = preferences.filter(p => p.startsWith("No "));
        const inclusions = preferences.filter(p => !p.startsWith("No "));

        const recipeTags = recipe.tags.map(t => t.toLowerCase());

        // Check Exclusions (e.g. "No Beef" -> reject if tags include "Beef")
        for (const exclusion of exclusions) {
            const forbiddenTag = exclusion.replace("No ", "").toLowerCase();
            if (recipeTags.includes(forbiddenTag)) return false;
        }

        // Check Inclusions (e.g. "Vegan" -> must have "Vegan" tag)
        // logic: If inclusion list is present, recipe MUST have ALL of them?
        // Standard dietary logic usually implies strict adherence (e.g. Vegan AND Gluten-Free).
        if (inclusions.length > 0) {
            const hasAllInclusions = inclusions.every(pref => recipeTags.includes(pref.toLowerCase()));
            if (!hasAllInclusions) return false;
        }

        return true;
    });
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// daysMap identifying map index 0-6 to Mon-Sun
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const generateMealPlan = async (basePreferences, days, meatFreeDays = []) => {
    const allRecipes = await getRecipes();
    const plan = [];

    for (let i = 1; i <= days; i++) {
        // Determine day of week (Cycle 1..7 -> Mon..Sun)
        const dayIndex = (i - 1) % 7;
        const dayName = DAYS_OF_WEEK[dayIndex];

        // Clone preferences for this day
        let dailyPreferences = [...(basePreferences || [])];

        // Apply Meat-Free (Vegetarian) if today is a meat-free day
        if (meatFreeDays.includes(dayName)) {
            // Only add Vegetarian if not already there or stricter (Vegan)
            if (!dailyPreferences.includes("Vegan") && !dailyPreferences.includes("Vegetarian")) {
                dailyPreferences.push("Vegetarian");
            }
        }

        const breakfastOptions = filterRecipes(allRecipes, dailyPreferences, "Breakfast");
        const lunchOptions = filterRecipes(allRecipes, dailyPreferences, "Lunch");
        const dinnerOptions = filterRecipes(allRecipes, dailyPreferences, "Dinner");

        // Fallback if no matching recipes found (generic placeholder)
        const fallback = (type) => ({
            name: `Generic ${type} (No match found for ${dailyPreferences.join(', ')})`,
            tags: [],
            ingredients: [], // Empty array to prevent crash in ShoppingListView
            instructions: ["No specific recipe found fitting criteria."],
            image: "/images/generic_fallback_meal.png" // Generic food image
        });

        plan.push({
            day: i,
            dayName: dayName,
            meals: [
                getRandom(breakfastOptions) || fallback("Breakfast"),
                getRandom(lunchOptions) || fallback("Lunch"),
                getRandom(dinnerOptions) || fallback("Dinner")
            ]
        });
    }
    return plan;
};

const getSwapMeal = async (currentId, mealType, preferences) => {
    const allRecipes = await getRecipes();
    // Filter potential replacements
    const options = filterRecipes(allRecipes, preferences || [], mealType);

    // Remove the current meal from options
    // Assuming currentId is numeric.
    const candidates = options.filter(r => r.id != currentId); // Loose equality for string/number mismatch

    if (candidates.length === 0) return null;

    return getRandom(candidates);
};

module.exports = { generateMealPlan, getSwapMeal };
