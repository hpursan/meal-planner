import { supabase } from './supabase';
import * as Sentry from '@sentry/react-native';

// Host handling for Android Emulator vs iOS Simulator vs Web vs Physical Device
// Fallback to Production URL to ensure TestFlight builds work even if Env Vars fail
const API_HOST = process.env.EXPO_PUBLIC_API_URL || 'https://meal-planner-dtkf.onrender.com';

const getAuthHeaders = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    const headers = { 'Content-Type': 'application/json' };

    if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
};

export const generatePlan = async (days, preferences, meatFreeDays) => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_HOST}/api/plan`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                preferences,
                days,
                meatFreeDays,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Try to get backend error message
            if (response.status === 401) throw new Error('Unauthorized: Please sign in.');
            throw new Error(`API Request Failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error (generatePlan):', error);
        Sentry.captureException(error, {
            tags: { endpoint: 'generatePlan' },
            extra: { days, preferences },
        });
        throw error;
    }
};

export const swapMeal = async (currentId, type, preferences) => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_HOST}/api/swap`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                currentId,
                type,
                preferences,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (response.status === 401) throw new Error('Unauthorized: Please sign in.');
            throw new Error(`API Request Failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error (swapMeal):', error);
        Sentry.captureException(error, {
            tags: { endpoint: 'swapMeal' },
        });
        throw error;
    }
};

export const importRecipe = async (text) => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_HOST}/api/import`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            let errorText = await response.text();
            try {
                // Try to parse JSON error message from backend
                const errorJson = JSON.parse(errorText);
                if (errorJson.error) {
                    errorText = errorJson.error;
                }
            } catch (e) {
                // Not JSON, use raw text
            }
            throw new Error(errorText);
        }

        const data = await response.json();
        return data.meal;
    } catch (error) {
        console.error('API Error (importRecipe):', error);
        Sentry.captureException(error);
        throw error;
    }
};

export const saveRecipe = async (recipe) => {
    try {
        const headers = await getAuthHeaders();

        if (!headers['Authorization']) {
            throw new Error("You must be logged in to save recipes.");
        }

        const response = await fetch(`${API_HOST}/api/recipes/save`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ recipe }),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to save recipe';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = await response.text();
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data.recipe;
    } catch (error) {
        console.error('API Error (saveRecipe):', error);
        Sentry.captureException(error);
        throw error;
    }
};

export const getMyRecipes = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_HOST}/api/recipes/mine`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`Fetch Failed: ${response.status}`);
        }

        const data = await response.json();
        return data.recipes;
    } catch (error) {
        console.error('API Error (getMyRecipes):', error);
        Sentry.captureException(error);
        throw error;
    }
};
