import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useSelectedDate } from "@/contexts/selected-date-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatMonthYear } from "@/lib/date-utils";
import { useRouter } from "expo-router";

export function TodayHeader() {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleJumpToToday = () => {
    setSelectedDate(new Date());
  };

  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateRow}>
          {/* Profile Pic Placeholder */}
          <View style={[styles.avatar, { backgroundColor: themeColors.border }]}>
            <Ionicons name="person" size={20} color={themeColors.icon} />
          </View>

          <ThemedText style={styles.monthTitle}>
            {formatMonthYear(selectedDate)}
          </ThemedText>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleJumpToToday}>
              <Ionicons name="notifications-outline" size={24} color={themeColors.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
              <Ionicons name="settings-outline" size={24} color={themeColors.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* <CalendarStrip /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 16,
  },
  header: {
    marginBottom: 0,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center'
  }
});
