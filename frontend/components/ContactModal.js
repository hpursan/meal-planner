import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import * as Clipboard from 'expo-clipboard';

export default function ContactModal({ visible, onClose }) {
    const supportEmail = 'helpme.mealplanner@gmail.com';

    const handleOpenMail = async () => {
        const url = `mailto:${supportEmail}?subject=Meal Planner Support`;
        try {
            await Linking.openURL(url);
            onClose();
        } catch (e) {
            console.log('Could not open mail app:', e);
        }
    };

    const handleCopyEmail = async () => {
        await Clipboard.setStringAsync(supportEmail);
        alert('Email copied to clipboard!');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Contact Support</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Need help? Have a question? We're here for you.
                    </Text>

                    <View style={styles.emailContainer}>
                        <Text style={styles.label}>Support Email:</Text>
                        <TouchableOpacity onPress={handleCopyEmail}>
                            <Text style={styles.emailText}>{supportEmail}</Text>
                            <Text style={styles.copyHint}>(Tap to copy)</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleOpenMail}>
                        <Text style={styles.primaryButtonText}>Open Mail App</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.background.secondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: Spacing.xl,
        paddingBottom: 40,
        width: '100%',
        minHeight: 320,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    closeButton: {
        padding: Spacing.sm,
    },
    closeText: {
        color: Colors.text.secondary,
        fontSize: 20,
    },
    subtitle: {
        color: Colors.text.secondary,
        marginBottom: Spacing.xl,
        fontSize: Typography.sizes.md,
        lineHeight: 24,
    },
    emailContainer: {
        backgroundColor: Colors.background.tertiary,
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    label: {
        color: Colors.text.muted,
        fontSize: Typography.sizes.sm,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    emailText: {
        color: Colors.brand.primary, // Using brand color for link-like appearance
        fontSize: Typography.sizes.lg,
        fontWeight: '600',
        marginBottom: 4,
    },
    copyHint: {
        color: Colors.text.hint,
        fontSize: Typography.sizes.xs,
    },
    primaryButton: {
        backgroundColor: Colors.action.primary,
        paddingVertical: Spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: Typography.sizes.md,
    },
});
