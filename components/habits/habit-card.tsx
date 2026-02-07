import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import type { Completion, Habit } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useStreak } from "@/hooks/use-streak";
import { formatDateKey, isToday } from "@/lib/date-utils";
import { CompleteButton } from "./complete-button";
import { CompletionGrid } from "./completion-grid";

interface HabitCardProps {
  habit: Habit;
  completions: Completion[];
  selectedDate: Date;
  onToggleComplete: (habitId: string, date: Date) => void;
  onSkip: (habitId: string, date: Date) => void;
  onDelete: (habitId: string) => void;
  onArchive: (habitId: string) => void;
}

export function HabitCard({
  habit,
  completions,
  selectedDate,
  onToggleComplete,
  onSkip,
  onDelete,
  onArchive,
}: HabitCardProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { currentStreak } = useStreak(habit.id);

  const dateKey = formatDateKey(selectedDate);
  const todayCompletion = completions.find(
    (c) => c.habitId === habit.id && c.date === dateKey,
  );
  const isCompleted = todayCompletion?.status === "completed";

  const cardBg =
    colorScheme === "dark" ? Colors.habit.cardBackgroundDark : "#fff";
  const shadowStyle = colorScheme === "dark" ? {} : styles.cardShadow;
  const todayLabel = isToday(selectedDate) ? t("common.today") : dateKey;

  return (
    <Pressable
      style={[styles.card, { backgroundColor: cardBg }, shadowStyle]}
      onPress={() => router.push(`/habit/${habit.id}`)}
      onLongPress={() => {
        Alert.alert(habit.name, undefined, [
          {
            text: isCompleted
              ? t("habit.markIncomplete")
              : t("habit.markComplete"),
            onPress: () => onToggleComplete(habit.id, selectedDate),
          },
          {
            text: t("habit.skip"),
            onPress: () => onSkip(habit.id, selectedDate),
          },
          {
            text: t("habit.edit"),
            onPress: () => router.push(`/habit/create?habitId=${habit.id}`),
          },
          {
            text: t("habit.archive"),
            onPress: () => onArchive(habit.id),
          },
          {
            text: t("habit.delete"),
            style: "destructive",
            onPress: () => onDelete(habit.id),
          },
          { text: t("common.cancel"), style: "cancel" },
        ]);
      }}
    >
      {/* Top row: icon, info, complete button */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: habit.color }]}>
          <ThemedText style={styles.iconText}>{habit.icon}</ThemedText>
        </View>
        <View style={styles.info}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {habit.name}
          </ThemedText>
          <View style={styles.metaRow}>
            {currentStreak > 0 && (
              <ThemedText style={styles.streak}>⚡ {currentStreak}</ThemedText>
            )}
            <ThemedText
              style={[
                styles.dateLabel,
                { color: colorScheme === "dark" ? "#9BA1A6" : "#687076" },
              ]}
            >
              📅 {todayLabel}
            </ThemedText>
          </View>
        </View>
        <CompleteButton
          isCompleted={isCompleted}
          onPress={() => onToggleComplete(habit.id, selectedDate)}
        />
      </View>

      {/* Completion grid: 3 rows x 7 columns */}
      <View style={styles.gridContainer}>
        <CompletionGrid
          habitId={habit.id}
          completions={completions}
          referenceDate={selectedDate}
          rows={3}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  streak: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "600",
  },
  dateLabel: {
    fontSize: 12,
  },
  gridContainer: {
    marginTop: 12,
  },
});
