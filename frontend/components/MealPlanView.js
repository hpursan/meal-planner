import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function MealPlanView({ plan, onSelectMeal, onSwapMeal }) {
    if (!plan) return null;

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {plan.map((day, index) => (
                <View key={day.day} style={styles.dayCard}>
                    <View style={styles.dayHeaderRow}>
                        <Text style={styles.dayHeader}>Day {day.day}</Text>
                        <Text style={styles.daySubHeader}>{day.dayName}</Text>
                    </View>
                    {['breakfast', 'lunch', 'dinner'].map(type => {
                        const meal = day.meals[type];
                        return (
                            <View key={type} style={styles.mealRow}>
                                <Text style={styles.mealType}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                                <View style={styles.mealContent}>
                                    <TouchableOpacity onPress={() => onSelectMeal(meal)} style={styles.mealTouchable}>
                                        <View style={styles.mealInfoContainer}>
                                            {meal.image && (
                                                <Image source={{ uri: meal.image }} style={styles.mealImage} />
                                            )}
                                            <Text style={styles.mealName}>{meal.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => onSwapMeal(index, type.charAt(0).toUpperCase() + type.slice(1), meal)}
                                        style={styles.swapButton}
                                    >
                                        <Text style={styles.swapIcon}>⟳</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        color: '#A0A0A0',
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
        flexShrink: 1, // Allow text to wrap if image takes space
    },
    mealContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    mealInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mealImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#2A2A35',
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
});
