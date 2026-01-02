import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { usePlan } from '../context/PlanContext';
import * as WebBrowser from 'expo-web-browser';

// Placeholder Mock Data for Dev (until Apple Config is done)
const MOCK_PACKAGES = [
    {
        identifier: '$rc_monthly',
        product: {
            title: 'Monthly Subscription',
            description: 'Unlock unlimited plans',
            priceString: '$4.99',
            period: 'P1M',
        },
    },
    {
        identifier: '$rc_annual',
        product: {
            title: 'Yearly Subscription',
            description: 'Save 50%',
            priceString: '$29.99', // Best Value
            period: 'P1Y',
        },
    },
    {
        identifier: '$rc_lifetime',
        product: {
            title: 'Lifetime Access',
            description: 'One-time payment',
            priceString: '$99.99',
            period: 'LIFETIME',
        },
    }
];

export default function PaywallModal({ visible, onClose }) {
    const { packages, purchasePackage, restorePurchases, isPro, isRestoring } = usePlan();
    const [purchasing, setPurchasing] = useState(null); // Identifier of pkg being bought

    // Use Context Packages if available, otherwise MOCK (for UI Dev)
    // NOTE: In Production, filter out unknown packages logic
    const displayPackages = packages.length > 0 ? packages : MOCK_PACKAGES;

    const handlePurchase = async (pkg) => {
        setPurchasing(pkg.identifier);
        const success = await purchasePackage(pkg);
        setPurchasing(null);
        if (success) onClose();
    };

    const handleRestore = async () => {
        await restorePurchases();
        // Toast or specific alerting happens in context or here
        if (isPro) onClose();
    };

    const openTerms = () => WebBrowser.openBrowserAsync('https://your-terms-url.com');
    const openPrivacy = () => WebBrowser.openBrowserAsync('https://your-privacy-url.com');

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <LinearGradient colors={['#1E1E2E', '#121212']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scroll}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.emoji}>✨</Text>
                        <Text style={styles.title}>Unlock Full Access</Text>
                        <Text style={styles.subtitle}>
                            Remove limits. Plan for 30 days. No Ad interruptions.
                        </Text>
                    </View>

                    {/* Features List */}
                    <View style={styles.features}>
                        <FeatureRow icon="📅" text="Plan up to 30 Days" />
                        <FeatureRow icon="🍲" text="Unlimited Meal Swaps" />
                        <FeatureRow icon="🧠" text="Advanced AI Customization" />
                        <FeatureRow icon="☁️" text="Cloud Sync & Backup" />
                    </View>

                    {/* Products */}
                    <View style={styles.products}>
                        {displayPackages.map((pkg) => {
                            const isAnnual = pkg.product.period === 'P1Y';
                            return (
                                <TouchableOpacity
                                    key={pkg.identifier}
                                    style={[styles.productCard, isAnnual && styles.bestValueCard]}
                                    onPress={() => handlePurchase(pkg)}
                                    disabled={!!purchasing}
                                >
                                    {isAnnual && <View style={styles.badge}><Text style={styles.badgeText}>BEST VALUE</Text></View>}
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productTitle}>{pkg.product.title.replace(/\s*\(.*\)/, '') || 'Subscription'}</Text>
                                        <Text style={styles.productPrice}>{pkg.product.priceString}</Text>
                                    </View>
                                    <Text style={styles.productDesc}>{pkg.product.description}</Text>

                                    {purchasing === pkg.identifier && <ActivityIndicator style={{ marginTop: 10 }} color="#FFF" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Restore & Legal */}
                    <TouchableOpacity onPress={handleRestore} disabled={isRestoring} style={styles.restoreBtn}>
                        <Text style={styles.restoreText}>{isRestoring ? 'Restoring...' : 'Restore Purchases'}</Text>
                    </TouchableOpacity>

                    <View style={styles.legalRow}>
                        <TouchableOpacity onPress={openTerms}><Text style={styles.legalText}>Terms</Text></TouchableOpacity>
                        <Text style={styles.legalText}> • </Text>
                        <TouchableOpacity onPress={openPrivacy}><Text style={styles.legalText}>Privacy</Text></TouchableOpacity>
                    </View>

                    {/* Close (X) */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>Maybe Later</Text>
                    </TouchableOpacity>

                </ScrollView>
            </LinearGradient>
        </Modal>
    );
}

function FeatureRow({ icon, text }) {
    return (
        <View style={styles.featureRow}>
            <View style={styles.iconContainer}><Text style={{ fontSize: 20 }}>{icon}</Text></View>
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 24, paddingBottom: 60, alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 32, marginTop: 40 },
    emoji: { fontSize: 60, marginBottom: 16 },
    title: { fontSize: 32, fontWeight: '800', color: '#FFF', textAlign: 'center', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#AAA', textAlign: 'center', lineHeight: 24, maxWidth: 300 },

    features: { width: '100%', marginBottom: 40 },
    featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    iconContainer: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center', alignItems: 'center', marginRight: 16
    },
    featureText: { color: '#EEE', fontSize: 16, fontWeight: '500' },

    products: { width: '100%', marginBottom: 24 },
    productCard: {
        backgroundColor: '#2A2A35', borderRadius: 16, padding: 20, marginBottom: 16,
        borderWidth: 1, borderColor: '#333',
    },
    bestValueCard: {
        borderColor: '#BB86FC', borderWidth: 2, backgroundColor: '#32283E',
    },
    badge: {
        position: 'absolute', top: -12, right: 16, backgroundColor: '#BB86FC',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    badgeText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
    productInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    productTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    productPrice: { color: '#FFF', fontSize: 18, fontWeight: '600' },
    productDesc: { color: '#AAA', fontSize: 14 },

    restoreBtn: { padding: 12, marginBottom: 24 },
    restoreText: { color: '#AAA', fontSize: 14, textDecorationLine: 'underline' },

    legalRow: { flexDirection: 'row', marginBottom: 32, opacity: 0.6 },
    legalText: { color: '#666', fontSize: 12 },

    closeButton: { marginTop: 0 },
    closeText: { color: '#666', fontSize: 16, fontWeight: '500' },
});
