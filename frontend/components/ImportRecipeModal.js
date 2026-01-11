import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { importRecipe } from '../services/api';

const LOADING_FRAMES = [
    { icon: '🔮', text: 'Scanning content...' },
    { icon: '📝', text: 'Extracting ingredients...' },
    { icon: '🍳', text: 'Identifying logic...' },
    { icon: '✨', text: 'Finalizing recipe...' },
];

const MagicLoader = () => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % LOADING_FRAMES.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const current = LOADING_FRAMES[frame];

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 20 }}>{current.icon}</Text>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>
                {current.text}
            </Text>
        </View>
    );
};

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
                            Paste a URL to a recipe blog, or paste the raw ingredients/instructions text. Our AI will handle the rest.
                        </Text>

                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="Paste recipe URL or text here..."
                            placeholderTextColor="#666"
                            value={text}
                            onChangeText={setText}
                            autoFocus
                        />

                        <TouchableOpacity
                            style={[styles.importButtonWrapper, loading && styles.disabledButton]}
                            onPress={handleImport}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={loading ? ['#333', '#444'] : ['#BB86FC', '#7F5AF0']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientButton}
                            >
                                {loading ? (
                                    <MagicLoader />
                                ) : (
                                    <Text style={styles.buttonText}>✨ Magic Import</Text>
                                )}
                            </LinearGradient>
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
    importButtonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.9,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
