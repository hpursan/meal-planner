const OpenAI = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a culinary data extractor. 
I will give you messy text (a recipe blog, a paste from Instagram, or scraped HTML content).
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
If data is missing, estimate it intelligently based on the ingredients found.
If the input contains NO recipe information (e.g. it's just a login page or random text), return:
{ "error": "Could not identify a recipe in the provided content." }
Return ONLY valid JSON.
`;

// Helper: Fetch text from URL
async function fetchUrlContent(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000 // 5s timeout
        });
        const $ = cheerio.load(data);

        // Remove noise
        $('script').remove();
        $('style').remove();
        $('nav').remove();
        $('footer').remove();

        // Get structured data if available (JSON-LD)
        const jsonLd = $('script[type="application/ld+json"]').html();
        if (jsonLd) {
            return "JSON-LD Found: " + jsonLd;
        }

        // Fallback to body text
        return $('body').text().replace(/\s+/g, ' ').substring(0, 15000); // Limit to 15k chars to save tokens
    } catch (e) {
        throw new Error(`Failed to fetch URL: ${e.message}`);
    }
}

async function parseRecipeFromText(text) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Configuration Error: API Key missing.");
    }

    let inputContent = text;

    // Detect URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundUrl = text.match(urlRegex);

    if (foundUrl) {
        try {
            console.log(`fetching URL: ${foundUrl[0]}`);
            const scrapedText = await fetchUrlContent(foundUrl[0]);
            inputContent = `URL Context: ${text}\nScraped Content: ${scrapedText}`;
        } catch (err) {
            console.warn("URL Fetch Warning:", err.message);
            // Continue with original text if fetch fails
        }
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: inputContent }
            ],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        const parsed = JSON.parse(content);

        // Handle logical errors returned by AI
        if (parsed.error) {
            throw new Error(parsed.error);
        }

        return parsed;
    } catch (e) {
        console.error("AI Parse Error:", e);
        // Clean up error message for user
        if (e.message.includes("tokens")) throw new Error("Recipe content was too long.");
        throw new Error(e.message || "Failed to identify a recipe.");
    }
}

module.exports = { parseRecipeFromText };
