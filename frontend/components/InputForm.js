import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';

const PREFERENCES_OPTIONS = ["Vegan", "Vegetarian", "Keto", "Paleo", "Gluten-Free", "No Beef", "No Pork"];
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Meal Planner</Text>
                <Text style={styles.subtitle}>Design your perfect diet.</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Plan Name</Text>
                    <TextInput
                        style={styles.input}
                        value={planName}
                        onChangeText={setPlanName}
                        placeholder="e.g. Summer Keto"
                        placeholderTextColor="#666"
                        returnKeyType="done"
                    />
                </View>

                <View style={styles.section}>
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

                <View style={styles.section}>
                    <Text style={styles.label}>Preferences</Text>
                    <View style={styles.chipContainer}>
                        {PREFERENCES_OPTIONS.map(pref => (
                            <TouchableOpacity
                                key={pref}
                                style={[styles.chip, selectedPrefs.includes(pref) && styles.chipSelected]}
                                onPress={() => togglePref(pref)}
                            >
                                <Text style={[styles.chipText, selectedPrefs.includes(pref) && styles.chipTextSelected]}>
                                    {pref}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Meat-Free Days</Text>
                    <Text style={styles.helperText}>Select days to go vegetarian (Starts Monday)</Text>
                    <View style={styles.chipContainer}>
                        {DAYS_OF_WEEK.map(day => (
                            <TouchableOpacity
                                key={day}
                                style={[styles.chip, meatFreeDays.includes(day) && styles.chipSelected]}
                                onPress={() => toggleMeatFreeDay(day)}
                            >
                                <Text style={[styles.chipText, meatFreeDays.includes(day) && styles.chipTextSelected]}>
                                    {day.slice(0, 3)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={onGenerate} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Generate Plan</Text>}
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 24,
        justifyContent: 'center',
        flex: 1,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
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
        marginBottom: 40,
    },
    section: {
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        color: '#CCC',
        marginBottom: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
        marginTop: -8,
    },
    input: {
        backgroundColor: '#1E1E2E',
        color: '#FFF',
        padding: 16,
        borderRadius: 12,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#333',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#1E1E2E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#333',
    },
    chipSelected: {
        backgroundColor: '#BB86FC',
        borderColor: '#BB86FC',
    },
    chipText: {
        color: '#CCC',
        fontWeight: '600',
    },
    chipTextSelected: {
        color: '#000',
    },
    button: {
        backgroundColor: '#BB86FC',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#BB86FC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
