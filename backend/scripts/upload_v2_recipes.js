const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
// Use Service Role Key for Admin writes if available, otherwise Anon key (might fail if RLS is on)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing Supabase Environment Variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const recipes = require('../recipes_dump.json');

async function upload() {
    console.log(`🚀 Starting upload of ${recipes.length} recipes to Supabase...`);

    // We use upsert. 
    // - Existing IDs will be updated (enriched with macros).
    // - New IDs will be inserted.

    // NOTE: Ensure your 'recipes' table in Supabase has a 'macros' column of type JSONB.
    // If not, this might fail or ignore the column depending on settings.

    const { data, error } = await supabase
        .from('recipes')
        .upsert(recipes, { onConflict: 'id' });

    if (error) {
        console.error('❌ Upload Failed:', error);
    } else {
        console.log('✅ Upload Successful! All recipes synced.');
    }
}

upload();
