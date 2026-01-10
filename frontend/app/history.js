import { View, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import PlanHistoryView from '../components/PlanHistoryView';
import { usePlan } from '../context/PlanContext';
import { supabase } from '../services/supabase';
import { useState, useEffect } from 'react';
import PaywallModal from '../components/PaywallModal';

export default function HistoryScreen() {
    const router = useRouter();
    const { setPlan, setPlanId, setPlanName, setCheckedItems, isPro } = usePlan();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paywallVisible, setPaywallVisible] = useState(false);

    useEffect(() => {
        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setUserId(session.user.id);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) setUserId(session.user.id);
            else setUserId(null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLoadPlan = (historyItem) => {
        setPlan(historyItem.plan_data);
        setPlanId(historyItem.id);
        setPlanName(historyItem.name);
        setCheckedItems(historyItem.checked_items || {});
        router.push('/results');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#121212', '#1E1E2E']} style={styles.background} />
            <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
                {loading ? (
                    <Text style={{ color: 'white' }}>Loading...</Text>
                ) : !userId ? (
                    <View style={styles.centerContent}>
                        <Text style={styles.messageText}>Please sign in to view your plans.</Text>
                        <TouchableOpacity onPress={() => router.push('/login')} style={styles.actionButton}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                            <Text style={{ color: '#888' }}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                ) : !isPro ? (
                    <View style={styles.centerContent}>
                        <Text style={{ fontSize: 50, marginBottom: 20 }}>🔒</Text>
                        <Text style={styles.titleText}>History Locked</Text>
                        <Text style={styles.messageText}>Upgrade to Pro to save and access your past meal plans.</Text>
                        <TouchableOpacity
                            onPress={() => setPaywallVisible(true)}
                            style={[styles.actionButton, { backgroundColor: '#BB86FC' }]}
                        >
                            <Text style={styles.buttonText}>Unlock History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                            <Text style={{ color: '#888' }}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <PlanHistoryView userId={userId} onLoadPlan={handleLoadPlan} onBack={() => router.back()} />
                )}
            </View>
            <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} />
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
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageText: {
        color: '#CCC',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        maxWidth: 300,
        lineHeight: 24,
    },
    titleText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    actionButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
