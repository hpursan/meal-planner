import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';
import CustomAlert from './CustomAlert';

export default function Auth({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

    const showAlert = (title, message) => {
        setAlertConfig({ visible: true, title, message, buttons: [] });
    };

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    const signInWithEmail = async () => {
        if (!email || !password) return showAlert("Error", "Please fill in all fields");
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);
        if (error) showAlert("Error", error.message);
    };

    const signUpWithEmail = async () => {
        if (!email || !password) return showAlert("Error", "Please fill in all fields");
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);
        if (error) showAlert("Error", error.message);
        else showAlert("Success", "Check your inbox for the verification email!");
    };

    const sendResetPassword = async () => {
        if (!email) return showAlert("Error", "Please enter your email address first.");
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://meal-planner-web-b2ff.onrender.com', // Your deployed URL
        });
        setLoading(false);
        if (error) showAlert("Error", error.message);
        else showAlert("Success", "Password reset email sent!");
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://meal-planner-web-b2ff.onrender.com', // Your Render URL
            },
        });
        setLoading(false);
        if (error) showAlert("Error", error.message);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to save your plans.</Text>

            <TouchableOpacity
                style={[styles.button, styles.googleButton]}
                onPress={signInWithGoogle}
                disabled={loading}
            >
                <Text style={styles.googleButtonText}>🔵  Sign in with Google</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
            </View>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={signInWithEmail} disabled={loading}>
                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Sign In</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={sendResetPassword} style={{ marginBottom: 20, alignItems: 'center' }}>
                <Text style={{ color: '#BB86FC' }}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={signUpWithEmail} disabled={loading}>
                <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onClose={closeAlert}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#1E1E2E',
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAA',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#2A2A35',
        color: '#FFF',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    button: {
        backgroundColor: '#BB86FC',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    googleButton: {
        backgroundColor: '#FFF',
        marginBottom: 24,
    },
    googleButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        padding: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#BB86FC',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#444',
    },
    orText: {
        color: '#666',
        paddingHorizontal: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
