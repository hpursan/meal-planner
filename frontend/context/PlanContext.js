import React, { createContext, useState, useContext } from 'react';

const PlanContext = createContext();

export function PlanProvider({ children }) {
    const [plan, setPlan] = useState([]);
    const [days, setDays] = useState('7');
    const [planName, setPlanName] = useState('');
    const [selectedPrefs, setSelectedPrefs] = useState([]);
    const [meatFreeDays, setMeatFreeDays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [planId, setPlanId] = useState(null);

    // Helper to clear plan
    const clearPlan = () => {
        setPlan([]);
        setPlanId(null);
        setDays('7');
        setPlanName('');
        setSelectedPrefs([]);
        setMeatFreeDays([]);
    };

    return (
        <PlanContext.Provider value={{
            plan, setPlan,
            planId, setPlanId,
            days, setDays,
            planName, setPlanName,
            selectedPrefs, setSelectedPrefs,
            meatFreeDays, setMeatFreeDays,
            loading, setLoading,
            clearPlan
        }}>
            {children}
        </PlanContext.Provider>
    );
}

export function usePlan() {
    return useContext(PlanContext);
}
