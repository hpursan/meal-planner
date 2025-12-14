import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';

export default function RecipeModal({ selectedMeal, onClose }) {
    const [imageError, setImageError] = useState(false);

    // Reset error state when meal changes
    useEffect(() => {
        setImageError(false);
    }, [selectedMeal]);

    if (!selectedMeal) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={!!selectedMeal}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {!imageError && selectedMeal.image ? (
                        <Image
                            source={{ uri: selectedMeal.image }}
                            style={styles.heroImage}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <View style={[styles.heroImage, styles.heroPlaceholder]}>
                            <Text style={{ fontSize: 40 }}>🍽️</Text>
                        </View>
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
                            {selectedMeal.tags && selectedMeal.tags.slice(0, 3).map((tag, i) => (
                                <View key={i} style={styles.tagBadge}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.sectionHeader}>Ingredients</Text>
                        <View style={styles.ingredientList}>
                            {selectedMeal.ingredients ? selectedMeal.ingredients.map((ing, i) => (
                                <Text key={i} style={styles.ingredientText}>
                                    • {typeof ing === 'string' ? ing : `${ing.quantity} ${ing.name}`}
                                </Text>
                            )) : <Text style={styles.ingredientText}>No ingredients listed.</Text>}
                        </View>

                        <Text style={styles.sectionHeader}>Instructions</Text>
                        <View style={styles.instructionList}>
                            {selectedMeal.instructions ? selectedMeal.instructions.map((step, i) => (
                                <View key={i} style={styles.stepRow}>
                                    <Text style={styles.stepNum}>{i + 1}</Text>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            )) : <Text style={styles.stepText}>No instructions available.</Text>}
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
});
