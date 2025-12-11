import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

export default function CustomAlert({ visible, title, message, buttons = [], onClose }) {
    if (!visible) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {buttons.length === 0 ? (
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.primaryButtonText}>OK</Text>
                            </TouchableOpacity>
                        ) : (
                            buttons.map((btn, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        btn.style === 'destructive' ? styles.destructiveButton :
                                            btn.style === 'cancel' ? styles.cancelButton : styles.primaryButton
                                    ]}
                                    onPress={() => {
                                        if (btn.onPress) btn.onPress();
                                        if (btn.style === 'cancel' || !btn.onPress) onClose();
                                    }}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        btn.style === 'destructive' ? styles.destructiveText :
                                            btn.style === 'cancel' ? styles.cancelText : styles.primaryText
                                    ]}>{btn.text}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#1E1E2E',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#CCC',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: 100,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#BB86FC',
    },
    destructiveButton: {
        backgroundColor: '#382020',
        borderWidth: 1,
        borderColor: '#FF6B6B',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#666',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: '#000',
    },
    destructiveText: {
        color: '#FF6B6B',
    },
    cancelText: {
        color: '#CCC',
    },
});
