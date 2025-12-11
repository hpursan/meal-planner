import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
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
            Alert.alert("Error", "Could not fetch history.");
        } else {
            setPlans(data || []);
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onLoadPlan(item)}
        >
            <View>
                <Text style={styles.planName}>{item.name || "Untitled Plan"}</Text>
                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
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
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
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
    arrow: {
        color: '#BB86FC',
        fontSize: 24,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
