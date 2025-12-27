import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Ideally log this to Sentry
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Attempt to reload the app - in Expo navigation, sometimes just resetting state is enough
        // But for a hard crash, we might want a full reload if possible, or just re-render children.
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.icon}>🤕</Text>
                        <Text style={styles.title}>Oops, something went wrong.</Text>
                        <Text style={styles.message}>
                            We're sorry, but the app encountered an unexpected error.
                        </Text>
                        <Text style={styles.code}>
                            {this.state.error?.toString()}
                        </Text>

                        <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Hardcoded dark background to match theme
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    icon: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    message: {
        fontSize: Typography.sizes.md,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    code: {
        fontSize: Typography.sizes.xs,
        color: Colors.action.danger, // Red for error
        fontFamily: 'monospace',
        marginBottom: Spacing.xxl,
        textAlign: 'center',
        backgroundColor: 'rgba(255,0,0,0.1)',
        padding: Spacing.md,
        borderRadius: 8,
        width: '100%',
    },
    button: {
        backgroundColor: Colors.action.primary,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xxl,
        borderRadius: 50,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: Typography.sizes.md,
    }
});
