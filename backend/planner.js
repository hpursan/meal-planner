const { getRecipes } = require('./services/recipeService');

const filterRecipes = (allRecipes, preferences, mealType, goal, excludedIds = []) => {
    return allRecipes.filter(recipe => {
        // Exclude specific IDs (Blacklist)
        if (excludedIds.includes(recipe.id)) return false;
        // Must match meal type
        const rType = recipe.type || "Dinner";
        if (rType !== mealType) return false;

        // Functional Accuracy for Goals
        if (goal === 'time') {
            // "Save Time" -> 7 or fewer ingredients
            if (recipe.ingredients && recipe.ingredients.length > 7) return false;
        }
        if (goal === 'health') {
            // "Eat Healthy" -> Lower calorie (< 600)
            if (recipe.calories && recipe.calories > 600) return false;
        }
        if (goal === 'muscle') {
            // "Build Muscle" -> High Protein (>= 25g)
            const proteinStr = recipe.macros?.protein || "0";
            const proteinVal = parseInt(proteinStr.replace('g', '')) || 0;
            if (proteinVal < 25) return false;
        }

        if (!preferences || preferences.length === 0) return true;

        const exclusions = preferences.filter(p => p.startsWith("No "));
        const inclusions = preferences.filter(p => !p.startsWith("No "));

        const recipeTags = (recipe.tags || []).map(t => t.toLowerCase());

        for (const exclusion of exclusions) {
            const forbiddenTag = exclusion.replace("No ", "").toLowerCase();
            if (recipeTags.includes(forbiddenTag)) return false;
        }

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

const generateMealPlan = async (preferences, days, meatFreeDays = [], userRecipes = [], goal = null, excludedIds = []) => {
    const globalRecipes = await getRecipes();
    const allRecipes = [...globalRecipes, ...userRecipes];

    if (userRecipes.length > 0) {
        console.log(`Generating plan with ${globalRecipes.length} global + ${userRecipes.length} user recipes. Goal: ${goal}`);
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

        const breakfastOptions = filterRecipes(allRecipes, dailyPreferences, "Breakfast", goal, excludedIds);
        const lunchOptions = filterRecipes(allRecipes, dailyPreferences, "Lunch", goal, excludedIds);
        const dinnerOptions = filterRecipes(allRecipes, dailyPreferences, "Dinner", goal, excludedIds);

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

const getSwapMeal = async (currentId, mealType, preferences, userRecipes = [], excludedIds = []) => {
    const globalRecipes = await getRecipes();
    const allRecipes = [...globalRecipes, ...userRecipes];

    // Filter potential replacements
    const options = filterRecipes(allRecipes, preferences || [], mealType, null, excludedIds);

    // Remove the current meal from options
    // Assuming currentId is numeric.
    const candidates = options.filter(r => r.id != currentId); // Loose equality for string/number mismatch

    if (candidates.length === 0) return null;

    return getRandom(candidates);
};

module.exports = { generateMealPlan, getSwapMeal };
