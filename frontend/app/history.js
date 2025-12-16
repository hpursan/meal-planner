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

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setUserId(session.user.id);
        });
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


                {userId ? (
                    <PlanHistoryView
                        userId={userId}
                        onLoadPlan={handleLoadPlan}
                        onBack={() => router.back()}
                    />
                ) : (
                    <Text style={{ color: 'white' }}>Loading...</Text>
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
