const { generateMealPlan } = require('../planner');

describe('Meal Planner Logic', () => {
    test('generates plan for specified number of days', () => {
        const plan = generateMealPlan([], 3);
        expect(plan.length).toBe(3);
        expect(plan[0].day).toBe(1);
        expect(plan[2].day).toBe(3);
    });

    test('includes breakfast, lunch, dinner for each day', () => {
        const plan = generateMealPlan([], 1);
        const day = plan[0];
        expect(day.meals).toHaveProperty('breakfast');
        expect(day.meals).toHaveProperty('lunch');
        expect(day.meals).toHaveProperty('dinner');
    });

    test('filters by dietary preference (Vegan)', () => {
        const plan = generateMealPlan(['Vegan'], 5);
        plan.forEach(day => {
            // Check breakfast
            expect(day.meals.breakfast.tags).toContain('Vegan');
            // Check lunch
            expect(day.meals.lunch.tags).toContain('Vegan');
            // Check dinner
            expect(day.meals.dinner.tags).toContain('Vegan');
        });
    });

    test('returns fallback if no matching meal found', () => {
        // There are no Dinner items with "Vegan" AND "Keto" (Tofu Scramble is Breakfast)
        // Actually Tofu Scramble is Breakfast. 
        // Let's check my data:
        // Vegan items: 1 (Lunch), 4 (Breakfast), 7 (Breakfast), 9 (Dinner), 11 (Dinner), 15 (Lunch)
        // Keto items: 2 (Dinner), 4 (Breakfast), 5 (Lunch), 8 (Lunch), 10 (Breakfast)
        // Intersection Vegan + Keto: Tofu Scramble (Breakfast).
        // So Lunch and Dinner should fallback.

        const plan = generateMealPlan(['Vegan', 'Keto'], 1);
        const day = plan[0];

        expect(day.meals.breakfast.name).toBe("Tofu Scramble");
        expect(day.meals.lunch.name).toMatch(/Generic/);
        expect(day.meals.dinner.name).toMatch(/Generic/);
    });
});
