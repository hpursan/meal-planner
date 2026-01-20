import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';

const API_KEYS = {
    ios: process.env.EXPO_PUBLIC_RC_KEY_IOS || 'appl_jHlXOVmnbFquXCvaIQbAFzszaNO',
    android: process.env.EXPO_PUBLIC_RC_KEY_ANDROID,
};

export const PurchasesService = {
    async init() {
        try {
            if (Platform.OS === 'ios') {
                await Purchases.configure({ apiKey: API_KEYS.ios });
            } else if (Platform.OS === 'android') {
                if (API_KEYS.android) {
                    await Purchases.configure({ apiKey: API_KEYS.android });
                } else {
                    console.warn('RevenueCat Android API Key is missing');
                }
            }
        } catch (e) {
            console.error('RC Init Error', e);
            Sentry.captureException(e);
        }
    },

    async getOfferings() {
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.current !== null) {
                return offerings.current.availablePackages;
            }
        } catch (e) {
            console.error('Error fetching offerings', e);
            Sentry.captureException(e);
        }
        return [];
    },

    async getCustomerInfo() {
        try {
            return await Purchases.getCustomerInfo();
        } catch (e) {
            console.error('Error fetching customer info', e);
            return null;
        }
    },

    async purchasePackage(pkg) {
        try {
            const { customerInfo } = await Purchases.purchasePackage(pkg);
            return customerInfo;
        } catch (e) {
            if (!e.userCancelled) {
                console.error('Purchase error', e);
                throw e; // Re-throw for UI handling
            }
            return null; // User cancelled
        }
    },

    async restorePurchases() {
        try {
            const customerInfo = await Purchases.restorePurchases();
            return customerInfo;
        } catch (e) {
            console.error('Restore error', e);
            throw e;
        }
    },

    // Helper to check if user has active entitlement
    isPro(customerInfo) {
        if (!customerInfo || !customerInfo.entitlements.active) return false;
        // Check for 'pro' entitlement (RevenueCat key)
        // If your key is 'MealPlanner Pro', accessing it might be keys['MealPlanner Pro']
        // Best practice: Use a constant identifier in RevenueCat dashboard like 'pro' or 'premium'
        // For now, checks if ANY active entitlement exists or specifically 'pro'

        // Note: The Dashboard showed "MealPlanner Pro" as NAME. The Identifier might be different.
        // Usually safe to check if Object.keys(active).length > 0 if we only have 1 entitlement.
        return Object.keys(customerInfo.entitlements.active).length > 0;
    },
};
