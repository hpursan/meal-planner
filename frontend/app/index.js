import { View, StyleSheet, StatusBar, TouchableOpacity, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import InputForm from '../components/InputForm';
import { Ionicons } from '@expo/vector-icons';
import { usePlan } from '../context/PlanContext';
import { generatePlan } from '../services/api';
import { supabase } from '../services/supabase';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import PaywallModal from '../components/PaywallModal';
import ImportRecipeModal from '../components/ImportRecipeModal';
import RecipeModal from '../components/RecipeModal';
import OnboardingModal from '../components/OnboardingModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        clearPlan,
        isFirstPlanFree,
        markFirstPlanUsed,
    } = usePlan();

    const [paywallVisible, setPaywallVisible] = useState(false);
    const [importVisible, setImportVisible] = useState(false);
    const [importedMeal, setImportedMeal] = useState(null);
    const [onboardingVisible, setOnboardingVisible] = useState(false);

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        try {
            const hasViewed = await AsyncStorage.getItem('has_viewed_onboarding_v3');
            if (!hasViewed) {
                // Small delay to ensure app is loaded
                setTimeout(() => setOnboardingVisible(true), 500);
            }
        } catch (e) {
            console.error('Failed to check onboarding status');
        }
    };

    useEffect(() => {
        if (plan.length === 0) {
            loadFromCache();
        }
        if (!planName) {
            const adjectives = [
                'Zesty',
                'Spicy',
                'Fresh',
                'Crispy',
                'Savory',
                'Sweet',
                'Tangy',
                'Hearty',
                'Healthy',
                'Epic',
                'Green',
                'Vital',
                'Lean',
                'Strong',
                'Mega',
                'Super',
                'Power',
                'Happy',
                'Quick',
                'Easy',
                'Fit',
                'Smart',
                'Daily',
                'Weekly',
                'Bright',
                'Bold',
                'Smooth',
                'Crunchy',
                'Juicy',
                'Golden',
                'Roasted',
                'Baked',
                'Grilled',
                'Raw',
                'Glazed',
                'Seasoned',
                'Ultimate',
                'Prime',
                'Elite',
                'Simple',
                'Pure',
                'Wild',
                'Urban',
                'Home',
                'Chef',
                'Tasty',
                'Yummy',
                'Wholesome',
                'Nutty',
                'Balanced',
            ];
            const nouns = [
                'Fiesta',
                'Feast',
                'Bowl',
                'Plate',
                'Week',
                'Plan',
                'Menu',
                'Table',
                'Bites',
                'Delight',
                'Gains',
                'Fuel',
                'Boost',
                'Mix',
                'Prep',
                'Guide',
                'Chart',
                'List',
                'Goal',
                'Shred',
                'Bulk',
                'Lifestyle',
                'Habit',
                'Routine',
                'Journey',
                'Path',
                'Track',
                'Way',
                'Style',
                'Taste',
                'Flavor',
                'Kitchen',
                'Pantry',
                'Fridge',
                'Basket',
                'Box',
                'Bundle',
                'Pack',
                'Set',
                'Series',
                'Cycle',
                'Flow',
                'Wave',
                'Spark',
                'Energy',
                'Inspo',
                'Creation',
                'Masterpiece',
                'Symphony',
                'Medley',
            ];
            const today = new Date();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dateStr = `${today.getDate()} ${months[today.getMonth()]}`;
            const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} (${dateStr})`;
            setPlanName(randomName);
        }
    }, [plan.length, loadFromCache]);

    const handleDismissResume = () => {
        clearPlan();
    };

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

    const handleGeneratePlan = async (overrideDays, overridePrefs, overrideGoal) => {
        const targetDays = overrideDays || days;
        const targetPrefs = overridePrefs || selectedPrefs;
        const targetGoal = overrideGoal || null; // Goal is optional for manual generation

        if (!targetDays || isNaN(targetDays) || parseInt(targetDays) <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number of days.');
            return;
        }

        const numDays = parseInt(targetDays);
        const MAX_FREE_DAYS = 3;

        // Paywall Gate: Allow the VERY FIRST plan to be free regardless of length
        // This is the "Endowment Effect" trigger.
        if (!isPro && numDays > MAX_FREE_DAYS && !isFirstPlanFree) {
            setPaywallVisible(true);
            return;
        }

        // If it's the first plan and they successfully generate, mark it as used
        const isActuallyFirstFree = !isPro && isFirstPlanFree;

        if (numDays > 30) {
            // Can increase to 30 for Pro
            Alert.alert('Limit Reached', 'Plans are currently limited to a maximum of 30 days.');
            return;
        }

        setLoading(true);
        try {
            const data = await generatePlan(numDays, targetPrefs, meatFreeDays, targetGoal);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Get session to save (optional logic, could verify first)
            const {
                data: { session },
            } = await supabase.auth.getSession();
            let newPlanId = null;

            if (session && session.user && isPro) {
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
                    setPlanId(savedData.id);
                }
            }

            setPlan(data.plan);
            setIsOfflineMode(false);

            if (isActuallyFirstFree) {
                await markFirstPlanUsed();
            }

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
                <View style={styles.menuItem}>
                    <TouchableOpacity
                        onPress={() => {
                            if (isPro) {
                                router.push('/history');
                            } else {
                                setPaywallVisible(true);
                            }
                        }}
                        style={styles.iconButton}
                        accessibilityLabel="My Plans History"
                    >
                        <Ionicons name="receipt-outline" size={24} color={isPro ? '#FFF' : '#777'} />
                    </TouchableOpacity>
                    <Text style={styles.menuLabel}>History</Text>
                </View>

                <View style={styles.menuItem}>
                    <TouchableOpacity
                        onPress={() => {
                            if (isPro) {
                                setImportVisible(true);
                            } else {
                                setPaywallVisible(true);
                            }
                        }}
                        style={styles.iconButton}
                    >
                        <Ionicons name="add-circle-outline" size={24} color={isPro ? "#BB86FC" : "#777"} />
                    </TouchableOpacity>
                    <Text style={styles.menuLabel}>Import</Text>
                </View>

                <View style={styles.menuItem}>
                    <TouchableOpacity
                        onPress={() => router.push('/settings')}
                        style={styles.iconButton}
                        accessibilityLabel="Settings"
                    >
                        <Ionicons name="settings-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.menuLabel}>Settings</Text>
                </View>
            </View>

            {plan.length > 0 && (
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/results')}>
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
                        <TouchableOpacity
                            style={styles.dismissButton}
                            onPress={handleDismissResume}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>
                    </View>
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
                isPro={isPro}
                onProFeature={() => setPaywallVisible(true)}
            />

            <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} />

            <ImportRecipeModal
                isVisible={importVisible}
                onClose={() => setImportVisible(false)}
                onImportSuccess={(meal) => {
                    setImportedMeal(meal);
                }}
            />

            <RecipeModal
                selectedMeal={importedMeal}
                onClose={() => setImportedMeal(null)}
                isPro={isPro}
                onUnlockPro={() => setPaywallVisible(true)}
            />

            <OnboardingModal
                visible={onboardingVisible}
                onComplete={async (answers) => {
                    setOnboardingVisible(false);
                    // Map survey answers to local state
                    if (answers.days) setDays(answers.days.toString());
                    if (answers.diet && answers.diet !== 'None') {
                        setSelectedPrefs([answers.diet]);
                    }

                    // Small delay then auto-trigger generation
                    // Pass values directly to bypass React closure lag
                    setTimeout(() => {
                        const d = answers.days ? answers.days.toString() : '7';
                        const p = (answers.diet && answers.diet !== 'None') ? [answers.diet] : [];
                        const g = answers.goal || null;
                        handleGeneratePlan(d, p, g);
                    }, 500);
                }}
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
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    topBar: {
        paddingHorizontal: 24,
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        zIndex: 10,
        marginBottom: 20,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)', // For web support mostly
    },
    appTitle: {
        fontSize: 32,
    },
    resumeCard: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#7F5AF0',
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
    dismissButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    menuLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: '500',
    },
});
