import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../services/supabase';
import { usePlan } from '../context/PlanContext';
import CustomAlert from './CustomAlert';

export default function PlanHistoryView({ userId, onLoadPlan, onBack }) {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });
    const { isOnline } = usePlan();

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchHistory = async () => {
                if (!userId) return;
                setLoading(true);

                const { data, error } = await supabase
                    .from('saved_plans')
                    .select('id, name, created_at, plan_data, checked_items')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (isActive) {
                    if (error) {
                        // Check for network error likely causes
                        console.log('History fetch error:', error);
                        // Don't show Alert for network errors, just empty state with message
                        setPlans([]);
                        if (
                            error.message &&
                            (error.message.includes('Load failed') || error.message.includes('Network request failed'))
                        ) {
                            // Silent fail or toast
                        } else {
                            showAlert('Error', error.message);
                        }
                    } else {
                        setPlans(data || []);
                    }
                    setLoading(false);
                }
            };

            fetchHistory();

            return () => {
                isActive = false;
            };
        }, [userId, isOnline])
    );

    const showAlert = (title, message, buttons = []) => {
        setAlertConfig({ visible: true, title, message, buttons });
    };

    const closeAlert = () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
    };

    const deletePlan = (id) => {
        showAlert('Delete Plan', 'Are you sure you want to delete this plan? This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    closeAlert();
                    const { data, error } = await supabase.from('saved_plans').delete().eq('id', id).select();
                    if (error) {
                        setTimeout(() => showAlert('Error', 'Failed to delete: ' + error.message), 300);
                    } else if (!data || data.length === 0) {
                        setTimeout(() => showAlert('Error', 'Could not delete. Check DB permissions.'), 300);
                    } else {
                        setPlans((prev) => prev.filter((p) => p.id !== id));
                    }
                },
            },
        ]);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity style={styles.mainClickable} onPress={() => onLoadPlan(item)}>
                <View style={styles.iconContainer}>
                    <Ionicons name="calendar-outline" size={24} color="#BB86FC" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.planName} numberOfLines={1}>
                        {item.name || 'Untitled Plan'}
                    </Text>
                    <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
                onPress={() => deletePlan(item.id)}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.title}>My Plans</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <ActivityIndicator testID="loading-spinner" color="#BB86FC" size="large" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={plans}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="albums-outline" size={64} color="#333" />
                            <Text style={styles.emptyText}>No saved plans yet.</Text>
                        </View>
                    }
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
        maxWidth: 800,
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60, // Consistent with other screens
        marginBottom: 20,
    },
    title: {
        fontSize: 20, // Reduced from 24 to match MyRecipes
        fontWeight: 'bold',
        color: '#FFF',
    },
    backButton: {
        padding: 8,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#1E1E2E',
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        height: 72, // Fixed comfortable height
        paddingRight: 16, // Padding for delete button
    },
    mainClickable: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        paddingLeft: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(187, 134, 252, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 10,
    },
    planName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    date: {
        color: '#888',
        fontSize: 12,
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: '#333',
        marginHorizontal: 8,
    },
    deleteButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        opacity: 0.5,
    },
    emptyText: {
        color: '#888',
        marginTop: 16,
        fontSize: 16,
    },
});
