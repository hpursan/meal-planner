import { View, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import PlanHistoryView from '../components/PlanHistoryView';
import { usePlan } from '../context/PlanContext';
import { supabase } from '../services/supabase';
import { useState, useEffect } from 'react';

export default function HistoryScreen() {
    const router = useRouter();
    const { setPlan, setPlanId, setPlanName, setDays, setSelectedPrefs, setMeatFreeDays, setCheckedItems } = usePlan();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setUserId(session.user.id);
            setLoading(false);
        });

        // Listen for changes (e.g. login happening just as we mount)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUserId(session.user.id);
            } else {
                setUserId(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLoadPlan = (historyItem) => {
        setPlan(historyItem.plan_data);
        setPlanId(historyItem.id);
        setPlanName(historyItem.name);
        setCheckedItems(historyItem.checked_items || {});
        // Note: Saved plan doesn't currently store days/prefs/meatFreeDays separately,
        // so we can't fully restore "input state", but we restore the "Result".
        router.push('/results');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#121212', '#1E1E2E']} style={styles.background} />
            <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>

                {loading ? (
                    <Text style={{ color: 'white' }}>Loading...</Text>
                ) : userId ? (
                    <PlanHistoryView
                        userId={userId}
                        onLoadPlan={handleLoadPlan}
                        onBack={() => router.back()}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', marginBottom: 20 }}>Please sign in to view your plans.</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/login')}
                            style={{ backgroundColor: '#FF6B6B', padding: 12, borderRadius: 8 }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                            <Text style={{ color: '#888' }}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    background: {
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
    },
});
