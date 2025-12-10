import React from 'react';
// Do not import from react-native yet to avoid hoisting issues if we mock it
import renderer from 'react-test-renderer';

jest.mock('react-native', () => {
    const React = require('react');
    return {
        View: (props) => React.createElement('View', props, props.children),
        Text: (props) => React.createElement('Text', props, props.children),
    };
});

const { View, Text } = require('react-native');

describe('Sanity Check Mocked', () => {
    it('renders a View with Text', () => {
        const tree = renderer.create(<View><Text>Hello</Text></View>).toJSON();
        expect(tree).toBeTruthy();
        expect(tree.type).toBe('View');
    });
});
