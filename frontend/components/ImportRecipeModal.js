import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { importRecipe } from '../services/api';

export default function ImportRecipeModal({ isVisible, onClose, onImportSuccess }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImport = async () => {
        if (!text.trim() || text.length < 10) {
            Alert.alert("Invalid Input", "Please paste a recipe or URL.");
            return;
        }

        setLoading(true);
        try {
            const meal = await importRecipe(text);
            Alert.alert("Success!", `Imported "${meal.name}" successfully.`);
            onImportSuccess(meal); // Callback to add to plan or favorites
            setText('');
            onClose();
        } catch (error) {
            Alert.alert("Import Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Import Recipe (AI)</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.subtitle}>
                            Paste any recipe text, list of ingredients, or a messy blog post. Our AI will clean it up for you.
                        </Text>

                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="Paste recipe here..."
                            placeholderTextColor="#666"
                            value={text}
                            onChangeText={setText}
                            autoFocus
                        />

                        <TouchableOpacity
                            style={[styles.importButton, loading && styles.disabledButton]}
                            onPress={handleImport}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>✨ Magic Import</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    keyboardView: {
        // Ensures keyboard doesn't cover input
        justifyContent: 'center',
        flex: 1
    },
    container: {
        backgroundColor: '#1E1E2E',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    closeText: {
        fontSize: 24,
        color: '#888',
        padding: 4,
    },
    subtitle: {
        color: '#AAA',
        marginBottom: 16,
        fontSize: 14,
        lineHeight: 20,
    },
    input: {
        backgroundColor: '#121218',
        borderRadius: 12,
        padding: 16,
        color: '#FFF',
        height: 150,
        textAlignVertical: 'top',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    importButton: {
        backgroundColor: '#BB86FC',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
