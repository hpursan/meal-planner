import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
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
        supabase.auth.getSession.mockResolvedValueOnce({
            data: { session: { user: { id: '123' } } }
        });

        render(<App />);

        await waitFor(() => expect(screen.getByText('Meal Planner')).toBeTruthy());
        expect(screen.getByText('Design your perfect diet.')).toBeTruthy();
    });
});
