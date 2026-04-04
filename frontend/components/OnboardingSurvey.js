import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const questions = [
    {
        id: 'goal',
        title: 'What is your primary goal?',
        options: [
            { label: 'Save Time', icon: 'time-outline', value: 'time' },
            { label: 'Eat Healthy', icon: 'heart-outline', value: 'health' },
            { label: 'Build Muscle', icon: 'barbell-outline', value: 'muscle' },
        ],
        colors: ['#4c669f', '#3b5998', '#192f6a'],
    },
    {
        id: 'diet',
        title: 'Any dietary preferences?',
        options: [
            { label: 'Vegan', icon: 'leaf-outline', value: 'Vegan' },
            { label: 'Vegetarian', icon: 'nutrition-outline', value: 'Vegetarian' },
            { label: 'Keto', icon: 'flash-outline', value: 'Keto' },
            { label: 'No Restrictions', icon: 'infinite-outline', value: 'None' },
        ],
        colors: ['#00b09b', '#96c93d'], // Vibrant Green
    },
    {
        id: 'days',
        title: 'How many days of planning?',
        options: [
            { label: '3 Days', icon: 'calendar-outline', value: 3 },
            { label: '5 Days', icon: 'calendar-outline', value: 5 },
            { label: '7 Days', icon: 'calendar-outline', value: 7 },
        ],
        colors: ['#FF6B6B', '#556270', '#4ECDC4'],
    },
];

export default function OnboardingSurvey({ onComplete }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const fadeAnim = useState(new Animated.Value(1))[0];

    const handleSelect = (value) => {
        if (Platform.OS !== 'web') {
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (e) { }
        }

        const nextStepData = { ...answers, [questions[step].id]: value };
        setAnswers(nextStepData);

        // Animate out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            if (step < questions.length - 1) {
                setStep(s => s + 1);
                // Animate in
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            } else {
                finish(nextStepData);
            }
        });
    };

    const finish = async (finalAnswers) => {
        try {
            await AsyncStorage.setItem('initial_onboarding_prefs', JSON.stringify(finalAnswers));
            await AsyncStorage.setItem('has_viewed_onboarding_v3', 'true');
            onComplete(finalAnswers);
        } catch (e) {
            console.error('Error saving onboarding info', e);
            onComplete(finalAnswers);
        }
    };

    const currentQuestion = questions[step];

    return (
        <View style={styles.container}>
            <LinearGradient colors={currentQuestion.colors} style={styles.background} />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.title}>{currentQuestion.title}</Text>

                <View style={styles.optionsGrid}>
                    {currentQuestion.options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles.optionButton}
                            onPress={() => handleSelect(option.value)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name={option.icon} size={32} color="#FFF" />
                            </View>
                            <Text style={styles.optionLabel}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.progressContainer}>
                    {questions.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressDot,
                                i === step ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    content: {
        width: width * 0.9,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    optionsGrid: {
        width: '100%',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        marginBottom: 15, // Replaces gap
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    optionLabel: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        marginTop: 50,
        gap: 10,
    },
    progressDot: {
        height: 6,
        borderRadius: 3,
    },
    activeDot: {
        backgroundColor: '#FFF',
        width: 30,
    },
    inactiveDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 10,
    },
});
