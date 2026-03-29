import * as Sentry from '@sentry/react-native';
import * as Notifications from 'expo-notifications';

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlanProvider } from '../context/PlanContext';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import * as SplashScreen from 'expo-splash-screen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PurchasesService } from '../services/purchases';

Sentry.init({
    dsn: 'https://8b2f089a6caedcbeefb0e2613ab6048f@o4510637378371584.ingest.us.sentry.io/4510637392723968',
    debug: false,
});

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

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
        async function initializeApp() {
            try {
                // Initialize Auth and RevenueCat in parallel for faster startup
                const [sessionResult, _] = await Promise.all([
                    supabase.auth.getSession(),
                    PurchasesService.init(),
                ]);

                if (sessionResult.data.session) {
                    setSession(sessionResult.data.session);
                }
            } catch (error) {
                console.error('Initialization error:', error);
                Sentry.captureException(error);
            } finally {
                setInitialized(true);
            }
        }

        initializeApp();

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            console.log('Auth Event:', event);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        async function configureNotifications() {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                if (newStatus !== 'granted') return;
            }

            // Cancel all previous to avoid duplicates
            await Notifications.cancelAllScheduledNotificationsAsync();

            // Schedule for Sunday at 6 PM
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Time to Plan! 📅",
                    body: "Spend 5 minutes now to save hours this week.",
                },
                trigger: {
                    type: 'calendar',
                    weekday: 1, // Sunday
                    hour: 18,
                    minute: 0,
                    repeats: true,
                },
            });
        }

        configureNotifications();
    }, []);

    useEffect(() => {
        if (initialized) {
            // Hide splash screen immediately once services are ready
            SplashScreen.hideAsync().catch((e) => {
                console.warn('Failed to hide splash screen:', e);
            });
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
                <Stack.Screen name="my-recipes" />
            </Stack>
        </SafeAreaProvider>
    );
}

function Layout() {
    return (
        <ErrorBoundary>
            <PlanProvider>
                <RootLayoutNav />
            </PlanProvider>
        </ErrorBoundary>
    );
}

export default Sentry.wrap(Layout);
