const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateMealPlan, getSwapMeal } = require('./planner');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/plan', (req, res) => {
    const { preferences, days, meatFreeDays } = req.body;

    if (!days || isNaN(days)) {
        return res.status(400).json({ error: "Invalid days parameter" });
    }

    const plan = generateMealPlan(preferences || [], parseInt(days), meatFreeDays || []);
    res.json({ plan });
});

app.post('/api/swap', (req, res) => {
    const { currentId, type, preferences } = req.body;
    const newMeal = getSwapMeal(currentId, type, preferences);

    if (!newMeal) {
        return res.status(404).json({ error: "No alternative found" });
    }

    res.json({ meal: newMeal });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app; // For testing
