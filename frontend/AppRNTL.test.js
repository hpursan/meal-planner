import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import App from './App';
import { supabase } from './services/supabase';

describe('App Integration', () => {
    it('renders Auth screen when not logged in', async () => {
        // Mock no session
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

        render(<App />);

        // Wait for async effect
        await waitFor(() => expect(screen.getByText('Welcome')).toBeTruthy());
        expect(screen.getByText('Sign in to save your plans.')).toBeTruthy();
    });

    it('renders Planner screen when logged in', async () => {
        // Mock active session
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });

        render(<App />);

        await waitFor(() => expect(screen.getByText('Meal Planner')).toBeTruthy());
        expect(screen.getByText('Design your perfect diet.')).toBeTruthy();
    });

    it('navigates to History and back', async () => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });

        // Mock history fetch and loadLatestPlan
        supabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: null }), // loadLatestPlan returns nothing
            // For history fetch which might not use limit/single but just order:
            then: (resolve) => resolve({ data: [], error: null })
        });

        render(<App />);
        await waitFor(() => expect(screen.getByText('My Plans')).toBeTruthy());

        // Navigate to History
        fireEvent.press(screen.getByText('My Plans'));

        // Check for History Header
        await waitFor(() => expect(screen.getByText('← Back')).toBeTruthy());

        // Navigate Back
        fireEvent.press(screen.getByText('← Back'));

        // Check for Input Form
        await waitFor(() => expect(screen.getByText('Design your perfect diet.')).toBeTruthy());
    });
});
