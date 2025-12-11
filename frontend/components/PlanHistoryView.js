import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
import { supabase } from '../services/supabase';

export default function PlanHistoryView({ userId, onLoadPlan, onBack }) {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('saved_plans')
            .select('id, name, created_at, plan_data')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            alert(error.message);
        } else {
            setPlans(data || []);
        }
        setLoading(false);
    };

    const deletePlan = async (id) => {
        const confirmDelete = async () => {
            const { data, error } = await supabase.from('saved_plans').delete().eq('id', id).select();
            if (error) {
                alert("Failed to delete plan: " + error.message);
            } else if (!data || data.length === 0) {
                alert("Could not delete plan. check your database permissions.");
                // Verify RLS policy for DELETE exists
            } else {
                setPlans(plans.filter(p => p.id !== id));
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm("Are you sure you want to delete this plan?")) {
                confirmDelete();
            }
        } else {
            Alert.alert(
                "Delete Plan",
                "Are you sure you want to delete this plan?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: confirmDelete }
                ]
            );
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => onLoadPlan(item)}
            >
                <View>
                    <Text style={styles.planName}>{item.name || "Untitled Plan"}</Text>
                    <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deletePlan(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>🗑</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>My Plans</Text>
                <View style={{ width: 60 }} />
            </View>

            {loading ? (
                <ActivityIndicator testID="loading-spinner" color="#BB86FC" size="large" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={plans}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No saved plans yet.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        maxWidth: 800, // web polish: max width
        alignSelf: 'center', // web polish: center
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        color: '#AAA',
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#1E1E2E',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    deleteButton: {
        padding: 16,
        backgroundColor: '#382020',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: {
        fontSize: 20,
    },
    planName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    date: {
        color: '#888',
        fontSize: 12,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
