const fs = require('fs');
const path = require('path');

const recipes = JSON.parse(fs.readFileSync('backend/recipes_dump.json', 'utf8'));

const mapping = {
    201: "shakshuka_201.png",
    202: "miso_salmon_202.png",
    203: "palak_paneer_203.png",
    204: "thai_green_curry_204.png",
    205: "greek_lamb_chops_205.png",
    206: "burrito_bowl_206.png",
    207: "chickpea_tagine_207.png",
    208: "garlic_shrimp.png",
    209: "generic_fallback_meal.png",
    210: "zucchini_bolognese.png",
    221: "oatmeal_berries.png",
    222: "shakshuka.png",
    223: "quinoa_salad.png",
    224: "spaghetti_bolognese.png",
    225: "chicken_curry.png",
    226: "salmon_salad.png",
    227: "cauliflower_rice_stir_fry.png",
    228: "chicken_wrap.png",
    229: "generic_fallback_meal.png",
    230: "beef_tacos.jpg",
    241: "miso_glazed_cod.png",
    242: "berry_smoothie_bowl.png",
    243: "vegetarian_chili.png",
    244: "chicken_wrap.png",
    245: "caprese_salad.png",
    246: "tofu_scramble.png",
    247: "grilled_chicken_caesar.png",
    248: "pesto_pasta.png",
    249: "cauliflower_rice_stir_fry.png",
    250: "beef_stir_fry.png",
    251: "almond_flour_pancakes.png",
    252: "tuna_salad.png",
    253: "beef_stir_fry.png",
    254: "avocado_toast_egg.png",
    255: "bacon_and_eggs.png",
    256: "miso_glazed_cod.png",
    257: "zucchini_bolognese.png",
    258: "mushroom_frittata.png",
    259: "oatmeal_berries.png",
    260: "beef_stir_fry.png"
};

recipes.forEach(r => {
    if (mapping[r.id]) {
        r.image = "/images/" + mapping[r.id];
    }
});

fs.writeFileSync('backend/recipes_dump.json', JSON.stringify(recipes, null, 2));
console.log("✅ Updated 40 recipe image paths for variety mapping.");
