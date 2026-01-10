const axios = require('axios');
const cheerio = require('cheerio');

async function fetchUrlContent(url) {
    try {
        console.log(`Fetching: ${url}`);
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000
        });
        const $ = cheerio.load(data);

        // CHECK JSON-LD FIRST
        const jsonLd = $('script[type="application/ld+json"]').html();
        if (jsonLd) {
            console.log("✅ JSON-LD Found! (This is perfect for AI)");
            try {
                const parsed = JSON.parse(jsonLd);
                const recipe = Array.isArray(parsed) ? parsed.find(i => i['@type'] === 'Recipe') : parsed;
                const result = recipe || parsed;
                return JSON.stringify(result, null, 2);
            } catch (e) {
                console.log("JSON Parse Error, falling back to text regex");
            }
            return jsonLd;
        }

        // Remove noise 
        $('script').remove();
        $('style').remove();
        $('nav').remove();
        $('footer').remove();

        // Fallback to body text
        const text = $('body').text().replace(/\s+/g, ' ').substring(0, 15000);
        return text;
    } catch (e) {
        console.error(`Error: ${e.message}`);
        return null;
    }
}

fetchUrlContent('https://www.allrecipes.com/recipe/46822/indian-chicken-curry-ii/').then(text => {
    console.log("\n--- EXTRACTED CONTENT SENT TO AI ---\n");
    console.log(text ? text.substring(0, 2000) : "No text found");
});
