const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../recipes_dump.json');
const outputPath = path.join(__dirname, '../recipes_v3_ready.json');

const existingRecipes = require(inputPath);

const newRecipes = [
    {
        name: "Seared Pork Chops with Apples",
        type: "Dinner",
        calories: 550,
        tags: ["Pork", "Meat", "Gluten-Free", "Paleo"],
        ingredients: [
            { name: "Pork Chops", quantity: "2" },
            { name: "Apple", quantity: "1 sliced" },
            { name: "Thyme", quantity: "1 sprig" },
            { name: "Butter", quantity: "1 tbsp" }
        ],
        instructions: [
            "Season chops with salt/pepper.",
            "Sear in hot pan 4 mins/side.",
            "Add apples and butter; cook until apples are soft.",
            "Serve chops topped with apples."
        ],
        image: "/images/pork_chops_with_apples.png",
        is_premium: false,
        macros: {
            calories: 550,
            protein: "35g",
            carbs: "15g",
            fats: "25g"
        }
    },
    {
        name: "Turkey Chili Bowl",
        type: "Lunch",
        calories: 450,
        tags: ["Turkey", "Meat", "Gluten-Free"],
        ingredients: [
            { name: "Ground Turkey", quantity: "6 oz" },
            { name: "Kidney Beans", quantity: "1 cup" },
            { name: "Tomato Sauce", quantity: "1/2 cup" },
            { name: "Chili Powder", quantity: "1 tbsp" },
            { name: "Cheddar Cheese", quantity: "2 tbsp" }
        ],
        instructions: [
            "Brown turkey in pot.",
            "Add beans, sauce, and spices.",
            "Simmer for 20 mins.",
            "Serve topped with cheese."
        ],
        image: "/images/turkey_chili_bowl.png",
        is_premium: false,
        macros: {
            calories: 450,
            protein: "35g",
            carbs: "30g",
            fats: "12g"
        }
    }
];

// Calculate new IDs
let maxId = existingRecipes.reduce((max, r) => Math.max(max, r.id || 0), 0);

const enrichedNew = newRecipes.map(r => {
    maxId++;
    return {
        id: maxId,
        created_at: new Date().toISOString(),
        ...r
    };
});

const finalData = [...existingRecipes, ...enrichedNew];

fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));

console.log(`✅ Generated V3 Data.`);
console.log(`Original Count: ${existingRecipes.length}`);
console.log(`New Added: ${enrichedNew.length}`);
console.log(`Total Count: ${finalData.length}`);
console.log(`Output saved to: ${outputPath}`);
