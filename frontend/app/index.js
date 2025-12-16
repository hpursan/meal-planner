import { View, StyleSheet, StatusBar, TouchableOpacity, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import InputForm from '../components/InputForm';
import { usePlan } from '../context/PlanContext';
import { generatePlan } from '../services/api';
import { supabase } from '../services/supabase';
import { useEffect } from 'react';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

export default function HomeScreen() {
    const router = useRouter();
    const {
        days, setDays,
        planName, setPlanName,
        selectedPrefs, setSelectedPrefs,
        meatFreeDays, setMeatFreeDays,
        setPlan, setPlanId, setLoading, loading,
        loadFromCache, plan, setIsOfflineMode,
        isOnline
    } = usePlan();

    useEffect(() => {
        if (plan.length === 0) {
            loadFromCache();
        }
    }, [plan.length, loadFromCache]);

    const togglePref = (pref) => {
        if (selectedPrefs.includes(pref)) {
            setSelectedPrefs(selectedPrefs.filter(p => p !== pref));
        } else {
            setSelectedPrefs([...selectedPrefs, pref]);
        }
    };

    const toggleMeatFreeDay = (day) => {
        if (meatFreeDays.includes(day)) {
            setMeatFreeDays(meatFreeDays.filter(d => d !== day));
        } else {
            setMeatFreeDays([...meatFreeDays, day]);
        }
    };

    const handleGeneratePlan = async () => {
        if (!days || isNaN(days) || parseInt(days) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid number of days.");
            return;
        }

        setLoading(true);
        try {
            const data = await generatePlan(parseInt(days), selectedPrefs, meatFreeDays);

            // Get session to save (optional logic, could verify first)
            const { data: { session } } = await supabase.auth.getSession();
            let newPlanId = null;

            if (session && session.user) {
                const { data: savedData, error } = await supabase
                    .from('saved_plans')
                    .insert([{
                        user_id: session.user.id,
                        plan_data: data.plan,
                        name: planName || `Plan ${new Date().toLocaleDateString()} `
                    }])
                    .select()
                    .single();

                if (savedData) {
                    newPlanId = savedData.id;
                    setPlanId(savedData.id); // <--- THIS WAS MISSING
                }
            }

            setPlan(data.plan);
            setIsOfflineMode(false); // We just fetched fresh data successfully
            // setPlanId is missing from my Context definition! I need to add it to PlanContext later.
            // For now, I'll assume we might not need it immediately or fix context.
            // Actually, context needs planId state.

            router.push('/results');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to generate plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={[Colors.background.primary, Colors.background.secondary]} style={styles.background} />

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.push('/history')} style={{ marginRight: Spacing.xl }}>
                    <Text style={styles.historyText}>My Plans</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/settings')}>
                    <Text style={styles.settingsText}>Settings</Text>
                </TouchableOpacity>
            </View>

            <InputForm
                // ... props
                days={days}
                setDays={setDays}
                planName={planName}
                setPlanName={setPlanName}
                selectedPrefs={selectedPrefs}
                togglePref={togglePref}
                meatFreeDays={meatFreeDays}
                toggleMeatFreeDay={toggleMeatFreeDay}
                onGenerate={handleGeneratePlan}
                loading={loading}
                isOnline={isOnline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    background: {
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
    },
    topBar: {
        paddingHorizontal: Spacing.layout.screenPadding,
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        zIndex: 10,
    },
    historyText: {
        color: Colors.action.primary,
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.sm,
    },
    settingsText: {
        color: Colors.text.secondary,
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.sm,
    },
});
