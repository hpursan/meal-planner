import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PlanHistoryView from './PlanHistoryView';
import { supabase } from '../services/supabase';

jest.mock('../context/PlanContext', () => ({
    usePlan: () => ({ isOnline: true })
}));

jest.mock('expo-router', () => {
    const React = require('react');
    return {
        useFocusEffect: (cb) => React.useEffect(cb, []),
        useRouter: () => ({
            push: jest.fn(),
            back: jest.fn(),
        }),
    };
});

describe('PlanHistoryView', () => {
    const mockOnLoad = jest.fn();
    const mockOnBack = jest.fn();
    const userId = 'user-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches and displays plans', async () => {
        // Mock Supabase response
        const mockPlans = [
            { id: '1', name: 'Keto Week 1', created_at: '2023-01-01T10:00:00Z', plan_data: {} },
            { id: '2', name: 'Vegan Detox', created_at: '2023-01-02T10:00:00Z', plan_data: {} }
        ];

        supabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockPlans, error: null }), // Chain ends here
        });

        render(<PlanHistoryView userId={userId} onLoadPlan={mockOnLoad} onBack={mockOnBack} />);

        // Verify Loading State
        expect(screen.getByTestId('loading-spinner')).toBeTruthy();

        // Wait for data
        await waitFor(() => expect(screen.getByText('Keto Week 1')).toBeTruthy());
        expect(screen.getByText('Vegan Detox')).toBeTruthy();
    });

    it('calls onLoadPlan when a plan is tapped', async () => {
        const mockPlans = [
            { id: '1', name: 'Keto Week 1', created_at: '2023-01-01T10:00:00Z', plan_data: { foo: 'bar' } }
        ];

        supabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockPlans, error: null }),
        });

        render(<PlanHistoryView userId={userId} onLoadPlan={mockOnLoad} onBack={mockOnBack} />);

        await waitFor(() => expect(screen.getByText('Keto Week 1')).toBeTruthy());

        // Tap the plan
        fireEvent.press(screen.getByText('Keto Week 1'));

        expect(mockOnLoad).toHaveBeenCalledWith(mockPlans[0]);
    });
});
