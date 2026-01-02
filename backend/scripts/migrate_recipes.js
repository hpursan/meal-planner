const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing Supabase Environment Variables (SUPABASE_URL, SUPABASE_KEY)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const recipes = require('./data');

async function migrate() {
    console.log(`🚀 Starting migration of ${recipes.length} recipes...`);

    // Prepare data for insertion (removing ID to let DB generate it, or keeping it if we want to preserve legacy IDs)
    // We will KEEP legacy IDs to avoid breaking existing clients that might have cached them, 
    // IF the table allows identity insert.
    // However, usually it's safer to let DB auto-increment.
    // But since we are moving from static JSON file where ID=1 meant "Vegan Buddha Bowl", 
    // we should try to preserve ID if possible for consistency.

    const { data, error } = await supabase
        .from('recipes')
        .upsert(recipes, { onConflict: 'id', ignoreDuplicates: true });

    if (error) {
        console.error('❌ Migration Failed:', error);
    } else {
        console.log('✅ Migration Successful! Recipes inserted/updated.');
    }
}

migrate();
