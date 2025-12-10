import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, SafeAreaView, Platform, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import Animated, { FadeInUp, FadeOutDown, LayoutAnimation } from 'react-native-reanimated';

// Host handling for Android Emulator vs iOS Simulator vs Web
// Host handling for Android Emulator vs iOS Simulator vs Web vs Physical Device
// Using specific LAN IP to allow physical device testing via Expo Go
const API_HOST = 'http://192.168.68.104:3000';

const PREFERENCES_OPTIONS = ["Vegan", "Vegetarian", "Keto", "Paleo", "Gluten-Free", "No Beef", "No Pork"];
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function App() {
  const [days, setDays] = useState('7');
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [meatFreeDays, setMeatFreeDays] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('INPUT'); // INPUT | RESULTS

  const [resultsTab, setResultsTab] = useState('PLAN'); // PLAN | SHOPPING
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [showAllItems, setShowAllItems] = useState(true); // Toggle state
  const [checkedItems, setCheckedItems] = useState({});

  const togglePref = (pref) => {
    if (selectedPrefs.includes(pref)) {
      setSelectedPrefs(selectedPrefs.filter(p => p !== pref));
    } else {
      setSelectedPrefs([...selectedPrefs, pref]);
    }
  };

  const toggleShowAll = () => setShowAllItems(!showAllItems);

  const toggleMeatFreeDay = (day) => {
    if (meatFreeDays.includes(day)) {
      setMeatFreeDays(meatFreeDays.filter(d => d !== day));
    } else {
      setMeatFreeDays([...meatFreeDays, day]);
    }
  };

  const toggleChecked = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const toggleExpanded = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const generatePlan = async () => {
    if (!days || isNaN(days) || parseInt(days) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of days.");
      return;
    }

    setLoading(true);
    setCheckedItems({}); // Reset checklist
    setExpandedItems({}); // Reset expanded
    try {
      const response = await fetch(`${API_HOST}/api/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: selectedPrefs,
          days: parseInt(days),
          meatFreeDays: meatFreeDays
        }),
      });
      const data = await response.json();
      setPlan(data.plan);
      setView('RESULTS');
      setResultsTab('PLAN'); // Reset to plan view on new generation
    } catch (error) {
      Alert.alert("Error", "Failed to generate plan. Ensure backend is running.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPlan(null);
    setView('INPUT');
  };

  const getShoppingList = () => {
    if (!plan) return [];
    const counts = {};
    const details = {}; // Store list of meals for each ingredient

    plan.forEach(day => {
      Object.values(day.meals).forEach(meal => {
        if (meal.ingredients) {
          meal.ingredients.forEach(ing => {
            counts[ing] = (counts[ing] || 0) + 1;

            if (!details[ing]) details[ing] = [];
            // De-duplicate per meal if needed, but simplistic is fine
            if (!details[ing].includes(`Day ${day.day}: ${meal.name}`)) {
              details[ing].push(`Day ${day.day}: ${meal.name}`);
            }
          });
        }
      });
    });
    return Object.keys(counts).sort().map(ing => ({
      name: ing,
      count: counts[ing],
      usedIn: details[ing]
    }));
  };

  const shoppingList = getShoppingList();

  const swapMeal = async (dayIndex, type, currentMeal) => {
    let effectivePrefs = [...selectedPrefs];
    const dayName = plan[dayIndex].dayName;

    if (meatFreeDays.includes(dayName)) {
      if (!effectivePrefs.includes("Vegan") && !effectivePrefs.includes("Vegetarian")) {
        effectivePrefs.push("Vegetarian");
      }
    }

    try {
      const response = await fetch(`${API_HOST}/api/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentId: currentMeal.id,
          type: type, // "Breakfast"
          preferences: effectivePrefs
        }),
      });

      const data = await response.json();
      if (data.meal) {
        const newPlan = [...plan];
        newPlan[dayIndex].meals[type.toLowerCase()] = data.meal;
        setPlan(newPlan);
      } else {
        Alert.alert("Info", "No other matching meals found.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to swap meal.");
    }
  };

  const renderRecipeModal = () => {
    if (!selectedMeal) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedMeal}
        onRequestClose={() => setSelectedMeal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedMeal.name}</Text>
              <TouchableOpacity onPress={() => setSelectedMeal(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.tagRow}>
                <View style={styles.calBadge}>
                  <Text style={styles.calText}>{selectedMeal.calories || 'N/A'} kcal</Text>
                </View>
                {selectedMeal.tags && selectedMeal.tags.slice(0, 3).map((tag, i) => (
                  <View key={i} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionHeader}>Ingredients</Text>
              <View style={styles.ingredientList}>
                {selectedMeal.ingredients ? selectedMeal.ingredients.map((ing, i) => (
                  <Text key={i} style={styles.ingredientText}>• {ing}</Text>
                )) : <Text style={styles.ingredientText}>No ingredients listed.</Text>}
              </View>

              <Text style={styles.sectionHeader}>Instructions</Text>
              <View style={styles.instructionList}>
                {selectedMeal.instructions ? selectedMeal.instructions.map((step, i) => (
                  <View key={i} style={styles.stepRow}>
                    <Text style={styles.stepNum}>{i + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                )) : <Text style={styles.stepText}>No instructions available.</Text>}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#121212', '#1E1E2E']}
        style={styles.background}
      />

      {renderRecipeModal()}

      {view === 'INPUT' ? (
        <View style={styles.content}>
          <Text style={styles.title}>Meal Planner</Text>
          <Text style={styles.subtitle}>Design your perfect diet.</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Duration (Days)</Text>
            <TextInput
              style={styles.input}
              value={days}
              onChangeText={setDays}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Preferences</Text>
            <View style={styles.chipContainer}>
              {PREFERENCES_OPTIONS.map(pref => (
                <TouchableOpacity
                  key={pref}
                  style={[styles.chip, selectedPrefs.includes(pref) && styles.chipSelected]}
                  onPress={() => togglePref(pref)}
                >
                  <Text style={[styles.chipText, selectedPrefs.includes(pref) && styles.chipTextSelected]}>
                    {pref}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Meat-Free Days</Text>
            <Text style={styles.helperText}>Select days to go vegetarian (Starts Monday)</Text>
            <View style={styles.chipContainer}>
              {DAYS_OF_WEEK.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[styles.chip, meatFreeDays.includes(day) && styles.chipSelected]}
                  onPress={() => toggleMeatFreeDay(day)}
                >
                  <Text style={[styles.chipText, meatFreeDays.includes(day) && styles.chipTextSelected]}>
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={generatePlan} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Generate Plan</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Your Plan</Text>
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {plan && plan.map((day, index) => (
                <View key={day.day} style={styles.dayCard}>
                  <View style={styles.dayHeaderRow}>
                    <Text style={styles.dayHeader}>Day {day.day}</Text>
                    <Text style={styles.daySubHeader}>{day.dayName}</Text>
                  </View>
                  <View style={styles.mealRow}>
                    <Text style={styles.mealType}>Breakfast</Text>
                    <View style={styles.mealContent}>
                      <TouchableOpacity onPress={() => setSelectedMeal(day.meals.breakfast)} style={styles.mealTouchable}>
                        <Text style={styles.mealName}>{day.meals.breakfast.name}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => swapMeal(index, "Breakfast", day.meals.breakfast)} style={styles.swapButton}>
                        <Text style={styles.swapIcon}>⟳</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.mealRow}>
                    <Text style={styles.mealType}>Lunch</Text>
                    <View style={styles.mealContent}>
                      <TouchableOpacity onPress={() => setSelectedMeal(day.meals.lunch)} style={styles.mealTouchable}>
                        <Text style={styles.mealName}>{day.meals.lunch.name}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => swapMeal(index, "Lunch", day.meals.lunch)} style={styles.swapButton}>
                        <Text style={styles.swapIcon}>⟳</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.mealRow}>
                    <Text style={styles.mealType}>Dinner</Text>
                    <View style={styles.mealContent}>
                      <TouchableOpacity onPress={() => setSelectedMeal(day.meals.dinner)} style={styles.mealTouchable}>
                        <Text style={styles.mealName}>{day.meals.dinner.name}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => swapMeal(index, "Dinner", day.meals.dinner)} style={styles.swapButton}>
                        <Text style={styles.swapIcon}>⟳</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.shoppingHeader}>
                <Text style={styles.sectionHeader}>Shopping List</Text>
                <TouchableOpacity onPress={toggleShowAll} style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>
                    {showAllItems ? "Hide Checked" : "Show All"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.shoppingContainer}>
                {shoppingList
                  .filter(item => showAllItems || !checkedItems[item.name])
                  .map((item, index) => {
                    const isChecked = checkedItems[item.name];
                    const isExpanded = expandedItems[item.name];

                    return (
                      <View key={index}>
                        <TouchableOpacity
                          style={styles.shoppingItem}
                          onPress={() => toggleChecked(item.name)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                            {isChecked && <Text style={styles.checkmark}>✓</Text>}
                          </View>
                          <Text style={[styles.shoppingText, isChecked && styles.shoppingTextChecked]}>
                            {item.name}
                          </Text>
                          {item.count > 1 && (
                            <TouchableOpacity onPress={() => toggleExpanded(item.name)}>
                              <Text style={styles.countBadge}>{item.count} meals</Text>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>

                        {isExpanded && item.usedIn && (
                          <View style={styles.detailsContainer}>
                            {item.usedIn.map((usage, i) => (
                              <Text key={i} style={styles.detailText}>• {usage}</Text>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                {shoppingList.length === 0 && (
                  <Text style={styles.emptyText}>No ingredients found. Try generating a new plan.</Text>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
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
  subtitle: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    marginTop: -8,
  },
  input: {
    backgroundColor: '#1E1E2E',
    color: '#FFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#1E1E2E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  chipSelected: {
    backgroundColor: '#BB86FC',
    borderColor: '#BB86FC',
  },
  chipText: {
    color: '#CCC',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#000',
  },
  button: {
    backgroundColor: '#BB86FC',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
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
  scrollContent: {
    paddingBottom: 40,
  },
  dayCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  dayHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A0A0A0', // Muted accent
  },
  daySubHeader: {
    fontSize: 14,
    color: '#BB86FC',
    fontWeight: '600',
  },
  mealRow: {
    marginBottom: 8,
  },
  mealType: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  mealName: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
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
  shoppingContainer: {
    padding: 10,
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6, // Square-ish
    borderWidth: 2,
    borderColor: '#BB86FC',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#BB86FC',
  },
  checkmark: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  shoppingText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  shoppingTextChecked: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  countBadge: {
    backgroundColor: '#2A2A35', // Slightly lighter/different than card bg
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#AAA',
    overflow: 'hidden',
  },
  detailsContainer: {
    paddingLeft: 46, // align with text (20 checkbox + 16 margin + 10 padding)
    paddingBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E2E',
    borderRadius: 24,
    maxHeight: '80%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A35',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#888',
    lineHeight: 24,
  },
  modalScroll: {
    padding: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  calBadge: {
    backgroundColor: '#BB86FC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  calText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tagBadge: {
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: '#CCC',
    fontSize: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    marginTop: 8,
  },
  ingredientList: {
    marginBottom: 24,
    backgroundColor: '#252530',
    padding: 16,
    borderRadius: 12,
  },
  ingredientText: {
    color: '#DDD',
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 20,
  },
  instructionList: {
    paddingBottom: 40,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNum: {
    color: '#BB86FC',
    fontWeight: 'bold',
    fontSize: 16,
    width: 24,
    marginRight: 8,
  },
  stepText: {
    color: '#EEE',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  mealContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealTouchable: {
    flex: 1,
  },
  swapButton: {
    padding: 8,
    marginLeft: 8,
  },
  swapIcon: {
    color: '#BB86FC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  shoppingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  filterButton: {
    padding: 4,
  },
  filterButtonText: {
    color: '#BB86FC',
    fontSize: 14,
    fontWeight: '600',
  },
});
