import React, { useMemo, useRef } from "react";
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useSelectedDate } from "@/contexts/selected-date-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    formatDateKey,
    getDayOfWeek,
    getWeekDays,
    isSameDay,
    isToday,
} from "@/lib/date-utils";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function CalendarStrip() {
    const { selectedDate, setSelectedDate } = useSelectedDate();
    const colorScheme = useColorScheme();
    const { width } = useWindowDimensions();
    const scrollViewRef = useRef<ScrollView>(null);

    // Get the week days based on the selected date
    // If we want to scroll back/forward, we might need more logic, 
    // but for now let's show the week of the selected date.
    const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

    const themeColors = Colors[colorScheme ?? "light"];

    return (
        <View style={styles.container}>
            <View style={styles.weekRow}>
                {weekDays.map((date, index) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isDateToday = isToday(date);
                    const dayLabel = DAY_LABELS[getDayOfWeek(date)];
                    const dayNumber = date.getDate();

                    return (
                        <TouchableOpacity
                            key={formatDateKey(date)}
                            style={[
                                styles.dayButton,
                                isSelected && { backgroundColor: themeColors.tint },
                                !isSelected && isDateToday && { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
                            ]}
                            onPress={() => setSelectedDate(date)}
                            activeOpacity={0.7}
                        >
                            <ThemedText
                                style={[
                                    styles.dayLabel,
                                    isSelected && { color: "#fff", fontWeight: "600" },
                                    !isSelected && { color: themeColors.icon },
                                ]}
                            >
                                {dayLabel}
                            </ThemedText>
                            <ThemedText
                                style={[
                                    styles.dayNumber,
                                    isSelected && { color: "#fff", fontWeight: "bold" },
                                ]}
                            >
                                {dayNumber}
                            </ThemedText>
                            {isDateToday && !isSelected && (
                                <View style={[styles.dot, { backgroundColor: themeColors.tint }]} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    dayButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 60,
        borderRadius: 22, // High border radius for pill shape
        gap: 4,
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: "500",
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: "500",
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: "absolute",
        bottom: 6,
    },
});
