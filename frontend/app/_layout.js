import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlanProvider } from '../context/PlanContext';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import * as SplashScreen from 'expo-splash-screen';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Keep the splash screen visible while we fetch resources
try {
    SplashScreen.preventAutoHideAsync();
} catch (e) {
    console.warn('SplashScreen.preventAutoHideAsync error:', e);
}

function RootLayoutNav() {
    const [_session, setSession] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setInitialized(true);

            // NOTE: We REMOVED automatic redirect logic here.
            // This prevents "Redirect Loop" when app resumes from background (e.g. Closing Safari).
            // User must manually log in if session is lost.
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            // We only log events now, no forced redirects.
            console.log('Auth Event:', event);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (initialized) {
            // Hide splash screen after a short delay to ensure smooth transition
            setTimeout(async () => {
                await SplashScreen.hideAsync();
            }, 1000);
        }
    }, [initialized]);

    if (!initialized) {
        return null; // Return null because Splash Screen is still visible natively
    }

    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="history" />
                <Stack.Screen name="results" />
                <Stack.Screen name="reset-password" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="support" />
            </Stack>
        </SafeAreaProvider>
    );
}

export default function Layout() {
    return (
        <ErrorBoundary>
            <PlanProvider>
                <RootLayoutNav />
            </PlanProvider>
        </ErrorBoundary>
    );
}
