import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getMyRecipes } from '../services/api';
import RecipeModal from '../components/RecipeModal';

export default function MyRecipesScreen() {
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        setLoading(true);
        try {
            const data = await getMyRecipes();
            setRecipes(data);
        } catch (error) {
            Alert.alert("Error", "Failed to load your recipes.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        const imageUrl = item.image.startsWith('http')
            ? item.image
            : `${process.env.EXPO_PUBLIC_API_URL || 'https://meal-planner-dtkf.onrender.com'}${item.image}`;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => setSelectedRecipe(item)}
            >
                <Image source={{ uri: imageUrl }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.tagRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.type || 'Meal'}</Text>
                        </View>
                        {item.calories && (
                            <Text style={styles.calText}>{item.calories} kcal</Text>
                        )}
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" style={{ marginRight: 10 }} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Recipes</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#BB86FC" />
                </View>
            ) : recipes.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="book-outline" size={64} color="#666" />
                    <Text style={styles.emptyText}>No saved recipes yet.</Text>
                    <Text style={styles.subEmptyText}>Import recipes using AI to build your library.</Text>
                </View>
            ) : (
                <FlatList
                    data={recipes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}

            <RecipeModal
                selectedMeal={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                isPro={true} // Always allow full view for owned recipes
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 8,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subEmptyText: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#1E1E2E',
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        height: 80,
    },
    cardImage: {
        width: 80,
        height: 80,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    badge: {
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeText: {
        color: '#CCC',
        fontSize: 12,
    },
    calText: {
        color: '#888',
        fontSize: 12,
    },
});
