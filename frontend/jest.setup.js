
// Mock Async Storage
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock Expo Linear Gradient
jest.mock('expo-linear-gradient', () => ({
    LinearGradient: 'LinearGradient'
}));

// Mock Supabase
jest.mock('./services/supabase', () => ({
    supabase: {
        auth: {
            getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
            signInWithPassword: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
        },
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
        })),
    }
}));

// Mock API
jest.mock('./services/api', () => ({
    generatePlan: jest.fn(),
    swapMeal: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// Mock removed

