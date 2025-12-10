import React from 'react';
import { View, Text } from 'react-native';
import renderer from 'react-test-renderer';

describe('Sanity Check', () => {
    it('renders a View with Text', () => {
        console.log('View:', View);
        const tree = renderer.create(<View><Text>Hello</Text></View>).toJSON();
        expect(tree).toBeTruthy();
        expect(tree.type).toBe('View');
    });
});
