import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import { supabase } from '../services/supabase';

export default function FeedbackModal({ visible, onClose }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim()) {
            Alert.alert('Empty Feedback', 'Please type a message before sending.');
            return;
        }

        setLoading(true);
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const userId = session?.user?.id || null;

            const { error } = await supabase.from('feedback').insert([
                {
                    message: message.trim(),
                    user_id: userId,
                },
            ]);

            if (error) throw error;

            Alert.alert('Thank You!', 'Your feedback has been received.');
            setMessage('');
            onClose();
        } catch (error) {
            console.error('Feedback error:', error);
            Alert.alert('Error', 'Failed to send feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Send Feedback</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>We're still improving! Spot a bug or have an idea? Let us know so we can make this the best meal planner for you.</Text>

                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="Type your feedback here..."
                        placeholderTextColor={Colors.text.hint}
                        value={message}
                        onChangeText={setMessage}
                        textAlignVertical="top"
                    />

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.text.primary} />
                        ) : (
                            <Text style={styles.submitText}>Send Feedback</Text>
                        )}
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
        minHeight: 400,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
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
        marginBottom: Spacing.lg,
        fontSize: Typography.sizes.sm,
    },
    input: {
        backgroundColor: Colors.background.tertiary,
        borderRadius: 12,
        padding: Spacing.md,
        color: Colors.text.primary,
        height: 150,
        fontSize: Typography.sizes.md,
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    submitButton: {
        backgroundColor: Colors.action.primary,
        paddingVertical: Spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitText: {
        color: '#000', // Black text on Primary color usually readable
        fontWeight: 'bold',
        fontSize: Typography.sizes.md,
    },
});
