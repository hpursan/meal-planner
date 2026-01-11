const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fallback to local JSON if DB fails
const localRecipes = require('../recipes_dump.json');

async function getRecipes() {
    try {
        const { data, error } = await supabase
            .from('recipes')
            .select('*');

        if (error) {
            console.error('Error fetching recipes from Supabase:', error);
            throw error;
        }

        if (data && data.length > 0) {
            console.log(`Fetched ${data.length} recipes from Supabase.`);
            return data;
        }

        console.warn('Supabase returned no recipes. Using local fallback.');
        return localRecipes;
    } catch (err) {
        console.error('DB Connection Failed. Fallback to local JSON.', err);
        return localRecipes;
    }
}

async function getUserRecipes(userId) {
    if (!userId) return [];
    try {
        const { data, error } = await supabase
            .from('user_recipes')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching user recipes:', err);
        return [];
    }
}

async function saveUserRecipe(userId, recipeData, token) {
    try {
        const payload = {
            user_id: userId,
            name: recipeData.name,
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
            type: recipeData.type,
            calories: recipeData.calories,
            macros: recipeData.macros,
            image: recipeData.image || "generic_fallback_meal.png",
            original_url: recipeData.original_url
        };

        // Create a scoped client for this request to respect RLS
        // If no token is provided, it falls back to the default (Anon) client, which might fail RLS
        let client = supabase;
        if (token) {
            client = createClient(SUPABASE_URL, SUPABASE_KEY, {
                global: {
                    headers: { Authorization: `Bearer ${token}` }
                }
            });
        }

        const { data, error } = await client
            .from('user_recipes')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error saving user recipe:', err.message, err.details, err.hint);
        if (err.message && err.message.includes('row-level security')) {
            throw new Error('Permission denied: Unable to save to your account. Please contact support.');
        }
        throw err;
    }
}

module.exports = {
    getRecipes,
    getUserRecipes,
    saveUserRecipe
};
