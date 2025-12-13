const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateMealPlan, getSwapMeal } = require('./planner');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static images from the "public" directory
app.use('/images', express.static('public/images'));

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

app.post('/api/plan', (req, res) => {
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

app.post('/api/swap', (req, res) => {
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
