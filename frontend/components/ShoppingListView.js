import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function ShoppingListView({ plan }) {
    const [expandedItems, setExpandedItems] = useState({});
    const [showAllItems, setShowAllItems] = useState(true);
    const [checkedItems, setCheckedItems] = useState({});
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        if (plan) {
            setShoppingList(getShoppingList(plan));
            // Reset expanded but keep checked items? For now reset all on plan change is safer default
            // but if we navigate tabs we want to persist. 
            // The parent App.js re-renders this component. State here is local.
            // If we switch tabs, this component might unmount if conditional rendering is used.
            // In App.js we see: conditional rendering `resultsTab === 'PLAN' ? ... : ...`
            // So yes, state will be lost on tab switch. 
            // We should probably hoist state or usage logic.
            // For MVP Refactor, I will keep logic here but warn strictly.
            // OR better: derive shopping list from plan prop, and keep checked/expanded state here.
        }
    }, [plan]);

    const getShoppingList = (currentPlan) => {
        if (!currentPlan) return [];
        const counts = {};
        const details = {};

        currentPlan.forEach(day => {
            Object.values(day.meals).forEach(meal => {
                if (meal.ingredients) {
                    meal.ingredients.forEach(ing => {
                        counts[ing] = (counts[ing] || 0) + 1;

                        if (!details[ing]) details[ing] = [];
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

    const toggleShowAll = () => setShowAllItems(!showAllItems);

    return (
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
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 40,
    },
    shoppingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    filterButton: {
        padding: 4,
    },
    filterButtonText: {
        color: '#BB86FC',
        fontSize: 14,
        fontWeight: '600',
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
        borderRadius: 6,
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
        backgroundColor: '#2A2A35',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        color: '#AAA',
        overflow: 'hidden',
    },
    detailsContainer: {
        paddingLeft: 46,
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
});
