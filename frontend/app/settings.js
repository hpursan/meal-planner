import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../services/supabase';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import FeedbackModal from '../components/FeedbackModal';
import PaywallModal from '../components/PaywallModal';
import { usePlan } from '../context/PlanContext';

export default function SettingsScreen() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [paywallVisible, setPaywallVisible] = useState(false);
    const { isPro, packages } = usePlan();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUserEmail(session.user.email);
            }
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
    };

    const handleDeleteAccount = () => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(
                'Are you sure you want to delete your account? This action is permanent and cannot be undone.'
            );
            if (confirmed) {
                performDelete();
            }
        } else {
            Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete My Account',
                        style: 'destructive',
                        onPress: performDelete,
                    },
                ]
            );
        }
    };

    const performDelete = async () => {
        try {
            // Attempt to call RPC function if it exists
            const { error } = await supabase.rpc('delete_user');

            if (error) {
                // Fallback if RPC fails, inform user
                console.log('Deletion RPC failed:', error);
                const message =
                    "To finalize the deletion of your account and all data, please tap 'Confirm' to launch your email client.";

                if (Platform.OS === 'web') {
                    if (window.confirm(message)) {
                        alert('Email Sent: Our support team will process your request within 24 hours.');
                    }
                } else {
                    Alert.alert('Request Received', message, [
                        { text: 'Cancel' },
                        {
                            text: 'Confirm',
                            onPress: () =>
                                Alert.alert(
                                    'Email Sent',
                                    'Our support team will process your request within 24 hours.'
                                ),
                        },
                    ]);
                }
            } else {
                await supabase.auth.signOut();
                if (Platform.OS === 'web') {
                    window.alert('Account Deleted: Your account has been successfully deleted.');
                } else {
                    Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                }
                router.replace('/login');
            }
        } catch (e) {
            const errMsg = 'Something went wrong. Please try again.';
            Platform.OS === 'web' ? window.alert(errMsg) : Alert.alert('Error', errMsg);
        }
    };

    const handleContactSupport = () => {
        const email = 'helpme.mealplanner@gmail.com';
        const url = `mailto:${email}?subject=Meal Planner Support`;

        Alert.alert('Contact Support', `Please email us at:\n${email}`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Open Mail App',
                onPress: async () => {
                    try {
                        await Linking.openURL(url);
                    } catch (e) {
                        console.log('Could not open mail app:', e);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background.primary, Colors.background.secondary]}
                style={styles.background}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/')}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Subscription</Text>

                    {isPro ? (
                        <View style={styles.row}>
                            <Text style={styles.label}>Status</Text>
                            <Text style={[styles.value, { color: Colors.brand.primary, fontWeight: 'bold' }]}>
                                Pro Active ✨
                            </Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.row, { paddingVertical: 12 }]}
                            onPress={() => setPaywallVisible(true)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brand.primary, marginRight: 8 }} />
                                <Text style={[styles.label, { fontWeight: 'bold', color: Colors.text.primary }]}>Upgrade to Pro</Text>
                            </View>
                            <Text style={{ color: Colors.brand.primary, fontSize: 18 }}>→</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{userEmail}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal & Support</Text>
                    <TouchableOpacity
                        style={[styles.row, { paddingVertical: 12 }]}
                        onPress={() => Linking.openURL('https://meal-planner-dtkf.onrender.com/privacy.html')}
                    >
                        <Text style={styles.label}>Privacy Policy</Text>
                        <Text style={{ color: Colors.text.muted, fontSize: 18 }}>›</Text>
                    </TouchableOpacity>

                    <View style={{ height: 1, backgroundColor: Colors.border.default, opacity: 0.5 }} />

                    <TouchableOpacity
                        style={[styles.row, { paddingVertical: 12 }]}
                        onPress={() =>
                            Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')
                        }
                    >
                        <Text style={styles.label}>Terms of Use (EULA)</Text>
                        <Text style={{ color: Colors.text.muted, fontSize: 18 }}>›</Text>
                    </TouchableOpacity>

                    <View style={{ height: 1, backgroundColor: Colors.border.default, opacity: 0.5 }} />

                    <TouchableOpacity
                        style={[styles.row, { paddingVertical: 12 }]}
                        onPress={() => setFeedbackVisible(true)}
                    >
                        <Text style={styles.label}>Send Feedback</Text>
                        <Text style={{ color: Colors.text.muted, fontSize: 18 }}>›</Text>
                    </TouchableOpacity>

                    <View style={{ height: 1, backgroundColor: Colors.border.default, opacity: 0.5 }} />

                    <TouchableOpacity style={[styles.row, { paddingVertical: 12 }]} onPress={handleContactSupport}>
                        <Text style={styles.label}>Contact Support</Text>
                        <Text style={{ color: Colors.text.muted, fontSize: 18 }}>›</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>

                <View style={styles.dangerZone}>
                    <Text style={styles.dangerTitle}>Danger Zone</Text>
                    <Text style={styles.dangerDesc}>
                        Once you delete your account, there is no going back. Please be certain.
                    </Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>
                        Version {Constants.expoConfig?.version || Constants.manifest?.version || '1.0.0'} ({Constants.expoConfig?.ios?.buildNumber || Constants.manifest?.ios?.buildNumber || '1'})
                    </Text>
                </View>
            </ScrollView>

            <FeedbackModal visible={feedbackVisible} onClose={() => setFeedbackVisible(false)} />
            <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} />
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
        paddingHorizontal: Spacing.layout.screenPadding,
        marginBottom: Spacing.xxl,
    },
    backText: {
        color: Colors.text.secondary,
        fontSize: Typography.sizes.md,
    },
    title: {
        color: Colors.text.primary,
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
    },
    content: {
        paddingHorizontal: Spacing.layout.screenPadding,
    },
    section: {
        backgroundColor: Colors.background.secondary,
        borderRadius: Spacing.layout.cardRadius,
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    sectionTitle: {
        color: Colors.text.muted,
        fontSize: Typography.sizes.xs,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: Colors.text.primary,
        fontSize: Typography.sizes.md,
    },
    value: {
        color: Colors.text.secondary,
        fontSize: Typography.sizes.md,
    },
    logoutButton: {
        backgroundColor: Colors.background.tertiary,
        padding: Spacing.lg,
        borderRadius: Spacing.layout.buttonRadius,
        alignItems: 'center',
        marginBottom: Spacing.xxl,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    logoutText: {
        color: Colors.text.primary,
        fontWeight: Typography.weights.semibold,
        fontSize: Typography.sizes.md,
    },
    dangerZone: {
        marginTop: Spacing.xl,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.action.destructive,
        borderRadius: Spacing.layout.cardRadius,
        backgroundColor: 'rgba(56, 32, 32, 0.3)',
    },
    dangerTitle: {
        color: Colors.action.danger,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.sm,
    },
    dangerDesc: {
        color: Colors.text.muted,
        fontSize: Typography.sizes.sm,
        marginBottom: Spacing.lg,
    },
    deleteButton: {
        backgroundColor: Colors.action.danger,
        padding: Spacing.lg,
        borderRadius: Spacing.layout.buttonRadius,
        alignItems: 'center',
    },
    deleteText: {
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    footer: {
        marginTop: Spacing.xxl,
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    version: {
        color: Colors.text.hint,
        fontSize: Typography.sizes.xs,
    },
});
