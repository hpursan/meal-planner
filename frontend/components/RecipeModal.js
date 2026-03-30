import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useKeepAwake } from 'expo-keep-awake';
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveRecipe } from '../services/api';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeModal({ selectedMeal, onClose, isPro, onUnlockPro }) {
    useKeepAwake();
    const [imageError, setImageError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [checkedIngredients, setCheckedIngredients] = useState({});

    // Check if this is a temporary imported meal (starts with 'temp_')
    const isImportedTemp = selectedMeal?.id?.toString().startsWith('temp_');

    // Reset error state when meal changes
    useEffect(() => {
        setImageError(false);
        setSaveError(null);
        setSaveSuccess(false);
        setCheckedIngredients({});
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
        : `${process.env.EXPO_PUBLIC_API_URL || 'https://meal-planner-dtkf.onrender.com'}${selectedMeal.image}`;
    const fallbackUrl = `${process.env.EXPO_PUBLIC_API_URL || 'https://meal-planner-dtkf.onrender.com'}/images/generic_fallback_meal.png`;

    const handleShare = async () => {
        try {
            let message = `🍽️ ${selectedMeal.name}\n\n`;

            if (selectedMeal.calories) {
                message += `🔥 ${selectedMeal.calories} kcal\n`;
            }
            if (selectedMeal.macros) {
                message += `💪 P: ${selectedMeal.macros.protein} | C: ${selectedMeal.macros.carbs} | F: ${selectedMeal.macros.fats}\n`;
            }
            message += '\n';

            if (selectedMeal.ingredients && selectedMeal.ingredients.length > 0) {
                message += "🥕 Ingredients:\n";
                selectedMeal.ingredients.forEach(ing => {
                    const line = typeof ing === 'string' ? ing : `${ing.quantity} ${ing.name}`;
                    message += `• ${line}\n`;
                });
                message += '\n';
            }

            if (selectedMeal.instructions && selectedMeal.instructions.length > 0) {
                message += "📝 Instructions:\n";
                selectedMeal.instructions.forEach((step, index) => {
                    message += `${index + 1}. ${step}\n`;
                });
                message += '\n';
            }

            message += "Generated with MealPlan AI 🤖";

            await Share.share({
                message,
            });
        } catch (error) {
            console.log('Share failed:', error);
        }
    };

    const handleSave = async () => {
        if (saving || saveSuccess) return;
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            await saveRecipe(selectedMeal);
            setSaveSuccess(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Trigger Rate My App check
            try {
                // Increment save count
                const savedCount = parseInt(await AsyncStorage.getItem('saved_recipes_count') || '0', 10) + 1;
                await AsyncStorage.setItem('saved_recipes_count', savedCount.toString());

                // Trigger review on 3rd save (and later, 20th etc)
                if (savedCount === 3 || savedCount === 20) {
                    if (await StoreReview.hasAction()) {
                        StoreReview.requestReview();
                    }
                }
            } catch (e) {
                // Ignore review errors, don't block user
                console.log("Review trigger error:", e);
            }

            setTimeout(() => {
                onClose(); // Close modal on success after delay
            }, 1500);
        } catch (error) {
            setSaveError(error.message || "Failed to save recipe");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={!!selectedMeal} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {!imageError && selectedMeal.image ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.heroImage}
                            onError={(e) => {
                                // Fallback silently or track in analytics
                                setImageError(true);
                            }}
                        />
                    ) : (
                        <Image source={{ uri: fallbackUrl }} style={[styles.heroImage]} />
                    )}
                    <View style={styles.modalHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.modalTitle} numberOfLines={1}>{selectedMeal.name}</Text>
                        </View>

                        {/* Share Button */}
                        <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                            <Text style={{ fontSize: 20 }}>📤</Text>
                        </TouchableOpacity>

                        {isImportedTemp && (
                            <TouchableOpacity
                                onPress={handleSave}
                                style={[styles.saveButton, (saving || saveSuccess) && { opacity: 0.7 }]}
                                disabled={saving || saveSuccess}
                            >
                                <Text style={styles.saveButtonText}>{saveSuccess ? "Saved!" : (saving ? "Saving..." : "Save")}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {saveError && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>⚠️ {saveError}</Text>
                        </View>
                    )}

                    {saveSuccess && (
                        <View style={styles.successBanner}>
                            <Text style={styles.successText}>✅ Saved! Find it in Settings {'>'} My Saved Recipes</Text>
                        </View>
                    )}

                    <ScrollView style={styles.modalScroll}>
                        {/* Content continues... */}
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
                                    if (!isPro && onUnlockPro) {
                                        onUnlockPro();
                                    }
                                }}
                            >
                                <LinearGradient
                                    colors={['#2A2A35', '#1E1E2E']}
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
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        <Text style={styles.sectionHeader}>Ingredients</Text>
                        <View style={styles.ingredientList}>
                            {selectedMeal.ingredients ? (
                                selectedMeal.ingredients.map((ing, i) => {
                                    const isChecked = !!checkedIngredients[i];
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            style={styles.ingredientRow}
                                            onPress={() => {
                                                Haptics.selectionAsync();
                                                setCheckedIngredients((prev) => ({
                                                    ...prev,
                                                    [i]: !prev[i],
                                                }));
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={isChecked ? 'checkbox' : 'square-outline'}
                                                size={20}
                                                color={isChecked ? '#4CAF50' : '#888'}
                                            />
                                            <Text style={[styles.ingredientText, isChecked && styles.ingredientTextChecked]}>
                                                {typeof ing === 'string' ? ing : `${ing.quantity} ${ing.name}`}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
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
    iconButton: {
        padding: 8,
        marginRight: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
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
        lineHeight: 20,
        flex: 1,
    },
    ingredientTextChecked: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
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
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    errorBanner: {
        margin: 20,
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 82, 82, 0.3)',
        borderRadius: 8,
        padding: 12,
    },
    errorText: {
        color: '#FF5252',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    successBanner: {
        margin: 20,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.3)',
        borderRadius: 8,
        padding: 12,
    },
    successText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
