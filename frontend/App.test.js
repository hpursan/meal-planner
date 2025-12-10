import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

// Use fake timers to avoid teardown issues
jest.useFakeTimers();

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: {
            View: ({ entering, exiting, ...props }) => <View {...props} />,
            createAnimatedComponent: (c) => c,
        },
        FadeInUp: {},
        FadeOutDown: {},
        LayoutAnimation: {},
    };
});

// Mock LinearGradient
jest.mock('expo-linear-gradient', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        LinearGradient: (props) => <View {...props} />
    };
});

import App from './App';

describe('App', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree).toBeTruthy();
    });
});
