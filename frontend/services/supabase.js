import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual Supabase project details from .env
// Replace with your actual Supabase project details from .env
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('CRITICAL: Missing Supabase Environment Variables! Check .env file.');
}

// Fallback to Production Keys to prevent crash/timeout if Env Vars are missing in Build
export const supabase = createClient(
    (SUPABASE_URL || 'https://pjdwvtoesjmmrycmsnhl.supabase.co').trim(),
    (SUPABASE_ANON_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZHd2dG9lc2ptbXJ5Y21zbmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTA5NzYsImV4cCI6MjA4MDk2Njk3Nn0.DL8rKquK6_XXH0ar5RWH7T55H6hZlXdibZp4lsuXIbI').trim(),
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false, // Handle deep links manually to prevent session overrides
        },
    }
);
