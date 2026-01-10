const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Render
});

const SYSTEM_PROMPT = `
You are a culinary data extractor. 
I will give you messy text (a recipe blog, a paste from Instagram, etc).
You must extract it into this JSON structure:
{
    "name": "Recipe Name",
    "type": "Dinner" | "Lunch" | "Breakfast" | "Snack",
    "calories": 500 (integer estimate),
    "tags": ["Tag1", "Tag2"],
    "ingredients": [
        { "name": "Ingredient", "quantity": "1 cup" }
    ],
    "instructions": [
        "Step 1", "Step 2"
    ],
    "macros": {
        "protein": "20g",
        "carbs": "30g",
        "fats": "10g"
    }
}
If data is missing, estimate it intelligently.
Return ONLY valid JSON.
`;

async function parseRecipeFromText(text) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured.");
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: text }
            ],
            model: "gpt-3.5-turbo", // Cost efficient
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        return JSON.parse(content);
    } catch (e) {
        console.error("AI Parse Error:", e);
        throw new Error("Failed to parse recipe.");
    }
}

module.exports = { parseRecipeFromText };
