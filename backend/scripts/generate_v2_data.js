const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../recipes_dump.json');
const outputPath = path.join(__dirname, '../recipes_enriched.json');

const existingRecipes = require(inputPath);

// Helper to estimate macros based on tags/ingredients (Mock AI logic)
function estimateMacros(recipe) {
    const { calories, tags, name } = recipe;
    let protein = "20g";
    let carbs = "40g";
    let fats = "15g";

    const isMeat = tags.some(t => ['Beef', 'Chicken', 'Pork', 'Fish', 'Meat', 'Turkey'].includes(t));
    const isKeto = tags.includes('Keto');
    const isVegan = tags.includes('Vegan');

    if (isMeat) {
        protein = "30g";
        carbs = "20g";
        fats = "15g";
    }
    if (isKeto) {
        protein = "25g";
        carbs = "10g";
        fats = "35g";
    }
    if (isVegan) {
        protein = "15g";
        carbs = "60g"; // More carbs from legumes/grains
        fats = "12g";
    }

    // Adjust based on calories
    // 1g Protein = 4cal, 1g Carb = 4cal, 1g Fat = 9cal
    // This is a rough heuristic for the MVP 7.5
    return {
        calories: calories,
        protein,
        carbs,
        fats
    };
}

const enrichedExisting = existingRecipes.map(r => ({
    ...r,
    macros: estimateMacros(r)
}));

