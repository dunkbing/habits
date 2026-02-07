import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { TodayHeader } from '@/components/habits/today-header';
import { WeekSelector } from '@/components/habits/week-selector';
import { CategoryFilter } from '@/components/habits/category-filter';
import { HabitList } from '@/components/habits/habit-list';
import { useSelectedDate } from '@/contexts/selected-date-context';
import { useHabits } from '@/hooks/use-habits';
import { useCompletions } from '@/hooks/use-completions';
import { getGridDays } from '@/lib/date-utils';

export default function TodayScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { selectedDate } = useSelectedDate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { habits, deleteHabit, archiveHabit } = useHabits(
    selectedCategory ? { categoryId: selectedCategory } : undefined
  );

  // Fetch completions for the 3-row grid (21 days)
  const gridDays = getGridDays(selectedDate, 3);
  const gridStart = gridDays[0];
  const gridEnd = gridDays[gridDays.length - 1];
  const { completions, toggleComplete, skipHabit } = useCompletions(gridStart, gridEnd);

  const handleDelete = (habitId: string) => {
    Alert.alert(t('habit.deleteConfirmTitle'), t('habit.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('habit.delete'), style: 'destructive', onPress: () => deleteHabit(habitId) },
    ]);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <TodayHeader />
      <WeekSelector />
      <CategoryFilter selectedCategoryId={selectedCategory} onSelect={setSelectedCategory} />
      <HabitList
        habits={habits}
        completions={completions}
        selectedDate={selectedDate}
        onToggleComplete={toggleComplete}
        onSkip={skipHabit}
        onDelete={handleDelete}
        onArchive={archiveHabit}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
