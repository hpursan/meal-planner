import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from './App';

// Mocks
jest.mock('react-native-reanimated', () => {
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: {
            View: (props) => <View {...props} testID="reanimated-view" />,
            createAnimatedComponent: (c) => c,
        },
        FadeInUp: {},
        FadeOutDown: {},
        LayoutAnimation: {},
    };
});

jest.mock('expo-linear-gradient', () => {
    const { View } = require('react-native');
    return {
        LinearGradient: (props) => <View {...props} testID="linear-gradient" />
    };
});

describe('App', () => {
    it('renders correctly', () => {
        render(<App />);
        expect(screen.getByText('Meal Planner')).toBeTruthy();
        expect(screen.getByText('Design your perfect diet.')).toBeTruthy();
    });
});
