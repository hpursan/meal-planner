const recipes = [
    { id: 1, name: "Vegan Buddha Bowl", type: "Lunch", calories: 450, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: ["Quinoa", "Chickpeas", "Avocado", "Sweet Potato", "Tahini"], instructions: ["Cook quinoa.", "Roast chickpeas and sweet potato.", "Slice avocado.", "Assemble bowl and drizzle with tahini."] },
    { id: 2, name: "Steak and Asparagus", type: "Dinner", calories: 600, tags: ["Keto", "Paleo", "Gluten-Free", "Beef", "Meat"], ingredients: ["Sirloin Steak", "Asparagus", "Butter", "Garlic", "Rosemary"], instructions: ["Season steak with salt and pepper.", "Sear steak in butter and garlic.", "Sauté asparagus pan.", "Rest steak before slicing."] },
    { id: 3, name: "Chicken Alfredo Pasta", type: "Dinner", calories: 800, tags: ["Chicken", "Meat"], ingredients: ["Fettuccine", "Chicken Breast", "Heavy Cream", "Parmesan Cheese", "Garlic"], instructions: ["Boil pasta.", "Cook chicken in a pan.", "Simmer cream and garlic.", "Whisk in parmesan.", "Toss pasta and chicken in sauce."] },
    { id: 4, name: "Tofu Scramble", type: "Breakfast", calories: 350, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free"], ingredients: ["Firm Tofu", "Spinach", "Turmeric", "Nutritional Yeast", "Onion"], instructions: ["Crumble tofu.", "Sauté onion.", "Add tofu and seasonings.", "Stir in spinach until wilted."] },
    { id: 5, name: "Salmon Salad", type: "Lunch", calories: 500, tags: ["Paleo", "Keto", "Gluten-Free", "Fish", "Meat"], ingredients: ["Salmon Fillet", "Mixed Greens", "Cucumber", "Olive Oil", "Lemon"], instructions: ["Pan-sear salmon.", "Chop veggies.", "Whisk olive oil and lemon juice.", "Toss greens and top with salmon."] },
    { id: 6, name: "Blueberry Pancakes", type: "Breakfast", calories: 550, tags: ["Vegetarian"], ingredients: ["Flour", "Milk", "Eggs", "Blueberries", "Maple Syrup"], instructions: ["Whisk batter ingredients.", "Fold in blueberries.", "Cook on griddle until bubbly.", "Serve with maple syrup."] },
    { id: 7, name: "Oatmeal with Berries", type: "Breakfast", calories: 300, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: ["Rolled Oats", "Almond Milk", "Strawberries", "Chia Seeds"], instructions: ["Simmer oats in milk.", "Top with berries and chia seeds."] },
    { id: 8, name: "Grilled Chicken Caesar", type: "Lunch", calories: 450, tags: ["Keto", "Gluten-Free", "Chicken", "Meat"], ingredients: ["Chicken Breast", "Romaine Lettuce", "Parmesan", "Caesar Dressing", "Croutons"], instructions: ["Grill chicken breast.", "Chop lettuce.", "Toss with dressing and cheese.", "Top with sliced chicken."] },
    { id: 9, name: "Lentil Soup", type: "Dinner", calories: 400, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: ["Lentils", "Carrots", "Celery", "Onion", "Vegetable Broth"], instructions: ["Sauté aromatics.", "Add lentils and broth.", "Simmer for 20 mins.", "Blend partially for texture."] },
    { id: 10, name: "Bacon and Eggs", type: "Breakfast", calories: 500, tags: ["Keto", "Paleo", "Gluten-Free", "Pork", "Meat", "Egg"], ingredients: ["Bacon", "Eggs", "Toast", "Butter"], instructions: ["Fry bacon until crispy.", "Fry eggs in bacon fat.", "Toast bread.", "Serve with butter."] },
    { id: 11, name: "Vegetable Stir Fry", type: "Dinner", calories: 450, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: ["Broccoli", "Bell Peppers", "Soy Sauce", "Ginger", "Rice"], instructions: ["Cook rice.", "Sit-fry veggies with ginger.", "Add soy sauce.", "Serve over rice."] },
    { id: 12, name: "Turkey Sandwich", type: "Lunch", calories: 400, tags: ["Turkey", "Meat"], ingredients: ["Turkey Breast", "Whole Wheat Bread", "Lettuce", "Tomato", "Mayo"], instructions: ["Toast bread.", "Assemble sandwich with turkey and veggies.", "Slice in half."] },
    { id: 13, name: "Greek Yogurt Parfait", type: "Breakfast", calories: 350, tags: ["Vegetarian", "Gluten-Free", "Dairy"], ingredients: ["Greek Yogurt", "Honey", "Granola", "Mixed Berries"], instructions: ["Layer yogurt, granola, and berries.", "Drizzle with honey."] },
    { id: 14, name: "Beef Tacos", type: "Dinner", calories: 600, tags: ["Gluten-Free", "Beef", "Meat"], ingredients: ["Ground Beef", "Corn Tortillas", "Salsa", "Avocado", "Lime"], instructions: ["Brown beef with spices.", "Warm tortillas.", "Assemble tacos with salsa and avocado."] },
    { id: 15, name: "Quinoa Salad", type: "Lunch", calories: 400, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: ["Quinoa", "Cucumber", "Cherry Tomatoes", "Feta Cheese", "Olive Oil"], instructions: ["Cook quinoa and cool.", "Chop veggies.", "Mix everything with olive oil and feta."] },
    // EXPANSION PACK (Fixing Generic Meal Issues)
    { id: 16, name: "Zucchini Noodles with Pesto", type: "Dinner", calories: 350, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: ["Zucchini", "Basil Pesto", "Cherry Tomatoes", "Pine Nuts"], instructions: ["Spiralize zucchini.", "Sauté briefly.", "Toss with pesto and tomatoes."] },
    { id: 17, name: "Chia Seed Pudding", type: "Breakfast", calories: 300, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: ["Chia Seeds", "Coconut Milk", "Vanilla Extract", "Stevia"], instructions: ["Mix chia seeds and milk.", "Refrigerate overnight.", "Top with berries."] },
    { id: 18, name: "Cauliflower Rice Stir Fry", type: "Lunch", calories: 350, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: ["Cauliflower Rice", "Sugar Snap Peas", "Soy Sauce (Tamari)", "Sesame Oil", "Tofu"], instructions: ["Sauté tofu.", "Add veggies and cauliflower rice.", "Stir fry with sauce."] },
    { id: 19, name: "Egg Roll in a Bowl", type: "Dinner", calories: 500, tags: ["Keto", "Paleo", "Gluten-Free", "Pork", "Meat"], ingredients: ["Ground Pork", "Cabbage Coleslaw Mix", "Ginger", "Garlic", "Soy Sauce"], instructions: ["Brown pork.", "Add cabbage and aromatics.", "Cook until wilted."] },
    { id: 20, name: "Spinach & Mushroom Omelet", type: "Breakfast", calories: 400, tags: ["Vegetarian", "Keto", "Gluten-Free", "Egg"], ingredients: ["Eggs", "Spinach", "Mushrooms", "Cheese", "Butter"], instructions: ["Whisk eggs.", "Sauté veggies.", "Cook omelet with cheese."] },
    { id: 21, name: "Avocado Cucumber Salad", type: "Lunch", calories: 450, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: ["Avocado", "Cucumber", "Olive Oil", "Lemon Juice", "Cilantro"], instructions: ["Chop avocado and cucumber.", "Drizzle with oil and lemon.", "Season with salt."] },
    { id: 22, name: "Coconut Curry Lentils", type: "Dinner", calories: 550, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: ["Red Lentils", "Coconut Milk", "Curry Powder", "Spinach", "Onion"], instructions: ["Sauté onion and spices.", "Simmer lentils in coconut milk.", "Stir in spinach."] },
    { id: 23, name: "Grilled Shrimp Skewers", type: "Dinner", calories: 400, tags: ["Keto", "Paleo", "Gluten-Free", "Fish", "Meat"], ingredients: ["Shrimp", "Bell Peppers", "Olive Oil", "Lemon", "Garlic Powder"], instructions: ["Marinate shrimp.", "Thread onto skewers with peppers.", "Grill 3 mins per side."] },
    { id: 24, name: "Almond Flour Pancakes", type: "Breakfast", calories: 500, tags: ["Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: ["Almond Flour", "Eggs", "Almond Milk", "Vanilla"], instructions: ["Mix batter.", "Cook on low heat.", "Serve with sugar-free syrup."] },
    { id: 25, name: "Stuffed Bell Peppers", type: "Dinner", calories: 550, tags: ["Gluten-Free", "Beef", "Meat"], ingredients: ["Bell Peppers", "Ground Beef", "Rice", "Tomato Sauce", "Cheese"], instructions: ["Hollow peppers.", "Stuff with beef and rice mix.", "Bake at 375°F for 30 mins."] },
    { id: 26, name: "Miso Glazed Cod", type: "Dinner", calories: 450, tags: ["Keto", "Gluten-Free", "Fish", "Meat"], ingredients: ["Cod Fillet", "Miso Paste", "Sake", "Soy Sauce", "Ginger"], instructions: ["Marinate cod.", "Broil for 8-10 mins."] },
    { id: 27, name: "Shakshuka", type: "Breakfast", calories: 450, tags: ["Vegetarian", "Gluten-Free", "Egg"], ingredients: ["Eggs", "Tomato Sauce", "Bell Peppers", "Onion", "Cumin"], instructions: ["Simmer sauce with veggies.", "Crack eggs into sauce.", "Cover and cook until set."] }
];

const filterRecipes = (preferences, mealType) => {
    return recipes.filter(recipe => {
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

const generateMealPlan = (basePreferences, days, meatFreeDays = []) => {
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

        const breakfastOptions = filterRecipes(dailyPreferences, "Breakfast");
        const lunchOptions = filterRecipes(dailyPreferences, "Lunch");
        const dinnerOptions = filterRecipes(dailyPreferences, "Dinner");

        // Fallback if no matching recipes found (generic placeholder)
        const fallback = (type) => ({ name: `Generic ${type} (No match found for ${dailyPreferences.join(', ')})`, tags: [] });

        plan.push({
            day: i,
            dayName: dayName,
            meals: {
                breakfast: breakfastOptions.length > 0 ? getRandom(breakfastOptions) : fallback("Breakfast"),
                lunch: lunchOptions.length > 0 ? getRandom(lunchOptions) : fallback("Lunch"),
                dinner: dinnerOptions.length > 0 ? getRandom(dinnerOptions) : fallback("Dinner")
            }
        });
    }
    return plan;
};

const getSwapMeal = (currentId, type, preferences) => {
    const options = filterRecipes(preferences || [], type);
    const alternatives = options.filter(r => r.id !== currentId);

    if (alternatives.length === 0) return null; // No alternative found
    return getRandom(alternatives);
};

module.exports = { generateMealPlan, recipes, getSwapMeal };
