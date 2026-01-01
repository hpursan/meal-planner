import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../login';
import { supabase } from '../../services/supabase';

// 1. Mock Expo Router
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: mockReplace,
        back: mockBack,
        canGoBack: mockCanGoBack,
    }),
}));

// 2. Mock Supabase responses
describe('Auth Integration Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default router state
        mockCanGoBack.mockReturnValue(false);
    });

    it('submits login form and redirects on success', async () => {
        // Arrange: Mock success response
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: { session: { user: { id: '123' } } },
            error: null,
        });

        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        // Act
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(getByText('Sign In'));

        // Assert: API Call
        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });

        // Assert: Redirect
        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/');
        });
    });

    it('shows error UI on login failure', async () => {
        // Arrange: Mock failure response
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: { session: null },
            error: { message: 'Invalid credentials' },
        });

        const { getByPlaceholderText, getByText, queryByText } = render(<LoginScreen />);

        // Act
        fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
        fireEvent.press(getByText('Sign In'));

        // Assert: API Call
        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
        });

        // Assert: Error Message in CustomAlert
        // Note: CustomAlert renders the message text
        await waitFor(() => {
            expect(getByText('Invalid credentials')).toBeTruthy();
        });
    });
});
