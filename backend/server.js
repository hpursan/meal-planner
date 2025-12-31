const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateMealPlan, getSwapMeal } = require('./planner');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit'); // Middleware to rate limit requests
const { MAX_PLAN_DAYS, GENERATION_WINDOW_MS, GENERATION_MAX_REQUESTS } = require('./config/limits');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase Client for Auth Verification
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
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

// Public: Generate Plan endpoint (No auth required for trial)
app.post('/api/plan', generationLimiter, (req, res) => {
    const { preferences, days, meatFreeDays } = req.body;

    if (!days || isNaN(days)) {
        return res.status(400).json({ error: "Invalid days parameter" });
    }

    // Safety Cap using Central Config
    if (parseInt(days) > MAX_PLAN_DAYS) {
        return res.status(400).json({ error: `Plans are limited to ${MAX_PLAN_DAYS} days maximum.` });
    }

    let plan = generateMealPlan(preferences || [], parseInt(days), meatFreeDays || []);

    // Return plan with relative image paths (Frontend handles base URL)
    res.json({ plan });
});

// Public: Swap Meal endpoint
app.post('/api/swap', (req, res) => {
    const { currentId, type, preferences } = req.body;
    const newMeal = getSwapMeal(currentId, type, preferences);

    if (!newMeal) {
        return res.status(404).json({ error: "No alternative found" });
    }

    // Return meal with relative image path
    res.json({ meal: newMeal });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
