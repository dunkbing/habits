import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HabitCard } from './habit-card';
import { EmptyState } from './empty-state';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatDateKey } from '@/lib/date-utils';
import type { Habit, Completion } from '@/db/schema';

interface HabitListProps {
  habits: Habit[];
  completions: Completion[];
  selectedDate: Date;
  onToggleComplete: (habitId: string, date: Date) => void;
  onSkip: (habitId: string, date: Date) => void;
  onDelete: (habitId: string) => void;
  onArchive: (habitId: string) => void;
}

export function HabitList({
  habits,
  completions,
  selectedDate,
  onToggleComplete,
  onSkip,
  onDelete,
  onArchive,
}: HabitListProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const dateKey = formatDateKey(selectedDate);
  const completedCount = habits.filter((h) =>
    completions.some((c) => c.habitId === h.id && c.date === dateKey && c.status === 'completed')
  ).length;

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t('today.todaysHabits')}</ThemedText>
          <ThemedText style={[styles.sectionCount, { color: colors.icon }]}>
            {completedCount} of {habits.length} done
          </ThemedText>
        </View>
      }
      renderItem={({ item }) => (
        <HabitCard
          habit={item}
          completions={completions}
          selectedDate={selectedDate}
          onToggleComplete={onToggleComplete}
          onSkip={onSkip}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 14,
  },
});
