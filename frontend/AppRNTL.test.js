import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Layout from './app/_layout';
import { supabase } from './services/supabase';

// Mock variables
let mockSegments = [];
const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => {
    const React = require('react');
    const Stack = ({ children }) => <>{children}</>;
    Stack.Screen = () => null;
    return {
        useRouter: () => ({
            replace: mockReplace,
            push: mockPush,
            back: jest.fn(),
        }),
        useSegments: () => mockSegments,
        Slot: () => null,
        Stack: Stack,
    };
});



describe('App Layout Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSegments = []; // Default to root
        supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
    });

    it('redirects to Login when not logged in', async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

        render(<Layout />);

        await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
    });

    it('redirects to Home when logged in and on auth page', async () => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });
        mockSegments = ['login']; // Simulate being on login page

        render(<Layout />);

        await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
    });
});
