import { View, StyleSheet, StatusBar, TouchableOpacity, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import InputForm from '../components/InputForm';
import { usePlan } from '../context/PlanContext';
import { generatePlan } from '../services/api';
import { supabase } from '../services/supabase';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import PaywallModal from '../components/PaywallModal';

export default function HomeScreen() {
    const router = useRouter();
    const {
        days,
        setDays,
        planName,
        setPlanName,
        selectedPrefs,
        setSelectedPrefs,
        meatFreeDays,
        setMeatFreeDays,
        setPlan,
        setPlanId,
        setLoading,
        loading,
        loadFromCache,
        plan,
        setIsOfflineMode,
        isOnline,
        isPro,
    } = usePlan();

    const [paywallVisible, setPaywallVisible] = useState(false);

    useEffect(() => {
        if (plan.length === 0) {
            loadFromCache();
        }
    }, [plan.length, loadFromCache]);

    const togglePref = (pref) => {
        if (selectedPrefs.includes(pref)) {
            setSelectedPrefs(selectedPrefs.filter((p) => p !== pref));
        } else {
            setSelectedPrefs([...selectedPrefs, pref]);
        }
    };

    const toggleMeatFreeDay = (day) => {
        if (meatFreeDays.includes(day)) {
            setMeatFreeDays(meatFreeDays.filter((d) => d !== day));
        } else {
            setMeatFreeDays([...meatFreeDays, day]);
        }
    };

    const handleGeneratePlan = async () => {
        if (!days || isNaN(days) || parseInt(days) <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number of days.');
            return;
        }

        const numDays = parseInt(days);
        const MAX_FREE_DAYS = 3;

        // Paywall Gate for Free Users
        if (!isPro && numDays > MAX_FREE_DAYS) {
            setPaywallVisible(true);
            return;
        }

        if (numDays > 30) { // Can increase to 30 for Pro
            Alert.alert('Limit Reached', 'Plans are currently limited to a maximum of 30 days.');
            return;
        }

        setLoading(true);
        try {
            const data = await generatePlan(parseInt(days), selectedPrefs, meatFreeDays);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Get session to save (optional logic, could verify first)
            const {
                data: { session },
            } = await supabase.auth.getSession();
            let newPlanId = null;

            if (session && session.user) {
                const { data: savedData, error } = await supabase
                    .from('saved_plans')
                    .insert([
                        {
                            user_id: session.user.id,
                            plan_data: data.plan,
                            name: planName || `Plan ${new Date().toLocaleDateString()} `,
                        },
                    ])
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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', error.message || 'Failed to generate plan.');
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
            <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.background} />

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.push('/history')} style={{ marginRight: 20 }}>
                    <Text style={styles.historyText}>MY PLANS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/settings')}>
                    <Text style={styles.logoutText}>SETTINGS</Text>
                </TouchableOpacity>
            </View>

            {plan.length > 0 && (
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push('/results')}
                    >
                        <LinearGradient
                            colors={['#BB86FC', '#7F5AF0']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.resumeCard}
                        >
                            <Text style={styles.resumeTitle}>RESUME ACTIVE PLANNING</Text>
                            <Text style={styles.resumeDesc}>{planName || 'Continue where you left off'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}

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


            <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} />
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
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
        color: '#E0E0E0',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 1.5,
    },
    logoutText: {
        color: '#E0E0E0',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 1.5,
    },
    resumeCard: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#7F5AF0",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    resumeTitle: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 16,
        marginBottom: 6,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    resumeDesc: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '500',
    },
});
