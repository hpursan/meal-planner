const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateMealPlan, getSwapMeal } = require('./planner');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase Client for Auth Verification
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const path = require('path');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'Meal Planner API' });
});

// Serve static images from the "public" directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Helper to determine base URL
const getBaseUrl = (req) => {
    return `${req.protocol}://${req.get('host')}`;
};

// Helper: Prepend base URL to image path if it's local
const formatImage = (imagePath, baseUrl) => {
    if (!imagePath) return imagePath;
    if (imagePath.startsWith('http')) return imagePath;
    return `${baseUrl}${imagePath}`;
};

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

// Protect the Generate Plan endpoint
app.post('/api/plan', requireAuth, (req, res) => {
    const { preferences, days, meatFreeDays } = req.body;

    if (!days || isNaN(days)) {
        return res.status(400).json({ error: "Invalid days parameter" });
    }

    let plan = generateMealPlan(preferences || [], parseInt(days), meatFreeDays || []);

    // Transform image paths in the plan
    const baseUrl = getBaseUrl(req);
    plan = plan.map(day => ({
        ...day,
        meals: {
            breakfast: { ...day.meals.breakfast, image: formatImage(day.meals.breakfast.image, baseUrl) },
            lunch: { ...day.meals.lunch, image: formatImage(day.meals.lunch.image, baseUrl) },
            dinner: { ...day.meals.dinner, image: formatImage(day.meals.dinner.image, baseUrl) }
        }
    }));

    res.json({ plan });
});

// Protect the Swap Meal endpoint
app.post('/api/swap', requireAuth, (req, res) => {
    const { currentId, type, preferences } = req.body;
    const newMeal = getSwapMeal(currentId, type, preferences);

    if (!newMeal) {
        return res.status(404).json({ error: "No alternative found" });
    }

    // Transform image path
    const baseUrl = getBaseUrl(req);
    const mealWithUrl = {
        ...newMeal,
        image: formatImage(newMeal.image, baseUrl)
    };

    res.json({ meal: mealWithUrl });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
