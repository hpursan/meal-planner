import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlanProvider } from '../context/PlanContext';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { View, ActivityIndicator } from 'react-native';

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
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            if (event === 'PASSWORD_RECOVERY') {
                router.push('/reset-password');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!initialized) return;

        const inAuthGroup = segments[0] === 'login' || segments[0] === 'reset-password';

        if (session && inAuthGroup) {
            // If logged in and trying to access auth pages, go to home
            router.replace('/');
        } else if (!session && !inAuthGroup) {
            // If not logged in and not in auth pages, go to login
            router.replace('/login');
        }
    }, [session, initialized, segments]);

    if (!initialized) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <ActivityIndicator size="large" color="#BB86FC" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="history" />
                <Stack.Screen name="results" />
                <Stack.Screen name="reset-password" />
            </Stack>
        </SafeAreaProvider>
    );
}

export default function Layout() {
    return (
        <PlanProvider>
            <RootLayoutNav />
        </PlanProvider>
    );
}
