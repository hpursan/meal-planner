import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';

export default function RecipeModal({ selectedMeal, onClose, isPro, onUnlockPro }) {
    const [imageError, setImageError] = useState(false);

    // Reset error state when meal changes
    useEffect(() => {
        setImageError(false);
    }, [selectedMeal]);

    if (!selectedMeal) return null;

    const renderMacro = (label, value) => (
        <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>{label}</Text>
            {isPro ? (
                <Text style={styles.macroValue}>{value || '-'}</Text>
            ) : (
                <View style={styles.lockedContainer}>
                    <Text style={[styles.lockIcon, { fontSize: 20 }]}>🔒</Text>
                </View>
            )}
        </View>
    );

    const imageUrl = selectedMeal.image.startsWith('http')
        ? selectedMeal.image
        : `${process.env.EXPO_PUBLIC_API_URL || 'http://192.168.68.100:3000'}${selectedMeal.image}`;
    const fallbackUrl = `${process.env.EXPO_PUBLIC_API_URL || 'http://192.168.68.100:3000'}/images/generic_fallback_meal.png`;

    return (
        <Modal animationType="slide" transparent={true} visible={!!selectedMeal} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {!imageError && selectedMeal.image ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.heroImage}
                            onError={(e) => {
                                console.log(`FAILED IMAGE: ${imageUrl}`);
                                // console.log('ERROR:', e.nativeEvent.error);
                                setImageError(true);
                            }}
                        />
                    ) : (
                        <Image
                            source={{ uri: fallbackUrl }}
                            style={[styles.heroImage]}
                        />
                    )}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{selectedMeal.name}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScroll}>
                        <View style={styles.tagRow}>
                            <View style={styles.calBadge}>
                                <Text style={styles.calText}>{selectedMeal.calories || 'N/A'} kcal</Text>
                            </View>
                            {selectedMeal.tags &&
                                selectedMeal.tags.slice(0, 3).map((tag, i) => (
                                    <View key={i} style={styles.tagBadge}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                        </View>

                        {/* MACROS SECTION - NEW */}
                        {selectedMeal.macros && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    console.log('Unlock Macros Pressed. isPro:', isPro);
                                    if (!isPro && onUnlockPro) {
                                        onUnlockPro();
                                    } else {
                                        console.log('Unlock action skipped. onUnlockPro:', !!onUnlockPro);
                                    }
                                }}
                                style={styles.macrosContainer}
                            >
                                <View style={styles.macroRow}>
                                    <View style={styles.macroItem}>
                                        <Text style={styles.macroLabel}>Calories</Text>
                                        <Text style={styles.macroValue}>{selectedMeal.macros.calories}</Text>
                                    </View>
                                    {renderMacro('Protein', selectedMeal.macros.protein)}
                                    {renderMacro('Carbs', selectedMeal.macros.carbs)}
                                    {renderMacro('Fats', selectedMeal.macros.fats)}
                                </View>
                                {!isPro && (
                                    <View style={styles.unlockOverlay}>
                                        <Text style={styles.unlockText}>Tap to Unlock Macros</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}

                        <Text style={styles.sectionHeader}>Ingredients</Text>
                        <View style={styles.ingredientList}>
                            {selectedMeal.ingredients ? (
                                selectedMeal.ingredients.map((ing, i) => (
                                    <Text key={i} style={styles.ingredientText}>
                                        • {typeof ing === 'string' ? ing : `${ing.quantity} ${ing.name}`}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.ingredientText}>No ingredients listed.</Text>
                            )}
                        </View>

                        <Text style={styles.sectionHeader}>Instructions</Text>
                        <View style={styles.instructionList}>
                            {selectedMeal.instructions ? (
                                selectedMeal.instructions.map((step, i) => (
                                    <View key={i} style={styles.stepRow}>
                                        <Text style={styles.stepNum}>{i + 1}</Text>
                                        <Text style={styles.stepText}>{step}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.stepText}>No instructions available.</Text>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    heroPlaceholder: {
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
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
    macrosContainer: {
        backgroundColor: '#2A2A35',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#444',
        position: 'relative',
    },
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macroItem: {
        alignItems: 'center',
        flex: 1,
    },
    macroLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    macroValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    lockedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    blurredText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    lockIcon: {
        fontSize: 12,
    },
    unlockOverlay: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    unlockText: {
        color: '#BB86FC',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
