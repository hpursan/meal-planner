const { getRecipes } = require('./services/recipeService');

const filterRecipes = (allRecipes, preferences, mealType) => {
    return allRecipes.filter(recipe => {
        // Must match meal type
        // Handle User Recipes: User recipes often lack tags/type, so we might need fallback logic or rely on 'type' field being set.
        const rType = recipe.type || "Dinner"; // Default unknown to Dinner for safety? Or reject?
        if (rType !== mealType) return false;

        if (!preferences || preferences.length === 0) return true;

        // Separate inclusions and exclusions
        const exclusions = preferences.filter(p => p.startsWith("No "));
        const inclusions = preferences.filter(p => !p.startsWith("No "));

        // user_recipes might not have 'tags' array, ensure fallback
        const recipeTags = (recipe.tags || []).map(t => t.toLowerCase());

        // Check Exclusions (e.g. "No Beef" -> reject if tags include "Beef")
        for (const exclusion of exclusions) {
            const forbiddenTag = exclusion.replace("No ", "").toLowerCase();
            if (recipeTags.includes(forbiddenTag)) return false;
        }

        // Check Inclusions (e.g. "Vegan" -> must have "Vegan" tag)
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

const generateMealPlan = async (preferences, days, meatFreeDays = [], userRecipes = []) => {
    const globalRecipes = await getRecipes();
    // Merge Global + User Recipes
    const allRecipes = [...globalRecipes, ...userRecipes];

    // Log for debugging
    if (userRecipes.length > 0) {
        console.log(`Generating plan with ${globalRecipes.length} global + ${userRecipes.length} user recipes.`);
    }

    const plan = [];

    for (let i = 1; i <= days; i++) {
        // Determine day of week (Cycle 1..7 -> Mon..Sun)
        const dayIndex = (i - 1) % 7;
        const dayName = DAYS_OF_WEEK[dayIndex];

        // Clone preferences for this day
        let dailyPreferences = [...(preferences || [])];

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
            meals: {
                breakfast: getRandom(breakfastOptions) || fallback("Breakfast"),
                lunch: getRandom(lunchOptions) || fallback("Lunch"),
                dinner: getRandom(dinnerOptions) || fallback("Dinner")
            }
        });
    }
    return plan;
};

const getSwapMeal = async (currentId, mealType, preferences, userRecipes = []) => {
    const globalRecipes = await getRecipes();
    const allRecipes = [...globalRecipes, ...userRecipes];

    // Filter potential replacements
    const options = filterRecipes(allRecipes, preferences || [], mealType);

    // Remove the current meal from options
    // Assuming currentId is numeric.
    const candidates = options.filter(r => r.id != currentId); // Loose equality for string/number mismatch

    if (candidates.length === 0) return null;

    return getRandom(candidates);
};

module.exports = { generateMealPlan, getSwapMeal };
