const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing Supabase Environment Variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function dump() {
    console.log('📥 Fetching recipes from Supabase...');
    const { data, error } = await supabase
        .from('recipes')
        .select('*');

    if (error) {
        console.error('❌ Error fetching recipes:', error);
        process.exit(1);
    }

    const outputPath = path.join(__dirname, '../recipes_dump.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2)); // Pretty print
    console.log(`✅ Dumped ${data.length} recipes to ${outputPath}`);
}

dump();
