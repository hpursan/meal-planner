import { View, StyleSheet, StatusBar, TouchableOpacity, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import InputForm from '../components/InputForm';
import { usePlan } from '../context/PlanContext';
import { generatePlan } from '../services/api';
import { supabase } from '../services/supabase';
import { useEffect } from 'react';

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#121212', '#1E1E2E']} style={styles.background} />

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.push('/history')} style={{ marginRight: 20 }}>
                    <Text style={styles.historyText}>My Plans</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <InputForm
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
        backgroundColor: '#121212',
    },
    background: {
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
    },
    topBar: {
        paddingHorizontal: 20,
        paddingTop: 50, // More padding for Safe Area
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        zIndex: 10,
    },
    historyText: {
        color: '#BB86FC',
        fontWeight: 'bold',
        fontSize: 14,
    },
    logoutText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
