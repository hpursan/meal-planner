import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { swapMeal as swapMealApi } from '../services/api';
import { supabase } from '../services/supabase';
import MealPlanView from '../components/MealPlanView';
import ShoppingListView from '../components/ShoppingListView';
import RecipeModal from '../components/RecipeModal';

export default function ResultsScreen() {
    const router = useRouter();
    const { plan, setPlan, planId, planName, selectedPrefs, meatFreeDays, clearPlan, isOfflineMode, isOnline } = usePlan();
    const [resultsTab, setResultsTab] = useState('PLAN');
    const [selectedMeal, setSelectedMeal] = useState(null);

    const handleSwapMeal = async (dayIndex, type, currentMeal) => {
        let effectivePrefs = [...selectedPrefs];
        const dayName = plan[dayIndex].dayName;

        if (meatFreeDays.includes(dayName)) {
            if (!effectivePrefs.includes("Vegan") && !effectivePrefs.includes("Vegetarian")) {
                effectivePrefs.push("Vegetarian");
            }
        }

        try {
            const data = await swapMealApi(currentMeal.id, type, effectivePrefs);
            if (data.meal) {
                const newPlan = [...plan];
                newPlan[dayIndex].meals[type.toLowerCase()] = data.meal;
                setPlan(newPlan);

                // Update Supabase
                if (planId) {
                    await supabase
                        .from('saved_plans')
                        .update({ plan_data: newPlan })
                        .eq('id', planId);
                }
            } else {
                Alert.alert("Info", "No other matching meals found.");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to swap meal.");
        }
    };

    const handleNewPlan = () => {
        clearPlan();
        router.back();
    };

    if (!plan || plan.length === 0) {
        // Fallback if accessed directly without plan
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white', marginTop: 100, textAlign: 'center' }}>No plan loaded.</Text>
                <TouchableOpacity onPress={() => router.replace('/')}><Text style={{ color: '#BB86FC', textAlign: 'center', marginTop: 20 }}>Go Home</Text></TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#121212', '#1E1E2E']} style={styles.background} />

            {/* Header */}
            <View style={styles.resultsContainer}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 10 }}>
                    <Text style={{ color: '#AAA' }}>← Back</Text>
                </TouchableOpacity>

                {isOfflineMode && !isOnline && (
                    <View style={styles.offlineBanner}>
                        <Text style={styles.offlineText}>⚠️ Offline Mode - Showing cached plan</Text>
                    </View>
                )}

                <View style={styles.headerRow}>
                    <Text style={styles.title}>{planName || "Your Plan"}</Text>
                    <TouchableOpacity onPress={handleNewPlan} style={styles.smallButton}>
                        <Text style={styles.smallButtonText}>New</Text>
                    </TouchableOpacity>
                </View>

                {/* TAB BAR */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tab, resultsTab === 'PLAN' && styles.tabActive]}
                        onPress={() => setResultsTab('PLAN')}
                    >
                        <Text style={[styles.tabText, resultsTab === 'PLAN' && styles.tabTextActive]}>Weekly Plan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, resultsTab === 'SHOPPING' && styles.tabActive]}
                        onPress={() => setResultsTab('SHOPPING')}
                    >
                        <Text style={[styles.tabText, resultsTab === 'SHOPPING' && styles.tabTextActive]}>Shopping List</Text>
                    </TouchableOpacity>
                </View>

                {resultsTab === 'PLAN' ? (
                    <MealPlanView
                        plan={plan}
                        onSelectMeal={setSelectedMeal}
                        onSwapMeal={handleSwapMeal}
                        isOnline={isOnline}
                    />
                ) : (
                    <ShoppingListView plan={plan} />
                )}
            </View>

            <RecipeModal
                selectedMeal={selectedMeal}
                onClose={() => setSelectedMeal(null)}
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
    resultsContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    smallButton: {
        padding: 8,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    smallButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#1E1E2E',
        borderRadius: 12,
        marginBottom: 20,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: '#BB86FC',
    },
    tabText: {
        color: '#888',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#000',
    },
    offlineBanner: {
        backgroundColor: '#FFCF44',
        padding: 8,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    offlineText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
