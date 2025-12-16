import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';

const SmartImage = ({ uri, style }) => {
    const [error, setError] = useState(false);

    if (error || !uri) {
        return (
            <View style={[style, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>🍽️</Text>
            </View>
        );
    }

    return (
        <Image
            source={{ uri }}
            style={style}
            onError={() => setError(true)}
        />
    );
};

export default function MealPlanView({ plan, onSelectMeal, onSwapMeal, isOnline = true }) {
    if (!plan) return null;

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {plan.map((day, index) => (
                <View key={day.day} style={styles.dayCard} accessibilityRole="header" accessibilityLabel={`Day ${day.day}, ${day.dayName}`}>
                    <View style={styles.dayHeaderRow}>
                        <Text style={styles.dayHeader}>Day {day.day}</Text>
                        <Text style={styles.daySubHeader}>{day.dayName}</Text>
                    </View>
                    {['breakfast', 'lunch', 'dinner'].map(type => {
                        const meal = day.meals[type];
                        return (
                            <View key={type} style={styles.mealRow}>
                                <Text style={styles.mealType} accessibilityRole="text">{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                                <View style={styles.mealContent}>
                                    <TouchableOpacity
                                        onPress={() => onSelectMeal(meal)}
                                        style={styles.mealTouchable}
                                        accessibilityRole="button"
                                        accessibilityLabel={`${type} meal: ${meal.name}`}
                                        accessibilityHint="Double tap to view recipe details"
                                    >
                                        <View style={styles.mealInfoContainer}>
                                            <SmartImage uri={meal.image} style={styles.mealImage} />
                                            <Text style={styles.mealName}>{meal.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => isOnline ? onSwapMeal(index, type.charAt(0).toUpperCase() + type.slice(1), meal) : alert("Cannot swap meals while offline.")}
                                        style={[styles.swapButton, !isOnline && { opacity: 0.3 }]}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Swap ${type} meal`}
                                        accessibilityHint={`Replaces ${meal.name} with an alternative`}
                                        disabled={!isOnline}
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
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
    },
    placeholderText: {
        fontSize: 24,
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
