import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const PlanContext = createContext();

const CACHE_KEY_PLAN = 'cached_plan_data';
const CACHE_KEY_CHECKED = 'cached_checked_items';

export function PlanProvider({ children }) {
    const [plan, setPlan] = useState([]);
    const [days, setDays] = useState('7');
    const [planName, setPlanName] = useState('');
    const [selectedPrefs, setSelectedPrefs] = useState([]);
    const [meatFreeDays, setMeatFreeDays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [planId, setPlanId] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});
    const [isOfflineMode, setIsOfflineMode] = useState(false); // "Cached Mode"
    const [isOnline, setIsOnline] = useState(true); // "Network State"

    // Network Status Listener
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(!!state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    // Persistence Effect: Save to Cache whenever critical data changes
    useEffect(() => {
        const cacheData = async () => {
            try {
                if (plan.length > 0) {
                    await AsyncStorage.setItem(CACHE_KEY_PLAN, JSON.stringify({
                        plan,
                        days,
                        planName,
                        selectedPrefs,
                        meatFreeDays,
                        planId // We cache ID too, though it might not sync if offline
                    }));
                }
                if (Object.keys(checkedItems).length > 0) {
                    await AsyncStorage.setItem(CACHE_KEY_CHECKED, JSON.stringify(checkedItems));
                }
            } catch (e) {
                console.log('Failed to cache plan data', e);
            }
        };
        cacheData();
    }, [plan, checkedItems, planId]);

    // Function to attempt loading from cache (used on startup or error)
    const loadFromCache = async () => {
        try {
            const cachedPlan = await AsyncStorage.getItem(CACHE_KEY_PLAN);
            const cachedChecked = await AsyncStorage.getItem(CACHE_KEY_CHECKED);

            if (cachedPlan) {
                const data = JSON.parse(cachedPlan);
                setPlan(data.plan || []);
                setDays(data.days || '7');
                setPlanName(data.planName || '');
                setSelectedPrefs(data.selectedPrefs || []);
                setMeatFreeDays(data.meatFreeDays || []);
                setPlanId(data.planId || null);
            }

            if (cachedChecked) {
                setCheckedItems(JSON.parse(cachedChecked));
            }

            if (cachedPlan) {
                setIsOfflineMode(true);
                return true; // Success finding cache
            }
        } catch (e) {
            console.error("Failed to load cache", e);
        }
        return false;
    };

    // Helper to clear plan
    const clearPlan = async () => {
        setPlan([]);
        setPlanId(null);
        setCheckedItems({});
        setDays('7');
        setPlanName('');
        setSelectedPrefs([]);
        setMeatFreeDays([]);
        setIsOfflineMode(false);
        try {
            await AsyncStorage.removeItem(CACHE_KEY_PLAN);
            await AsyncStorage.removeItem(CACHE_KEY_CHECKED);
        } catch (e) { }
    };

    return (
        <PlanContext.Provider value={{
            plan, setPlan,
            planId, setPlanId,
            checkedItems, setCheckedItems,
            days, setDays,
            planName, setPlanName,
            selectedPrefs, setSelectedPrefs,
            meatFreeDays, setMeatFreeDays,
            loading, setLoading,
            clearPlan,
            loadFromCache,
            isOfflineMode, setIsOfflineMode,
            isOnline, setIsOnline
        }}>
            {children}
        </PlanContext.Provider>
    );
}

export function usePlan() {
    return useContext(PlanContext);
}