const newRecipes = [
    {
        name: "Avocado Toast with Poached Egg",
        type: "Breakfast",
        calories: 350,
        tags: ["Vegetarian", "Egg"],
        ingredients: [{ name: "Sourdough Bread", quantity: "1 slice" }, { name: "Avocado", quantity: "1/2" }, { name: "Egg", quantity: "1" }],
        instructions: ["Toast bread.", "Mash avocado.", "Poach egg.", "Assemble."],
        image: "/images/avocado_toast_egg.png",
        is_premium: false,
        macros: { calories: 350, protein: "12g", carbs: "30g", fats: "18g" }
    },
    {
        name: "Berry Smoothie Bowl",
        type: "Breakfast",
        calories: 300,
        tags: ["Vegan", "Vegetarian", "Gluten-Free"],
        ingredients: [{ name: "Frozen Berries", quantity: "1 cup" }, { name: "Banana", quantity: "1" }, { name: "Almond Milk", quantity: "1/2 cup" }],
        instructions: ["Blend all ingredients.", "Pour into bowl.", "Top with granola."],
        image: "/images/berry_smoothie_bowl.png",
        is_premium: false,
        macros: { calories: 300, protein: "5g", carbs: "50g", fats: "4g" }
    },
    {
        name: "Vegetable Omelette",
        type: "Breakfast",
        calories: 250,
        tags: ["Vegetarian", "Gluten-Free", "Keto", "Egg"],
        ingredients: [{ name: "Eggs", quantity: "2" }, { name: "Bell Peppers", quantity: "1/4 cup" }, { name: "Onion", quantity: "2 tbsp" }],
        instructions: ["Whisk eggs.", "Sauté veggies.", "Cook omelette."],
        image: "/images/vegetable_omelette.png",
        is_premium: false,
        macros: { calories: 250, protein: "14g", carbs: "5g", fats: "18g" }
    },
    {
        name: "Greek Yogurt with Honey",
        type: "Breakfast",
        calories: 200,
        tags: ["Vegetarian", "Gluten-Free"],
        ingredients: [{ name: "Greek Yogurt", quantity: "1 cup" }, { name: "Honey", quantity: "1 tbsp" }],
        instructions: ["Scoop yogurt.", "Drizzle honey."],
        image: "/images/greek_yogurt_honey.png",
        is_premium: false,
        macros: { calories: 200, protein: "20g", carbs: "18g", fats: "0g" }
    },
    {
        name: "Vegan Pancakes",
        type: "Breakfast",
        calories: 400,
        tags: ["Vegan", "Vegetarian"],
        ingredients: [{ name: "Flour", quantity: "1 cup" }, { name: "Almond Milk", quantity: "1 cup" }, { name: "Baking Powder", quantity: "1 tbsp" }],
        instructions: ["Mix ingredients.", "Cook on griddle."],
        image: "/images/vegan_pancakes.png",
        is_premium: false,
        macros: { calories: 400, protein: "8g", carbs: "70g", fats: "6g" }
    },
    { name: "Scrambled Tofu Burrito", type: "Breakfast", calories: 450, tags: ["Vegan", "Vegetarian"], ingredients: [{ name: "Tofu", quantity: "1/2 block" }, { name: "Tortilla", quantity: "1" }], instructions: ["Scramble tofu.", "Wrap in tortilla."], image: "/images/scrambled_tofu_burrito.png", is_premium: false, macros: { calories: 450, protein: "18g", carbs: "45g", fats: "15g" } },
    { name: "Peanut Butter Banana Toast", type: "Breakfast", calories: 350, tags: ["Vegan", "Vegetarian"], ingredients: [{ name: "Bread", quantity: "1 slice" }, { name: "Peanut Butter", quantity: "1 tbsp" }, { name: "Banana", quantity: "1" }], instructions: ["Toast bread.", "Spread PB.", "Slice banana."], image: "/images/pb_banana_toast.png", is_premium: false, macros: { calories: 350, protein: "10g", carbs: "40g", fats: "14g" } },
    { name: "Breakfast Quinoa Bowl", type: "Breakfast", calories: 400, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Quinoa", quantity: "1 cup" }, { name: "Almond Milk", quantity: "1/2 cup" }], instructions: ["Cook quinoa.", "Add milk."], image: "/images/breakfast_quinoa.png", is_premium: false, macros: { calories: 400, protein: "12g", carbs: "55g", fats: "8g" } },
    { name: "Mushroom Spinach Frittata", type: "Breakfast", calories: 300, tags: ["Vegetarian", "Keto", "Gluten-Free", "Egg"], ingredients: [{ name: "Eggs", quantity: "3" }, { name: "Mushrooms", quantity: "1/2 cup" }], instructions: ["Sauté veg.", "Add eggs.", "Bake."], image: "/images/mushroom_frittata.png", is_premium: false, macros: { calories: 300, protein: "18g", carbs: "6g", fats: "20g" } },
    { name: "Smoked Salmon Bagel", type: "Breakfast", calories: 450, tags: ["Fish", "Meat"], ingredients: [{ name: "Bagel", quantity: "1" }, { name: "Cream Cheese", quantity: "2 tbsp" }, { name: "Smoked Salmon", quantity: "2 oz" }], instructions: ["Slice bagel.", "Spread cheese.", "Top with salmon."], image: "/images/salmon_bagel.png", is_premium: false, macros: { calories: 450, protein: "25g", carbs: "50g", fats: "15g" } },

    {
        name: "Caprese Salad",
        type: "Lunch",
        calories: 350,
        tags: ["Vegetarian", "Gluten-Free", "Keto"],
        ingredients: [{ name: "Tomato", quantity: "2" }, { name: "Mozzarella", quantity: "4 oz" }, { name: "Basil", quantity: "Fresh" }],
        instructions: ["Slice tomatoes and cheese.", "Layer with basil.", "Drizzle balsamic."],
        image: "/images/caprese_salad.png",
        is_premium: false,
        macros: { calories: 350, protein: "20g", carbs: "8g", fats: "25g" }
    },
    {
        name: "Chicken Wrap",
        type: "Lunch",
        calories: 500,
        tags: ["Chicken", "Meat"],
        ingredients: [{ name: "Tortilla", quantity: "1" }, { name: "Chicken Breast", quantity: "4 oz" }, { name: "Lettuce", quantity: "1 cup" }],
        instructions: ["Cook chicken.", "Wrap with lettuce."],
        image: "/images/chicken_wrap.png",
        is_premium: false,
        macros: { calories: 500, protein: "35g", carbs: "40g", fats: "18g" }
    },
    {
        name: "Lentil Salad",
        type: "Lunch",
        calories: 400,
        tags: ["Vegan", "Vegetarian", "Gluten-Free"],
        ingredients: [{ name: "Lentils", quantity: "1 cup cooked" }, { name: "Cucumber", quantity: "1/2" }, { name: "Lemon", quantity: "1" }],
        instructions: ["Mix lentils and veggies.", "Dress with lemon."],
        image: "/images/lentil_salad.png",
        is_premium: false,
        macros: { calories: 400, protein: "15g", carbs: "50g", fats: "5g" }
    },
    { name: "Tuna Salad", type: "Lunch", calories: 350, tags: ["Fish", "Meat", "Gluten-Free"], ingredients: [{ name: "Canned Tuna", quantity: "1 can" }, { name: "Mayo", quantity: "1 tbsp" }], instructions: ["Mix tuna and mayo."], image: "/images/tuna_salad.png", is_premium: false, macros: { calories: 350, protein: "30g", carbs: "2g", fats: "20g" } },
    { name: "Falafel Pita", type: "Lunch", calories: 550, tags: ["Vegan", "Vegetarian"], ingredients: [{ name: "Pita", quantity: "1" }, { name: "Falafel", quantity: "4" }, { name: "Tahini", quantity: "1 tbsp" }], instructions: ["Stuff pita.", "Drizzle tahini."], image: "/images/falafel_pita.png", is_premium: false, macros: { calories: 550, protein: "18g", carbs: "70g", fats: "22g" } },
    { name: "Cobb Salad", type: "Lunch", calories: 600, tags: ["Keto", "Gluten-Free", "Chicken", "Meat", "Egg"], ingredients: [{ name: "Lettuce", quantity: "2 cups" }, { name: "Chicken", quantity: "4 oz" }, { name: "Egg", quantity: "1" }], instructions: ["Assemble salad."], image: "/images/cobb_salad.png", is_premium: false, macros: { calories: 600, protein: "40g", carbs: "10g", fats: "35g" } },
    { name: "Vegetable Soup", type: "Lunch", calories: 200, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Carrots", quantity: "2" }, { name: "Celery", quantity: "2" }, { name: "Broth", quantity: "2 cups" }], instructions: ["Simmer veggies."], image: "/images/vegetable_soup.png", is_premium: false, macros: { calories: 200, protein: "4g", carbs: "30g", fats: "2g" } },
    { name: "Turkey Burger", type: "Lunch", calories: 450, tags: ["Meat", "Turkey"], ingredients: [{ name: "Turkey Patty", quantity: "1" }, { name: "Bun", quantity: "1" }], instructions: ["Grill burger.", "Serve on bun."], image: "/images/turkey_burger.png", is_premium: false, macros: { calories: 450, protein: "30g", carbs: "35g", fats: "15g" } },
    { name: "Spinach Pasta", type: "Lunch", calories: 500, tags: ["Vegetarian"], ingredients: [{ name: "Pasta", quantity: "1 cup" }, { name: "Spinach", quantity: "2 cups" }], instructions: ["Cook pasta.", "Sauté spinach.", "Mix."], image: "/images/spinach_pasta.png", is_premium: false, macros: { calories: 500, protein: "15g", carbs: "75g", fats: "8g" } },
    { name: "Shrimp Taco Bowl", type: "Lunch", calories: 400, tags: ["Fish", "Meat", "Gluten-Free"], ingredients: [{ name: "Shrimp", quantity: "4 oz" }, { name: "Rice", quantity: "1/2 cup" }, { name: "Corn", quantity: "1/4 cup" }], instructions: ["Cook shrimp.", "Simmer corn.", "Serve over rice."], image: "/images/shrimp_taco_bowl.png", is_premium: false, macros: { calories: 400, protein: "25g", carbs: "45g", fats: "10g" } },

    {
        name: "Beef Stir Fry",
        type: "Dinner",
        calories: 600,
        tags: ["Beef", "Meat", "Gluten-Free"],
        ingredients: [{ name: "Beef Strips", quantity: "6 oz" }, { name: "Broccoli", quantity: "1 cup" }, { name: "Soy Sauce", quantity: "2 tbsp" }],
        instructions: ["Stir fry beef.", "Add broccoli."],
        image: "/images/beef_stir_fry.png",
        is_premium: false,
        macros: { calories: 600, protein: "45g", carbs: "20g", fats: "30g" }
    },
    {
        name: "Baked Salmon with Asparagus",
        type: "Dinner",
        calories: 500,
        tags: ["Fish", "Meat", "Keto", "Gluten-Free"],
        ingredients: [{ name: "Salmon", quantity: "6 oz" }, { name: "Asparagus", quantity: "1 bunch" }],
        instructions: ["Bake salmon and asparagus."],
        image: "/images/baked_salmon.png",
        is_premium: false,
        macros: { calories: 500, protein: "40g", carbs: "5g", fats: "28g" }
    },
    {
        name: "Vegetarian Chili",
        type: "Dinner",
        calories: 400,
        tags: ["Vegan", "Vegetarian", "Gluten-Free"],
        ingredients: [{ name: "Beans", quantity: "2 cans" }, { name: "Tomato Sauce", quantity: "1 can" }, { name: "Chili Powder", quantity: "2 tbsp" }],
        instructions: ["Simmer everything."],
        image: "/images/vegetarian_chili.png",
        is_premium: false,
        macros: { calories: 400, protein: "18g", carbs: "60g", fats: "5g" }
    },
    { name: "Pesto Pasta", type: "Dinner", calories: 550, tags: ["Vegetarian"], ingredients: [{ name: "Pasta", quantity: "1 cup" }, { name: "Pesto", quantity: "2 tbsp" }], instructions: ["Cook pasta.", "Toss with pesto."], image: "/images/pesto_pasta.png", is_premium: false, macros: { calories: 550, protein: "12g", carbs: "70g", fats: "25g" } },
    { name: "Chicken Curry", type: "Dinner", calories: 600, tags: ["Chicken", "Meat", "Gluten-Free"], ingredients: [{ name: "Chicken", quantity: "4 oz" }, { name: "Coconut Milk", quantity: "1 cup" }, { name: "Curry Paste", quantity: "1 tbsp" }], instructions: ["Simmer chicken in sauce."], image: "/images/chicken_curry.png", is_premium: false, macros: { calories: 600, protein: "35g", carbs: "15g", fats: "40g" } },
    { name: "Portobello Mushroom Burger", type: "Dinner", calories: 350, tags: ["Vegan", "Vegetarian", "Gluten-Free"], ingredients: [{ name: "Portobello Mushroom", quantity: "2" }, { name: "Lettuce", quantity: "2 leaves" }], instructions: ["Grill mushrooms.", "Use as buns."], image: "/images/mushroom_burger.png", is_premium: false, macros: { calories: 350, protein: "8g", carbs: "15g", fats: "10g" } },
    { name: "Fish Tacos", type: "Dinner", calories: 450, tags: ["Fish", "Meat"], ingredients: [{ name: "White Fish", quantity: "4 oz" }, { name: "Tortilla", quantity: "2" }, { name: "Cabbage", quantity: "1/2 cup" }], instructions: ["Fry fish.", "Fill tacos."], image: "/images/fish_tacos.png", is_premium: false, macros: { calories: 450, protein: "25g", carbs: "40g", fats: "18g" } },
    { name: "Spaghetti Bolognese", type: "Dinner", calories: 700, tags: ["Beef", "Meat"], ingredients: [{ name: "Spaghetti", quantity: "1 cup" }, { name: "Ground Beef", quantity: "4 oz" }, { name: "Tomato Sauce", quantity: "1/2 cup" }], instructions: ["Cook sauce with beef.", "Serve over pasta."], image: "/images/spaghetti_bolognese.png", is_premium: false, macros: { calories: 700, protein: "35g", carbs: "80g", fats: "25g" } },
    { name: "Eggplant Parmesan", type: "Dinner", calories: 550, tags: ["Vegetarian"], ingredients: [{ name: "Eggplant", quantity: "1" }, { name: "Marinara", quantity: "1 cup" }, { name: "Mozzarella", quantity: "1/2 cup" }], instructions: ["Bread eggplant.", "Bake with sauce and cheese."], image: "/images/eggplant_parm.png", is_premium: false, macros: { calories: 550, protein: "20g", carbs: "45g", fats: "30g" } },
    { name: "Lemon Herb Chicken", type: "Dinner", calories: 450, tags: ["Chicken", "Meat", "Gluten-Free", "Keto"], ingredients: [{ name: "Chicken Thighs", quantity: "2" }, { name: "Lemon", quantity: "1" }, { name: "Herbs", quantity: "Mix" }], instructions: ["Roast chicken with herbs."], image: "/images/lemon_chicken.png", is_premium: false, macros: { calories: 450, protein: "30g", carbs: "2g", fats: "35g" } }
];

// Assign IDs to new recipes
let maxId = enrichedExisting.reduce((max, r) => Math.max(max, r.id), 0);
const enrichedNew = newRecipes.map(r => {
    maxId++;
    return {
        ...r,
        id: maxId,
        created_at: new Date().toISOString()
    };
});

const finalData = [...enrichedExisting, ...enrichedNew];

fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
console.log(`✅ Generated ${finalData.length} recipes (Original: ${existingRecipes.length}, New: ${newRecipes.length})`);
