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
            const errorText = await response.text();
            throw new Error(`Import Failed: ${errorText}`);
        }

        const data = await response.json();
        return data.meal;
    } catch (error) {
        console.error('API Error (importRecipe):', error);
        Sentry.captureException(error);
        throw error;
    }
};
