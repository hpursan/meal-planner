import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace with your actual Supabase project details
const SUPABASE_URL = 'https://pjdwvtoesjmmrycmsnhl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZHd2dG9lc2ptbXJ5Y21zbmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTA5NzYsImV4cCI6MjA4MDk2Njk3Nn0.DL8rKquK6_XXH0ar5RWH7T55H6hZlXdibZp4lsuXIbI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
