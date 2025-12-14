import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { usePlan } from '../context/PlanContext';
import { supabase } from '../services/supabase';

export default function ShoppingListView({ plan }) {
    // Use Global Context instead of local state
    const { checkedItems, setCheckedItems, planId } = usePlan();
    const [expandedItems, setExpandedItems] = React.useState({});

    // 1. Consolidate Ingredients and Track Usage
    const ingredients = {};
    const ingredientSources = {}; // Map: "Ingredient Name" -> ["Recipe A", "Recipe B"]

    if (plan) {
        plan.forEach(day => {
            Object.values(day.meals).forEach(meal => {
                meal.ingredients.forEach(ing => {
                    // Handle both string (legacy) and object (new) formats
                    let name = typeof ing === 'string' ? ing : ing.name;
                    const key = name.trim();
                    ingredients[key] = (ingredients[key] || 0) + 1;

                    // Track source
                    if (!ingredientSources[key]) {
                        ingredientSources[key] = [];
                    }
                    if (!ingredientSources[key].includes(meal.name)) {
                        ingredientSources[key].push(meal.name);
                    }
                });
            });
        });
    }

    const listData = Object.keys(ingredients).sort();

    const toggleItem = async (item) => {
        const newCheckedState = {
            ...checkedItems,
            [item]: !checkedItems[item]
        };

        // 1. Optimistic Update (Immediate Feedback)
        setCheckedItems(newCheckedState);

        // 2. Persist to Supabase
        if (planId) {
            const { error } = await supabase
                .from('saved_plans')
                .update({ checked_items: newCheckedState })
                .eq('id', planId);

            if (error) console.error("Failed to save shopping list:", error);
        }
    };

    const toggleExpanded = (item) => {
        setExpandedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const renderItem = ({ item }) => {
        const isChecked = checkedItems[item];
        const count = ingredients[item];
        const isExpanded = expandedItems[item];
        const sources = ingredientSources[item] || [];

        return (
            <View style={styles.itemContainer}>
                <View style={[styles.itemRow, isChecked && styles.itemRowChecked]}>
                    <TouchableOpacity
                        style={styles.mainClickableArea}
                        onPress={() => toggleItem(item)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                            {isChecked && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={[styles.itemText, isChecked && styles.itemTextChecked]}>
                            {item}
                        </Text>
                    </TouchableOpacity>

                    {count > 1 && (
                        <TouchableOpacity onPress={() => toggleExpanded(item)} style={styles.countBadge}>
                            <Text style={styles.count}>{count}x {isExpanded ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsHeader}>Used in:</Text>
                        {sources.map((source, index) => (
                            <Text key={index} style={styles.sourceText}>• {source}</Text>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    if (listData.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>No items to shop for.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={listData}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E2E',
        borderRadius: 16,
        overflow: 'hidden',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A35',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        justifyContent: 'space-between',
    },
    mainClickableArea: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemRowChecked: {
        opacity: 0.4,
        borderBottomWidth: 0, // Hide border on the inner row since container handles it
    },
    checkbox: {
        width: 24,
        height: 24,
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
        fontSize: 14,
    },
    itemText: {
        fontSize: 16,
        color: '#FFF',
        flex: 1,
    },
    itemTextChecked: {
        textDecorationLine: 'line-through',
        color: '#CCC',
        fontStyle: 'italic',
    },
    countBadge: {
        backgroundColor: '#2A2A35',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    count: {
        color: '#BB86FC',
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailsContainer: {
        paddingLeft: 42, // Indent to align with text
        paddingBottom: 12,
        paddingRight: 20,
    },
    detailsHeader: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
        fontWeight: '600',
    },
    sourceText: {
        fontSize: 13,
        color: '#BBB',
        marginBottom: 2,
    },
});
