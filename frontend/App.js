import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import InputForm from './components/InputForm';
import MealPlanView from './components/MealPlanView';
import ShoppingListView from './components/ShoppingListView';
import RecipeModal from './components/RecipeModal';
import Auth from './components/Auth';
import PlanHistoryView from './components/PlanHistoryView';

// Services
import { generatePlan, swapMeal as swapMealApi } from './services/api';
import { supabase } from './services/supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [days, setDays] = useState('7');
  const [planName, setPlanName] = useState(`Plan ${new Date().toLocaleDateString()}`);
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [meatFreeDays, setMeatFreeDays] = useState([]);
  const [plan, setPlan] = useState(null);
  const [planId, setPlanId] = useState(null); // Track the DB ID of the current plan
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('INPUT'); // INPUT | RESULTS | HISTORY
  const [resultsTab, setResultsTab] = useState('PLAN'); // PLAN | SHOPPING
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Auth & Data Loading
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadLatestPlan(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadLatestPlan(session.user.id);
      else setPlan(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadLatestPlan = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('saved_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    setLoading(false);

    if (data && data.plan_data) {
      setPlan(data.plan_data);
      setPlanId(data.id);
      setView('RESULTS');
    }
  };

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

      // Save to Supabase
      if (session && session.user) {
        const { data: savedData, error } = await supabase
          .from('saved_plans')
          .insert([{
            user_id: session.user.id,
            plan_data: data.plan,
            name: planName
          }])
          .select()
          .single();

        if (savedData) setPlanId(savedData.id);
      }

      setPlan(data.plan);
      setView('RESULTS');
      setResultsTab('PLAN');
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate plan. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

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

  const reset = () => {
    setPlan(null);
    setPlanId(null);
    setPlanName(`Plan ${new Date().toLocaleDateString()}`);
    setView('INPUT');
  };

  const handleLoadPlan = (historyItem) => {
    setPlan(historyItem.plan_data);
    setPlanId(historyItem.id);
    setPlanName(historyItem.name);
    setView('RESULTS');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#121212', '#1E1E2E']} style={styles.background} />
        <Auth />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#121212', '#1E1E2E']}
          style={styles.background}
        />

        {/* Top Bar with Logout and History */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setView('HISTORY')} style={{ marginRight: 20 }}>
            <Text style={styles.historyText}>My Plans</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <RecipeModal
          selectedMeal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />

        {view === 'HISTORY' ? (
          <PlanHistoryView
            userId={session.user.id}
            onLoadPlan={handleLoadPlan}
            onBack={() => setView(plan ? 'RESULTS' : 'INPUT')}
          />
        ) : view === 'INPUT' ? (
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
          />
        ) : (
          <View style={styles.resultsContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{planName || "Your Plan"}</Text>
              <TouchableOpacity onPress={reset} style={styles.smallButton}>
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
              />
            ) : (
              <ShoppingListView plan={plan} />
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
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
    marginTop: 20,
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
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
