import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlanProvider } from '../context/PlanContext';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
try {
    SplashScreen.preventAutoHideAsync();
} catch (e) {
    console.warn('SplashScreen.preventAutoHideAsync error:', e);
}

function RootLayoutNav() {
    const [session, setSession] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setInitialized(true);

            // Initial Navigation Decision
            const inAuthGroup = segments[0] === 'login' || segments[0] === 'reset-password';
            if (session && inAuthGroup) {
                router.replace('/');
            } else if (!session && !inAuthGroup) {
                router.replace('/login');
            }
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);

            if (event === 'SIGNED_IN') {
                router.replace('/');
            } else if (event === 'SIGNED_OUT') {
                router.replace('/login');
            } else if (event === 'PASSWORD_RECOVERY') {
                router.push('/reset-password');
            }
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

    // Removed the aggressive reactive useEffect that was monitoring [session, segments]
    // This prevents redirects when the app resumes or segments change temporarily.

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
            </Stack>
        </SafeAreaProvider>
    );
}

import { ErrorBoundary } from '../components/ErrorBoundary';

// ... (existing imports)

export default function Layout() {
    return (
        <ErrorBoundary>
            <PlanProvider>
                <RootLayoutNav />
            </PlanProvider>
        </ErrorBoundary>
    );
}
