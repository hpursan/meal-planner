import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
    loading
}) {
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
                            placeholderTextColor="#666"
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
                    style={styles.generateButton}
                    onPress={onGenerate}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#BB86FC', '#7F5AF0']}
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
                            <Text style={styles.buttonText}>✨ Generate Magic Plan</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

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
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAA',
    },
    card: {
        backgroundColor: '#1E1E2E',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    stepNumber: {
        backgroundColor: '#333',
        width: 28,
        height: 28,
        borderRadius: 14,
        textAlign: 'center',
        lineHeight: 28,
        color: '#BB86FC',
        fontWeight: 'bold',
        marginRight: 12,
        overflow: 'hidden',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#CCC',
        marginBottom: 8,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: '#2A2A35',
        color: '#FFF',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#444',
    },
    helperText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
        marginTop: -8,
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
        backgroundColor: '#2A2A35',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    gridItemSelected: {
        backgroundColor: '#2A2A35',
        borderColor: '#BB86FC',
        shadowColor: "#BB86FC",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    gridIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    gridLabel: {
        color: '#CCC',
        fontSize: 12,
        fontWeight: '600',
    },
    gridLabelSelected: {
        color: '#FFF',
        fontWeight: 'bold',
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
        backgroundColor: '#2A2A35',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    dayCircleSelected: {
        backgroundColor: '#BB86FC',
    },
    dayText: {
        color: '#BBB',
        fontWeight: '600',
        fontSize: 14,
    },
    dayTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    generateButton: {
        marginTop: 10,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#BB86FC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
