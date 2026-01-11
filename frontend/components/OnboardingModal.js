import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to Meal Planner',
        description: 'Automate your weekly meal planning with just a few taps. Save time, money, and reduce food waste.',
        icon: 'calendar',
        colors: ['#4c669f', '#3b5998', '#192f6a'],
    },
    {
        id: '2',
        title: 'Magic Import',
        description: 'Found a great recipe online? Just paste the URL or text, and our AI will extract it instantly.',
        icon: 'flash',
        colors: ['#BB86FC', '#7F5AF0', '#5c3c92'],
    },
    {
        id: '3',
        title: 'Track Your History',
        description: 'Access all your past plans and favorite recipes in one place. Never lose a great meal again.',
        icon: 'receipt',
        colors: ['#FF6B6B', '#556270', '#4ECDC4'],
    },
];

export default function OnboardingModal({ visible, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = async () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            await AsyncStorage.setItem('has_viewed_onboarding_v2', 'true');
            onClose();
        }
    };

    if (!visible) return null;

    const currentSlide = slides[currentIndex];

    return (
        <Modal animationType="fade" transparent visible={visible}>
            <View style={styles.container}>
                <LinearGradient
                    colors={currentSlide.colors}
                    style={styles.background}
                />
                
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={currentSlide.icon} size={80} color="#FFF" />
                    </View>
                    
                    <Text style={styles.title}>{currentSlide.title}</Text>
                    <Text style={styles.description}>{currentSlide.description}</Text>

                    <View style={styles.pagination}>
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentIndex ? styles.activeDot : styles.inactiveDot,
                                ]}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>
                            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                        <Ionicons 
                            name={currentIndex === slides.length - 1 ? "checkmark" : "arrow-forward"} 
                            size={20} 
                            color="#333" 
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
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
        width: width * 0.85,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        backdropFilter: 'blur(20px)', // For web
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#FFF',
        width: 20,
    },
    inactiveDot: {
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        gap: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
