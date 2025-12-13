import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';
import CustomAlert from './CustomAlert';

export default function PlanHistoryView({ userId, onLoadPlan, onBack }) {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('saved_plans')
            .select('id, name, created_at, plan_data, checked_items')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            showAlert("Error", error.message);
        } else {
            setPlans(data || []);
        }
        setLoading(false);
    };

    const showAlert = (title, message, buttons = []) => {
        setAlertConfig({ visible: true, title, message, buttons });
    };

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    const deletePlan = (id) => {
        showAlert(
            "Delete Plan",
            "Are you sure you want to delete this plan? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        closeAlert();
                        const { data, error } = await supabase.from('saved_plans').delete().eq('id', id).select();
                        if (error) {
                            setTimeout(() => showAlert("Error", "Failed to delete: " + error.message), 300);
                        } else if (!data || data.length === 0) {
                            setTimeout(() => showAlert("Error", "Could not delete. Check DB permissions."), 300);
                        } else {
                            setPlans(prev => prev.filter(p => p.id !== id));
                        }
                    }
                }
            ]
        );
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

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onClose={closeAlert}
            />
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
