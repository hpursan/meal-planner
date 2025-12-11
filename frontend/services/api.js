// Host handling for Android Emulator vs iOS Simulator vs Web vs Physical Device
// Using specific LAN IP to allow physical device testing via Expo Go
const API_HOST = 'https://meal-planner-dtkf.onrender.com';

export const generatePlan = async (days, preferences, meatFreeDays) => {
    try {
        const response = await fetch(`${API_HOST}/api/plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                preferences,
                days,
                meatFreeDays
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Error (generatePlan):", error);
        throw error;
    }
};

export const swapMeal = async (currentId, type, preferences) => {
    try {
        const response = await fetch(`${API_HOST}/api/swap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentId,
                type,
                preferences
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Error (swapMeal):", error);
        throw error;
    }
};
