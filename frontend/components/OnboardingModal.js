import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import OnboardingSurvey from './OnboardingSurvey';

export default function OnboardingModal({ visible, onComplete }) {
    if (!visible) return null;

    return (
        <Modal animationType="slide" transparent={false} visible={visible}>
            <View style={styles.container}>
                <OnboardingSurvey onComplete={onComplete} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
