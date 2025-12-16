import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const PREFERENCES = [
    { id: "Vegan", icon: "🌿", label: "Vegan" },
    { id: "Vegetarian", icon: "🥗", label: "Vegetarian" },
    { id: "Keto", icon: "🥑", label: "Keto" },
    { id: "Paleo", icon: "🥩", label: "Paleo" },
    { id: "Gluten-Free", icon: "🍞", label: "Gluten-Free" },
    { id: "No Beef", icon: "🐄", label: "No Beef" },
    { id: "No Pork", icon: "🐖", label: "No Pork" }
];

const DAYS_OF_WEEK = [
    { id: "Monday", label: "Mn" },
    { id: "Tuesday", label: "Tu" },
    { id: "Wednesday", label: "Wd" },
    { id: "Thursday", label: "Th" },
    { id: "Friday", label: "Fr" },
    { id: "Saturday", label: "Sa" },
    { id: "Sunday", label: "Su" }
];

export default function InputForm({
    days,
    setDays,
    planName,
    setPlanName,
    selectedPrefs,
    togglePref,
    meatFreeDays,
    toggleMeatFreeDay,
    onGenerate,
    loading,
    isOnline = true
}) {
    const handleGeneratePress = () => {
        if (!isOnline) {
            alert("No internet connection.\nPlease connect to generate a new plan.");
            return;
        }
        onGenerate();
    };
    return (
        <View style={styles.mainContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Design Your Plan</Text>
                    <Text style={styles.subtitle}>Let's create a menu tailored just for you.</Text>
                </View>

                {/* Section 1: The Basics */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.stepNumber}>1</Text>
                        <Text style={styles.cardTitle}>The Basics</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Plan Name</Text>
                        <TextInput
                            style={styles.input}
                            value={planName}
                            onChangeText={setPlanName}
                            placeholder="e.g. Summer Shred"
                            placeholderTextColor={Colors.text.hint}
                            returnKeyType="done"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Duration (Days)</Text>
                        <TextInput
                            style={styles.input}
                            value={days}
                            onChangeText={setDays}
                            keyboardType="numeric"
                            maxLength={2}
                            returnKeyType="done"
                        />
                    </View>
                </View>

                {/* Section 2: Diet Style */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.stepNumber}>2</Text>
                        <Text style={styles.cardTitle}>Dietary Style</Text>
                    </View>
                    <Text style={styles.helperText}>Tap all that apply</Text>

                    <View style={styles.gridContainer}>
                        {PREFERENCES.map(pref => (
                            <TouchableOpacity
                                key={pref.id}
                                style={[styles.gridItem, selectedPrefs.includes(pref.id) && styles.gridItemSelected]}
                                onPress={() => togglePref(pref.id)}
                            >
                                <Text style={styles.gridIcon}>{pref.icon}</Text>
                                <Text style={[styles.gridLabel, selectedPrefs.includes(pref.id) && styles.gridLabelSelected]}>
                                    {pref.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Section 3: Schedule */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.stepNumber}>3</Text>
                        <Text style={styles.cardTitle}>Meat-Free Days</Text>
                    </View>
                    <Text style={styles.helperText}>Select days to go veggie (optional)</Text>

                    <View style={styles.daysContainer}>
                        {DAYS_OF_WEEK.map(day => (
                            <TouchableOpacity
                                key={day.id}
                                style={[styles.dayCircle, meatFreeDays.includes(day.id) && styles.dayCircleSelected]}
                                onPress={() => toggleMeatFreeDay(day.id)}
                            >
                                <Text style={[styles.dayText, meatFreeDays.includes(day.id) && styles.dayTextSelected]}>
                                    {day.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.generateButton, !isOnline && styles.disabledButton]}
                    onPress={handleGeneratePress}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={isOnline ? [Colors.action.primary, Colors.action.primaryDark] : [Colors.background.elevated, '#555']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        {loading ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <ActivityIndicator color="#FFF" />
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                                    (Server waking up...)
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.buttonText, !isOnline && { color: Colors.text.muted }]}>
                                {isOnline ? "✨ Generate Magic Plan" : "🚫 Offline Mode"}
                            </Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
                {!isOnline && (
                    <Text style={{ color: Colors.text.hint, textAlign: 'center', marginTop: 10, fontSize: 12 }}>
                        Connect to the internet to create new plans.
                    </Text>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    scrollContent: {
        paddingHorizontal: Spacing.layout.screenPadding,
        paddingTop: Spacing.xl,
        paddingBottom: 150,
    },
    header: {
        marginBottom: Spacing.xxl,
        alignItems: 'center',
    },
    title: {
        fontSize: Typography.sizes.xxxl,
        fontWeight: Typography.weights.heavy,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
        letterSpacing: Typography.spacing.titleLetterSpacing,
    },
    subtitle: {
        fontSize: Typography.sizes.md,
        color: Colors.text.muted,
    },
    card: {
        backgroundColor: Colors.background.secondary,
        borderRadius: Spacing.layout.cardRadius,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border.default,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    stepNumber: {
        backgroundColor: Colors.background.elevated,
        width: 28,
        height: 28,
        borderRadius: 14,
        textAlign: 'center',
        lineHeight: 28,
        color: Colors.action.primary,
        fontWeight: Typography.weights.bold,
        marginRight: Spacing.md,
        overflow: 'hidden',
    },
    cardTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    inputGroup: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: Typography.sizes.sm,
        color: Colors.text.secondary,
        marginBottom: Spacing.sm,
        fontWeight: Typography.weights.semibold,
        textTransform: 'uppercase',
        letterSpacing: Typography.spacing.labelLetterSpacing,
    },
    input: {
        backgroundColor: Colors.background.tertiary,
        color: Colors.text.primary,
        padding: Spacing.lg,
        borderRadius: Spacing.layout.inputRadius,
        fontSize: Typography.sizes.md,
        borderWidth: 1,
        borderColor: Colors.border.focused,
    },
    helperText: {
        fontSize: Typography.sizes.sm,
        color: Colors.text.hint,
        marginBottom: Spacing.lg,
        marginTop: -Spacing.sm,
        fontStyle: 'italic',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    gridItem: {
        width: '30%',
        flexGrow: 1,
        backgroundColor: Colors.background.tertiary,
        paddingVertical: 15,
        borderRadius: Spacing.layout.inputRadius,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    gridItemSelected: {
        backgroundColor: Colors.background.tertiary,
        borderColor: Colors.border.accent,
        shadowColor: Colors.action.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    gridIcon: {
        fontSize: 24,
        marginBottom: Spacing.sm,
    },
    gridLabel: {
        color: Colors.text.secondary,
        fontSize: Typography.sizes.xs,
        fontWeight: Typography.weights.semibold,
    },
    gridLabelSelected: {
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    dayCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    dayCircleSelected: {
        backgroundColor: Colors.action.primary,
    },
    dayText: {
        color: '#BBB', // Kept slightly different from muted for visibility on dark
        fontWeight: Typography.weights.semibold,
        fontSize: Typography.sizes.sm,
    },
    dayTextSelected: {
        color: Colors.text.inverse,
        fontWeight: Typography.weights.bold,
    },
    generateButton: {
        marginTop: 10,
        borderRadius: Spacing.layout.buttonRadius,
        overflow: 'hidden',
        shadowColor: Colors.action.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: Spacing.xl,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.text.primary,
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    disabledButton: {
        shadowOpacity: 0,
        elevation: 0,
    }
});
