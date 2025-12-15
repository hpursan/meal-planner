import { supabase } from './supabase';

// Host handling for Android Emulator vs iOS Simulator vs Web vs Physical Device
// Using specific LAN IP to allow physical device testing via Expo Go
const API_HOST = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
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
                meatFreeDays
            }),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized: Please sign in.");
            throw new Error(`API Request Failed: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Error (generatePlan):", error);
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
                preferences
            }),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized: Please sign in.");
            throw new Error(`API Request Failed: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Error (swapMeal):", error);
        throw error;
    }
};
