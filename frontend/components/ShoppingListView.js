import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { usePlan } from '../context/PlanContext';
import { supabase } from '../services/supabase';

export default function ShoppingListView({ plan }) {
    // Use Global Context instead of local state
    const { checkedItems, setCheckedItems, planId } = usePlan();

    // 1. Consolidate Ingredients
    const ingredients = {};
    if (plan) {
        plan.forEach(day => {
            Object.values(day.meals).forEach(meal => {
                meal.ingredients.forEach(ing => {
                    const key = ing.trim();
                    ingredients[key] = (ingredients[key] || 0) + 1;
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

    const renderItem = ({ item }) => {
        const isChecked = checkedItems[item];
        const count = ingredients[item];

        return (
            <TouchableOpacity
                style={[styles.itemRow, isChecked && styles.itemRowChecked]}
                onPress={() => toggleItem(item)}
                activeOpacity={0.7}
            >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                    {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.itemText, isChecked && styles.itemTextChecked]}>
                    {item} {count > 1 && <Text style={styles.count}>({count}x)</Text>}
                </Text>
            </TouchableOpacity>
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
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A35',
    },
    itemRowChecked: {
        opacity: 0.4,
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
    count: {
        color: '#BB86FC',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
