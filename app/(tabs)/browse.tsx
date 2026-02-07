import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHabits } from '@/hooks/use-habits';
import { useCategories } from '@/hooks/use-categories';
import type { Habit, Category } from '@/db/schema';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CategoryGroup {
  category: Category;
  habits: Habit[];
}

export default function BrowseScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits: activeHabits } = useHabits();
  const { habits: allHabits } = useHabits({ includeArchived: true });
  const { categories } = useCategories();

  const archivedHabits = allHabits.filter((h) => h.isArchived);

  const groups: CategoryGroup[] = categories
    .map((cat) => ({
      category: cat,
      habits: activeHabits.filter((h) => h.categoryId === cat.id),
    }))
    .filter((g) => g.habits.length > 0);

  const renderHabitRow = (habit: Habit, isArchived = false) => (
    <Pressable
      key={habit.id}
      style={[styles.habitRow, { backgroundColor: colorScheme === 'dark' ? '#1e2022' : '#f5f5f5' }]}
      onPress={() => router.push(`/habit/${habit.id}`)}>
      <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
        <ThemedText style={styles.habitIconText}>{habit.icon}</ThemedText>
      </View>
      <View style={styles.habitInfo}>
        <ThemedText style={[styles.habitName, isArchived && styles.archivedText]}>
          {habit.name}
        </ThemedText>
        <ThemedText style={[styles.habitFrequency, { color: colors.icon }]}>
          {t(`habit.frequency.${habit.frequency}`)}
        </ThemedText>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">{t('browse.title')}</ThemedText>
        <Pressable onPress={() => router.push('/(tabs)/settings')}>
          <ThemedText style={{ fontSize: 24 }}>⚙️</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.category.id}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionEmoji}>{item.category.icon}</ThemedText>
              <ThemedText type="subtitle">{item.category.name}</ThemedText>
              <ThemedText style={[styles.sectionCount, { color: colors.icon }]}>
                {item.habits.length}
              </ThemedText>
            </View>
            {item.habits.map((h) => renderHabitRow(h))}
          </View>
        )}
        ListFooterComponent={
          archivedHabits.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionEmoji}>📦</ThemedText>
                <ThemedText type="subtitle">{t('browse.archived')}</ThemedText>
                <ThemedText style={[styles.sectionCount, { color: colors.icon }]}>
                  {archivedHabits.length}
                </ThemedText>
              </View>
              {archivedHabits.map((h) => renderHabitRow(h, true))}
            </View>
          ) : null
        }
        ListEmptyComponent={
          archivedHabits.length === 0 ? (
            <View style={styles.empty}>
              <ThemedText style={[styles.emptyText, { color: colors.icon }]}>
                {t('browse.empty')}
              </ThemedText>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionEmoji: {
    fontSize: 20,
  },
  sectionCount: {
    fontSize: 14,
    marginLeft: 'auto',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitIconText: {
    fontSize: 20,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitFrequency: {
    fontSize: 13,
    marginTop: 2,
  },
  archivedText: {
    opacity: 0.5,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
  },
});
