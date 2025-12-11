import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

export default function Auth({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signInWithEmail = async () => {
        console.log("Sign In Clicked");
        if (!email || !password) return alert("Please fill in all fields");
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);
        if (error) alert(error.message);
    };

    const signUpWithEmail = async () => {
        console.log("Sign Up Clicked");
        if (!email || !password) return alert("Please fill in all fields");
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);
        if (error) alert(error.message);
        else alert("Check your inbox for the verification email!");
    };

    const sendResetPassword = async () => {
        if (!email) return alert("Please enter your email address first.");
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://meal-planner-web-b2ff.onrender.com', // Your deployed URL
        });
        setLoading(false);
        if (error) alert(error.message);
        else alert("Password reset email sent!");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to save your plans.</Text>

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#1E1E2E',
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
});
