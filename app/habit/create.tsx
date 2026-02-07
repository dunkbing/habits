import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { HabitForm } from '@/components/habits/habit-form';
import { useHabits } from '@/hooks/use-habits';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { db } from '@/db/client';
import { habits } from '@/db/schema';
import type { Habit } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default function CreateHabitScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const params = useLocalSearchParams<{ habitId?: string }>();
  const { createHabit, updateHabit } = useHabits();
  const [existingHabit, setExistingHabit] = useState<Habit | undefined>();
  const [isLoading, setIsLoading] = useState(!!params.habitId);

  const isEditing = !!params.habitId;

  useEffect(() => {
    if (params.habitId) {
      (async () => {
        const result = await db
          .select()
          .from(habits)
          .where(eq(habits.id, params.habitId!));
        if (result.length > 0) {
          setExistingHabit(result[0]);
        }
        setIsLoading(false);
      })();
    }
  }, [params.habitId]);

  if (isLoading) return null;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with drag handle, more button, close button */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={[styles.dragHandle, { backgroundColor: colorScheme === 'dark' ? '#555' : '#ccc' }]} />
        <View style={styles.headerRight}>
          <Pressable
            style={[styles.closeButton, { backgroundColor: colorScheme === 'dark' ? '#2a2d2f' : '#f0f0f0' }]}
            onPress={() => router.back()}
            hitSlop={8}>
            <ThemedText style={styles.closeText}>✕</ThemedText>
          </Pressable>
        </View>
      </View>

      <HabitForm
        initialData={existingHabit}
        onSubmit={async (data) => {
          if (isEditing && params.habitId) {
            await updateHabit(params.habitId, {
              name: data.name,
              description: data.description || null,
              icon: data.icon,
              color: data.color,
              frequency: data.frequency,
              frequencyDays: data.frequency === 'custom' ? JSON.stringify(data.frequencyDays) : null,
              categoryId: data.categoryId,
              reminderEnabled: data.reminderEnabled,
              reminderTime: data.reminderEnabled ? data.reminderTime : null,
            });
          } else {
            await createHabit({
              name: data.name,
              description: data.description || null,
              icon: data.icon,
              color: data.color,
              frequency: data.frequency,
              frequencyDays: data.frequency === 'custom' ? JSON.stringify(data.frequencyDays) : null,
              categoryId: data.categoryId,
              reminderEnabled: data.reminderEnabled,
              reminderTime: data.reminderEnabled ? data.reminderTime : null,
              sortOrder: 0,
              isArchived: false,
            });
          }
          router.back();
        }}
        onCancel={() => router.back()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    width: 36,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
