const recipes = [
    { id: 1, name: "Vegan Buddha Bowl", type: "Lunch", calories: 450, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Quinoa", quantity: "1/2 cup" }, { name: "Chickpeas", quantity: "1/2 cup" }, { name: "Avocado", quantity: "1/2" }, { name: "Sweet Potato", quantity: "1 small" }, { name: "Tahini", quantity: "2 tbsp" }], instructions: ["Cook quinoa.", "Roast chickpeas and sweet potato.", "Slice avocado.", "Assemble bowl and drizzle with tahini."], image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" },
    { id: 2, name: "Steak and Asparagus", type: "Dinner", calories: 600, tags: ["Keto", "Paleo", "Gluten-Free", "Beef", "Meat"], ingredients: [{ name: "Sirloin Steak", quantity: "6 oz" }, { name: "Asparagus", quantity: "1 bunch" }, { name: "Butter", quantity: "1 tbsp" }, { name: "Garlic", quantity: "2 cloves" }, { name: "Rosemary", quantity: "1 sprig" }], instructions: ["Season steak with salt and pepper.", "Sear steak in butter and garlic.", "Sauté asparagus pan.", "Rest steak before slicing."], image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Chicken Alfredo Pasta", type: "Dinner", calories: 800, tags: ["Chicken", "Meat"], ingredients: [{ name: "Fettuccine", quantity: "4 oz" }, { name: "Chicken Breast", quantity: "1" }, { name: "Heavy Cream", quantity: "1/2 cup" }, { name: "Parmesan Cheese", quantity: "1/2 cup" }, { name: "Garlic", quantity: "2 cloves" }], instructions: ["Boil pasta.", "Cook chicken in a pan.", "Simmer cream and garlic.", "Whisk in parmesan.", "Toss pasta and chicken in sauce."], image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Tofu Scramble", type: "Breakfast", calories: 350, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free"], ingredients: [{ name: "Firm Tofu", quantity: "1/2 block" }, { name: "Spinach", quantity: "1 cup" }, { name: "Turmeric", quantity: "1/2 tsp" }, { name: "Nutritional Yeast", quantity: "1 tbsp" }, { name: "Onion", quantity: "1/4" }], instructions: ["Crumble tofu.", "Sauté onion.", "Add tofu and seasonings.", "Stir in spinach until wilted."], image: "https://images.unsplash.com/photo-1525925399580-c127457cd370?q=80&w=600&auto=format&fit=crop" },
    { id: 5, name: "Salmon Salad", type: "Lunch", calories: 500, tags: ["Paleo", "Keto", "Gluten-Free", "Fish", "Meat"], ingredients: [{ name: "Salmon Fillet", quantity: "1" }, { name: "Mixed Greens", quantity: "2 cups" }, { name: "Cucumber", quantity: "1/2" }, { name: "Olive Oil", quantity: "1 tbsp" }, { name: "Lemon", quantity: "1/2" }], instructions: ["Pan-sear salmon.", "Chop veggies.", "Whisk olive oil and lemon juice.", "Toss greens and top with salmon."], image: "/images/salmon_salad.png" },
    { id: 6, name: "Blueberry Pancakes", type: "Breakfast", calories: 550, tags: ["Vegetarian"], ingredients: [{ name: "Flour", quantity: "1 cup" }, { name: "Milk", quantity: "1/2 cup" }, { name: "Eggs", quantity: "2" }, { name: "Blueberries", quantity: "1/2 cup" }, { name: "Maple Syrup", quantity: "2 tbsp" }], instructions: ["Whisk batter ingredients.", "Fold in blueberries.", "Cook on griddle until bubbly.", "Serve with maple syrup."], image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop" },
    { id: 7, name: "Oatmeal with Berries", type: "Breakfast", calories: 300, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Rolled Oats", quantity: "1/2 cup" }, { name: "Almond Milk", quantity: "1 cup" }, { name: "Strawberries", quantity: "1/2 cup" }, { name: "Chia Seeds", quantity: "1 tsp" }], instructions: ["Simmer oats in milk.", "Top with berries and chia seeds."], image: "https://images.unsplash.com/photo-1516054575922-f0b8eead17fa?q=80&w=600&auto=format&fit=crop" },
    { id: 8, name: "Grilled Chicken Caesar", type: "Lunch", calories: 450, tags: ["Keto", "Gluten-Free", "Chicken", "Meat"], ingredients: [{ name: "Chicken Breast", quantity: "1" }, { name: "Romaine Lettuce", quantity: "2 cups" }, { name: "Parmesan", quantity: "2 tbsp" }, { name: "Caesar Dressing", quantity: "2 tbsp" }, { name: "Croutons", quantity: "1/4 cup" }], instructions: ["Grill chicken breast.", "Chop lettuce.", "Toss with dressing and cheese.", "Top with sliced chicken."], image: "https://images.unsplash.com/photo-1512852939750-1305098529bf?q=80&w=600&auto=format&fit=crop" },
    { id: 9, name: "Lentil Soup", type: "Dinner", calories: 400, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Lentils", quantity: "1 cup" }, { name: "Carrots", quantity: "2" }, { name: "Celery", quantity: "1 stalk" }, { name: "Onion", quantity: "1/2" }, { name: "Vegetable Broth", quantity: "4 cups" }], instructions: ["Sauté aromatics.", "Add lentils and broth.", "Simmer for 20 mins.", "Blend partially for texture."], image: "https://images.unsplash.com/photo-1547592166-23acbe346499?q=80&w=600&auto=format&fit=crop" },
    { id: 10, name: "Bacon and Eggs", type: "Breakfast", calories: 500, tags: ["Keto", "Paleo", "Gluten-Free", "Pork", "Meat", "Egg"], ingredients: [{ name: "Bacon", quantity: "3 slices" }, { name: "Eggs", quantity: "2" }, { name: "Toast", quantity: "1 slice" }, { name: "Butter", quantity: "1 tsp" }], instructions: ["Fry bacon until crispy.", "Fry eggs in bacon fat.", "Toast bread.", "Serve with butter."], image: "https://images.unsplash.com/photo-1525351453334-e57d5471faa3?q=80&w=600&auto=format&fit=crop" },
    { id: 11, name: "Vegetable Stir Fry", type: "Dinner", calories: 450, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Broccoli", quantity: "1 cup" }, { name: "Bell Peppers", quantity: "1" }, { name: "Soy Sauce", quantity: "2 tbsp" }, { name: "Ginger", quantity: "1 tsp" }, { name: "Rice", quantity: "1 cup cooked" }], instructions: ["Cook rice.", "Sit-fry veggies with ginger.", "Add soy sauce.", "Serve over rice."], image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600&auto=format&fit=crop" },
    { id: 12, name: "Turkey Sandwich", type: "Lunch", calories: 400, tags: ["Turkey", "Meat"], ingredients: [{ name: "Turkey Breast", quantity: "4 oz" }, { name: "Whole Wheat Bread", quantity: "2 slices" }, { name: "Lettuce", quantity: "1 leaf" }, { name: "Tomato", quantity: "2 slices" }, { name: "Mayo", quantity: "1 tbsp" }], instructions: ["Toast bread.", "Assemble sandwich with turkey and veggies.", "Slice in half."], image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop" },
    { id: 13, name: "Greek Yogurt Parfait", type: "Breakfast", calories: 350, tags: ["Vegetarian", "Gluten-Free", "Dairy"], ingredients: [{ name: "Greek Yogurt", quantity: "1 cup" }, { name: "Honey", quantity: "1 tbsp" }, { name: "Granola", quantity: "1/4 cup" }, { name: "Mixed Berries", quantity: "1/2 cup" }], instructions: ["Layer yogurt, granola, and berries.", "Drizzle with honey."], image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop" },
    { id: 14, name: "Beef Tacos", type: "Dinner", calories: 600, tags: ["Gluten-Free", "Beef", "Meat"], ingredients: [{ name: "Ground Beef", quantity: "4 oz" }, { name: "Corn Tortillas", quantity: "3" }, { name: "Salsa", quantity: "2 tbsp" }, { name: "Avocado", quantity: "1/4" }, { name: "Lime", quantity: "1 wedge" }], instructions: ["Brown beef with spices.", "Warm tortillas.", "Assemble tacos with salsa and avocado."], image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop" },
    { id: 15, name: "Quinoa Salad", type: "Lunch", calories: 400, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Quinoa", quantity: "1/2 cup" }, { name: "Cucumber", quantity: "1/2" }, { name: "Cherry Tomatoes", quantity: "1/2 cup" }, { name: "Feta Cheese", quantity: "2 tbsp" }, { name: "Olive Oil", quantity: "2 tbsp" }], instructions: ["Cook quinoa and cool.", "Chop veggies.", "Mix everything with olive oil and feta."], image: "/images/quinoa_salad.png" },
    { id: 16, name: "Zucchini Noodles with Pesto", type: "Dinner", calories: 350, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: [{ name: "Zucchini", quantity: "2" }, { name: "Basil Pesto", quantity: "1/4 cup" }, { name: "Cherry Tomatoes", quantity: "1/2 cup" }, { name: "Pine Nuts", quantity: "1 tbsp" }], instructions: ["Spiralize zucchini.", "Sauté briefly.", "Toss with pesto and tomatoes."], image: "/images/zucchini_noodles_pesto.png" },
    { id: 17, name: "Chia Seed Pudding", type: "Breakfast", calories: 300, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: [{ name: "Chia Seeds", quantity: "3 tbsp" }, { name: "Coconut Milk", quantity: "1 cup" }, { name: "Vanilla Extract", quantity: "1/2 tsp" }, { name: "Stevia", quantity: "to taste" }], instructions: ["Mix chia seeds and milk.", "Refrigerate overnight.", "Top with berries."], image: "/images/chia_seed_pudding.png" },
    { id: 18, name: "Cauliflower Rice Stir Fry", type: "Lunch", calories: 350, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: [{ name: "Cauliflower Rice", quantity: "2 cups" }, { name: "Sugar Snap Peas", quantity: "1/2 cup" }, { name: "Soy Sauce (Tamari)", quantity: "2 tbsp" }, { name: "Sesame Oil", quantity: "1 tbsp" }, { name: "Tofu", quantity: "1/2 block" }], instructions: ["Sauté tofu.", "Add veggies and cauliflower rice.", "Stir fry with sauce."], image: "/images/cauliflower_rice_stir_fry.png" },
    { id: 19, name: "Egg Roll in a Bowl", type: "Dinner", calories: 500, tags: ["Keto", "Paleo", "Gluten-Free", "Pork", "Meat"], ingredients: [{ name: "Ground Pork", quantity: "4 oz" }, { name: "Cabbage Coleslaw Mix", quantity: "2 cups" }, { name: "Ginger", quantity: "1 tsp" }, { name: "Garlic", quantity: "1 clove" }, { name: "Soy Sauce", quantity: "2 tbsp" }], instructions: ["Brown pork.", "Add cabbage and aromatics.", "Cook until wilted."], image: "/images/egg_roll_bowl.png" },
    { id: 20, name: "Spinach & Mushroom Omelet", type: "Breakfast", calories: 400, tags: ["Vegetarian", "Keto", "Gluten-Free", "Egg"], ingredients: [{ name: "Eggs", quantity: "2" }, { name: "Spinach", quantity: "1 cup" }, { name: "Mushrooms", quantity: "1/2 cup" }, { name: "Cheese", quantity: "2 tbsp" }, { name: "Butter", quantity: "1 tsp" }], instructions: ["Whisk eggs.", "Sauté veggies.", "Cook omelet with cheese."], image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=600&auto=format&fit=crop" },
    { id: 21, name: "Avocado Cucumber Salad", type: "Lunch", calories: 450, tags: ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: [{ name: "Avocado", quantity: "1" }, { name: "Cucumber", quantity: "1" }, { name: "Olive Oil", quantity: "1 tbsp" }, { name: "Lemon Juice", quantity: "1 tbsp" }, { name: "Cilantro", quantity: "1 tbsp" }], instructions: ["Chop avocado and cucumber.", "Drizzle with oil and lemon.", "Season with salt."], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop" },
    { id: 22, name: "Coconut Curry Lentils", type: "Dinner", calories: 550, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Red Lentils", quantity: "1 cup dry" }, { name: "Coconut Milk", quantity: "1 cup" }, { name: "Curry Powder", quantity: "1 tbsp" }, { name: "Spinach", quantity: "1 cup" }, { name: "Onion", quantity: "1/2" }], instructions: ["Sauté onion and spices.", "Simmer lentils in coconut milk.", "Stir in spinach."], image: "https://images.unsplash.com/photo-1513222302306-03f44357c936?q=80&w=600&auto=format&fit=crop" },
    { id: 23, name: "Grilled Shrimp Skewers", type: "Dinner", calories: 400, tags: ["Keto", "Paleo", "Gluten-Free", "Fish", "Meat"], ingredients: [{ name: "Shrimp", quantity: "6 oz" }, { name: "Bell Peppers", quantity: "1" }, { name: "Olive Oil", quantity: "1 tbsp" }, { name: "Lemon", quantity: "1/2" }, { name: "Garlic Powder", quantity: "1/2 tsp" }], instructions: ["Marinate shrimp.", "Thread onto skewers with peppers.", "Grill 3 mins per side."], image: "/images/grilled_shrimp_skewers.png" },
    { id: 24, name: "Almond Flour Pancakes", type: "Breakfast", calories: 500, tags: ["Vegetarian", "Keto", "Gluten-Free", "Paleo"], ingredients: [{ name: "Almond Flour", quantity: "1 cup" }, { name: "Eggs", quantity: "2" }, { name: "Almond Milk", quantity: "1/4 cup" }, { name: "Vanilla", quantity: "1 tsp" }], instructions: ["Mix batter.", "Cook on low heat.", "Serve with sugar-free syrup."], image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=600&auto=format&fit=crop" },
    { id: 25, name: "Stuffed Bell Peppers", type: "Dinner", calories: 550, tags: ["Gluten-Free", "Beef", "Meat"], ingredients: [{ name: "Bell Peppers", quantity: "2" }, { name: "Ground Beef", quantity: "4 oz" }, { name: "Rice", quantity: "1/2 cup cooked" }, { name: "Tomato Sauce", quantity: "1/2 cup" }, { name: "Cheese", quantity: "2 tbsp" }], instructions: ["Hollow peppers.", "Stuff with beef and rice mix.", "Bake at 375°F for 30 mins."], image: "/images/stuffed_bell_peppers.png" },
    { id: 26, name: "Miso Glazed Cod", type: "Dinner", calories: 450, tags: ["Keto", "Gluten-Free", "Fish", "Meat"], ingredients: [{ name: "Cod Fillet", quantity: "6 oz" }, { name: "Miso Paste", quantity: "1 tbsp" }, { name: "Sake", quantity: "1 tbsp" }, { name: "Soy Sauce", quantity: "1 tbsp" }, { name: "Ginger", quantity: "1 tsp" }], instructions: ["Marinate cod.", "Broil for 8-10 mins."], image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop" },
    { id: 27, name: "Shakshuka", type: "Breakfast", calories: 450, tags: ["Vegetarian", "Gluten-Free", "Egg"], ingredients: [{ name: "Eggs", quantity: "2" }, { name: "Tomato Sauce", quantity: "1 cup" }, { name: "Bell Peppers", quantity: "1/2" }, { name: "Onion", quantity: "1/2" }, { name: "Cumin", quantity: "1 tsp" }], instructions: ["Simmer sauce with veggies.", "Crack eggs into sauce.", "Cover and cook until set."], image: "/images/shakshuka.png" }
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
