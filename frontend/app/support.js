import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import * as Linking from 'expo-linking';

export default function SupportScreen() {
    const router = useRouter();
    const email = 'helpme.mealplanner@gmail.com';

    const handleEmail = () => {
        Linking.openURL(`mailto:${email}?subject=Support Request`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Need help? Found a bug? We are here to assist you.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Email Us At</Text>
                    <TouchableOpacity onPress={handleEmail}>
                        <Text style={styles.email}>{email}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.note}>
                    Tap the email above to open your mail app.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
        paddingTop: 60,
        paddingHorizontal: Spacing.layout.screenPadding,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    backText: {
        color: Colors.text.secondary,
        fontSize: Typography.sizes.md,
    },
    title: {
        color: Colors.text.primary,
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Spacing.xl,
    },
    description: {
        color: Colors.text.secondary,
        fontSize: Typography.sizes.md,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    card: {
        backgroundColor: Colors.background.secondary,
        padding: Spacing.xl,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border.default,
        marginBottom: Spacing.lg,
    },
    label: {
        color: Colors.text.muted,
        fontSize: Typography.sizes.sm,
        marginBottom: Spacing.sm,
        textTransform: 'uppercase',
    },
    email: {
        color: Colors.action.primary,
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        textDecorationLine: 'underline',
    },
    note: {
        color: Colors.text.muted,
        fontSize: Typography.sizes.sm,
    }
});
