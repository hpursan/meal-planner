require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateMealPlan, getSwapMeal } = require('./planner');
const { parseRecipeFromText } = require('./services/aiParser');
const { saveUserRecipe, getUserRecipes } = require('./services/recipeService');
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit'); // Middleware to rate limit requests
const { MAX_PLAN_DAYS, GENERATION_WINDOW_MS, GENERATION_MAX_REQUESTS } = require('./config/limits');

const app = express();
app.set('trust proxy', 1); // Trust Render's load balancer
const PORT = process.env.PORT || 3000;

// Initialize Supabase Client for Auth Verification
const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = createClient(supabaseUrl, supabaseKey);

const path = require('path');

app.use(cors());
app.use(bodyParser.json());

// Rate Limiter for Generation Endpoint
const generationLimiter = rateLimit({
    windowMs: GENERATION_WINDOW_MS,
    max: GENERATION_MAX_REQUESTS,
    message: { error: "Too many plan generation requests, please try again later." }
});

app.get('/', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'Meal Planner API' });
});

// Serve static files (images, privacy policy, etc.) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Helper to determine base URL
const getBaseUrl = (req) => {
    return `${req.protocol}://${req.get('host')}`;
};

// ... (removed formatImage) ...

// Middleware: Verify Supabase JWT
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: "Invalid token format" });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error("Auth Error:", error);
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Attach user to request object for downstream use
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Exception:", err);
        return res.status(500).json({ error: "Internal Server Error during auth" });
    }
};

// Helper to get user recipes if token provided
const fetchUserRecipesIfAuth = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return [];

    const token = authHeader.split(' ')[1];
    if (!token) return [];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) return [];

        console.log(`Fetching private recipes for user: ${user.id}`);
        return await getUserRecipes(user.id);
    } catch (err) {
        console.warn("Optional Auth Check Failed:", err.message);
        return [];
    }
};

// Public: Generate Plan endpoint (Optional Auth for Custom Recipes)
app.post('/api/plan', generationLimiter, async (req, res) => {
    const { preferences, days, meatFreeDays, goal, excludedIds } = req.body;

    if (!days || isNaN(days)) {
        return res.status(400).json({ error: "Invalid days parameter" });
    }

    if (parseInt(days) > MAX_PLAN_DAYS) {
        return res.status(400).json({ error: `Plans are limited to ${MAX_PLAN_DAYS} days maximum.` });
    }

    try {
        console.time('Backend:generatePlan');
        // Try to get user recipes if they are logged in
        const userRecipes = await fetchUserRecipesIfAuth(req);

        let plan = await generateMealPlan(preferences || [], parseInt(days), meatFreeDays || [], userRecipes, goal, excludedIds || []);
        console.timeEnd('Backend:generatePlan');
        res.json({ plan });
    } catch (error) {
        console.error("Plan Generation Error:", error);
        res.status(500).json({ error: "Failed to generate plan." });
    }
});

// Public: Swap Meal endpoint (Optional Auth)
app.post('/api/swap', async (req, res) => {
    const { currentId, type, preferences, excludedIds } = req.body;

    try {
        const userRecipes = await fetchUserRecipesIfAuth(req);
        const newMeal = await getSwapMeal(currentId, type, preferences, userRecipes, excludedIds || []);

        if (!newMeal) {
            return res.status(404).json({ error: "No alternative found" });
        }

        res.json({ meal: newMeal });
    } catch (error) {
        console.error("Swap Error:", error);
        res.status(500).json({ error: 'Failed to swap meal.' });
    }
});

// Public: Get all recipe metadata (for exclusion management)
app.get('/api/recipes/metadata', async (req, res) => {
    try {
        const { getRecipes } = require('./services/recipeService');
        const recipes = await getRecipes();
        const metadata = recipes.map((r) => ({ id: r.id, name: r.name }));
        res.json({ recipes: metadata });
    } catch (error) {
        console.error('Metadata Error:', error);
        res.status(500).json({ error: 'Failed to fetch metadata.' });
    }
});

// Public: Import Recipe (AI)
app.post('/api/import', generationLimiter, async (req, res) => {
    const { text } = req.body;

    if (!text || text.length < 10) {
        return res.status(400).json({ error: "Please provide recipe text or URL." });
    }

    try {
        const recipeData = await parseRecipeFromText(text);

        const previewMeal = {
            id: 'temp_' + Date.now(),
            ...recipeData,
            image: '/images/generic_fallback_meal.png',
            is_premium: false
        };

        res.json({ meal: previewMeal });
    } catch (error) {
        console.error("Import Error:", error.message);
        res.status(500).json({ error: error.message || "Failed to import recipe." });
    }
});

// Authenticated: Save Imported Recipe
app.post('/api/recipes/save', requireAuth, async (req, res) => {
    const { recipe } = req.body;
    const userId = req.user.id;

    if (!recipe || !recipe.name) {
        return res.status(400).json({ error: "Invalid recipe data." });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const savedRecipe = await saveUserRecipe(userId, recipe, token);
        res.json({ recipe: savedRecipe });
    } catch (error) {
        console.error("Save Recipe Error:", error);
        res.status(500).json({ error: error.message || "Failed to save recipe." });
    }
});

// Authenticated: Get My Recipes
app.get('/api/recipes/mine', requireAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const token = req.headers.authorization.split(' ')[1];
        const recipes = await getUserRecipes(userId, token);
        res.json({ recipes });
    } catch (error) {
        console.error("Get Recipes Error:", error);
        res.status(500).json({ error: "Failed to fetch recipes." });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
