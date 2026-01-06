import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

const SmartImage = ({ uri, style }) => {
    const [error, setError] = useState(false);
    // Align with RecipeModal fallback
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.68.100:3000';

    React.useEffect(() => {
        setError(false);
    }, [uri]);

    if (error || !uri) {
        return (
            <Image
                source={{ uri: `${API_URL}/images/generic_fallback_meal.png` }}
                style={style}
            />
        );
    }

    const fullUri = uri.startsWith('http') ? uri : `${API_URL}${uri}`;

    return (
        <Image
            source={{ uri: fullUri }}
            style={style}
            onError={(e) => {
                console.log(`SmartImage Error (MealPlanView) for: ${fullUri}`);
                setError(true);
            }}
        />
    );
};

export default function MealPlanView({ plan, onSelectMeal, onSwapMeal, isOnline = true }) {
    if (!plan) return null;

    const isIOS = Platform.OS === 'ios';

    // Back to Standard Dark, but with LOWER intensity to avoid "Solid Paint" look
    const blurTint = isIOS ? "systemMaterialDark" : "dark";
    const blurIntensity = isIOS ? 30 : 20;

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {plan.map((day, index) => (
                <View key={day.day} style={styles.cardContainer}>
                    <BlurView
                        intensity={blurIntensity}
                        tint={blurTint}
                        style={[
                            styles.blurContainer,
                            // Balanced White Overlay for "Frosting" without washing out
                            { backgroundColor: isIOS ? 'rgba(255, 255, 255, 0.08)' : 'rgba(30, 30, 46, 0.8)' }
                        ]}
                    >
                        <View
                            accessibilityRole="header"
                            accessibilityLabel={`Day ${day.day}, ${day.dayName}`}
                        >
                            <View style={styles.dayHeaderRow}>
                                <Text style={styles.dayHeader}>Day {day.day}</Text>
                                <Text style={styles.daySubHeader}>{day.dayName}</Text>
                            </View>
                            {['breakfast', 'lunch', 'dinner'].map((type) => {
                                const meal = day.meals[type];
                                return (
                                    <View key={type} style={styles.mealRow}>
                                        <Text style={styles.mealType} accessibilityRole="text">
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </Text>
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
                                                onPress={() =>
                                                    isOnline
                                                        ? onSwapMeal(index, type.charAt(0).toUpperCase() + type.slice(1), meal)
                                                        : alert('Cannot swap meals while offline.')
                                                }
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
                    </BlurView>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 40,
    },
    cardContainer: {
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)', // Crisp Glassy Rim
        backgroundColor: 'transparent',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    blurContainer: {
        padding: 24,
    },
    dayHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)', // Brighter divider
        paddingBottom: 12,
    },
    dayHeader: {
        fontSize: 28,
        fontWeight: '800', // Extra Bold
        color: '#E0E0E0',
        letterSpacing: -0.5,
    },
    daySubHeader: {
        fontSize: 14,
        color: '#BB86FC',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    mealRow: {
        marginBottom: 16,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 16,
        padding: 12,
    },
    mealType: {
        fontSize: 10,
        color: '#888',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
        opacity: 0.8,
    },
    mealName: {
        fontSize: 17,
        color: '#FFF',
        fontWeight: '600',
        flexShrink: 1,
        lineHeight: 22,
    },
    mealContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    mealInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    mealImage: {
        width: 64, // Bigger images
        height: 64,
        borderRadius: 12,
        marginRight: 16,
        backgroundColor: '#2A2A35',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
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
        padding: 12,
        backgroundColor: 'rgba(187, 134, 252, 0.1)', // Subtle purple tint
        borderRadius: 12,
        marginLeft: 12,
    },
    swapIcon: {
        color: '#BB86FC',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
