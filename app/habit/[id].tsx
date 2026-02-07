import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { eq, desc, and } from 'drizzle-orm';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStreak } from '@/hooks/use-streak';
import { useHabits } from '@/hooks/use-habits';
import { db } from '@/db/client';
import { habits, completions } from '@/db/schema';
import type { Habit, Completion } from '@/db/schema';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { currentStreak } = useStreak(id);
  const { deleteHabit, archiveHabit } = useHabits();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [activityLog, setActivityLog] = useState<Completion[]>([]);

  useEffect(() => {
    (async () => {
      const habitResult = await db.select().from(habits).where(eq(habits.id, id));
      if (habitResult.length > 0) {
        setHabit(habitResult[0]);
      }

      const completionResult = await db
        .select()
        .from(completions)
        .where(eq(completions.habitId, id))
        .orderBy(desc(completions.date));
      setActivityLog(completionResult);
    })();
  }, [id]);

  if (!habit) return null;

  const handleDelete = () => {
    Alert.alert(t('habit.deleteConfirmTitle'), t('habit.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('habit.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteHabit(habit.id);
          router.back();
        },
      },
    ]);
  };

  const handleArchive = async () => {
    await archiveHabit(habit.id, !habit.isArchived);
    router.back();
  };

  const cardBg = colorScheme === 'dark' ? Colors.habit.cardBackgroundDark : Colors.habit.cardBackgroundLight;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ThemedText style={styles.backButton}>←</ThemedText>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.push(`/habit/create?habitId=${habit.id}`)}
            hitSlop={8}>
            <ThemedText style={[styles.actionButton, { color: colors.tint }]}>
              {t('habit.edit')}
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.heroSection}>
        <View style={[styles.heroIcon, { backgroundColor: habit.color + '20' }]}>
          <ThemedText style={styles.heroEmoji}>{habit.icon}</ThemedText>
        </View>
        <ThemedText type="title" style={styles.heroName}>{habit.name}</ThemedText>
        {habit.description && (
          <ThemedText style={[styles.heroDescription, { color: colors.icon }]}>
            {habit.description}
          </ThemedText>
        )}
        {currentStreak > 0 && (
          <ThemedText style={[styles.streakBadge, { color: Colors.habit.completionDone }]}>
            🔥 {currentStreak} {t('habit.dayStreak')}
          </ThemedText>
        )}
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.actionChip, { backgroundColor: cardBg }]}
          onPress={handleArchive}>
          <ThemedText style={styles.actionChipText}>
            {habit.isArchived ? t('habit.unarchive') : t('habit.archive')}
          </ThemedText>
        </Pressable>
        <Pressable
          style={[styles.actionChip, { backgroundColor: '#EF444420' }]}
          onPress={handleDelete}>
          <ThemedText style={[styles.actionChipText, { color: '#EF4444' }]}>
            {t('habit.delete')}
          </ThemedText>
        </Pressable>
      </View>

      <ThemedText type="subtitle" style={styles.logTitle}>
        {t('habit.activityLog')}
      </ThemedText>

      <FlatList
        data={activityLog}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.logEntry, { backgroundColor: cardBg }]}>
            <View
              style={[
                styles.logDot,
                {
                  backgroundColor:
                    item.status === 'completed'
                      ? Colors.habit.completionDone
                      : Colors.habit.completionSkipped,
                },
              ]}
            />
            <View style={styles.logInfo}>
              <ThemedText style={styles.logDate}>{item.date}</ThemedText>
              <ThemedText style={[styles.logStatus, { color: colors.icon }]}>
                {item.status === 'completed' ? t('habit.completed') : t('habit.skipped')}
              </ThemedText>
            </View>
            {item.note && (
              <ThemedText style={[styles.logNote, { color: colors.icon }]}>
                {item.note}
              </ThemedText>
            )}
          </View>
        )}
        ListEmptyComponent={
          <ThemedText style={[styles.emptyLog, { color: colors.icon }]}>
            {t('habit.noActivity')}
          </ThemedText>
        }
        contentContainerStyle={styles.logList}
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
    paddingVertical: 12,
  },
  backButton: {
    fontSize: 24,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroEmoji: {
    fontSize: 40,
  },
  heroName: {
    textAlign: 'center',
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
  },
  streakBadge: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  logTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  logList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  logDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  logInfo: {
    flex: 1,
  },
  logDate: {
    fontSize: 15,
    fontWeight: '500',
  },
  logStatus: {
    fontSize: 13,
    marginTop: 2,
  },
  logNote: {
    fontSize: 13,
    maxWidth: '40%',
  },
  emptyLog: {
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 15,
  },
});
