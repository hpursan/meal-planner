import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlan } from '../context/PlanContext';
import { getRecipesMetadata } from '../services/api';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

export default function ExcludedRecipesScreen() {
    const router = useRouter();
    const { excludedIds, restoreRecipe } = usePlan();
    const [allMetadata, setAllMetadata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            setLoading(true);
            const data = await getRecipesMetadata();
            setAllMetadata(data);
        } catch (e) {
            console.error('Failed to fetch recipe metadata', e);
            setError('Failed to load recipe names. You can still restore by ID below.');
        } finally {
            setLoading(false);
        }
    };

    const excludedRecipes = allMetadata.filter(r => excludedIds.includes(r.id));

    // Catch-all for IDs that aren't in the metadata (e.g. newly added or custom)
    const danglingIds = excludedIds.filter(id => !allMetadata.some(r => r.id === id));

    const handleRestoreAll = () => {
        Alert.alert(
            "Restore All Recipes?",
            "This will clear your blacklist. All recipes will be eligible for future plans.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Restore All",
                    onPress: () => {
                        excludedIds.forEach(id => restoreRecipe(id));
                        router.back();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background.primary, Colors.background.secondary]}
                style={styles.background}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Excluded Recipes</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.brand.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.description}>
                        Recipes listed here will never appear in your generated meal plans.
                        Tap "Restore" to make them available again.
                    </Text>

                    {excludedIds.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={{ fontSize: 40, marginBottom: 16 }}>🍃</Text>
                            <Text style={styles.emptyText}>Your blacklist is empty!</Text>
                            <Text style={styles.emptySubText}>All 100 recipes are currently available for your plans.</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.section}>
                                {excludedRecipes.map((recipe) => (
                                    <View key={recipe.id} style={styles.row}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.recipeName}>{recipe.name}</Text>
                                            <Text style={styles.recipeId}>ID: {recipe.id}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.restoreButton}
                                            onPress={() => restoreRecipe(recipe.id)}
                                        >
                                            <Text style={styles.restoreButtonText}>Restore</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                {danglingIds.map((id) => (
                                    <View key={id} style={styles.row}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.recipeName}>Unknown Recipe</Text>
                                            <Text style={styles.recipeId}>ID: {id}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.restoreButton}
                                            onPress={() => restoreRecipe(id)}
                                        >
                                            <Text style={styles.restoreButtonText}>Restore</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.restoreAllButton} onPress={handleRestoreAll}>
                                <Text style={styles.restoreAllText}>Restore All Recipes</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
        paddingTop: 60,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    backText: {
        color: Colors.text.secondary,
        fontSize: 16,
    },
    title: {
        color: Colors.text.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    description: {
        color: Colors.text.muted,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
        textAlign: 'center',
    },
    section: {
        backgroundColor: Colors.background.secondary,
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    recipeName: {
        color: Colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    recipeId: {
        color: Colors.text.hint,
        fontSize: 12,
    },
    restoreButton: {
        backgroundColor: 'rgba(187, 134, 252, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(187, 134, 252, 0.3)',
    },
    restoreButtonText: {
        color: Colors.brand.primary,
        fontSize: 13,
        fontWeight: 'bold',
    },
    restoreAllButton: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        marginTop: 10,
    },
    restoreAllText: {
        color: Colors.text.secondary,
        fontWeight: '600',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: Colors.text.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubText: {
        color: Colors.text.muted,
        fontSize: 14,
        textAlign: 'center',
    },
});
