import { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { IconPicker } from './icon-picker';
import { useCategories } from '@/hooks/use-categories';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DAY_LABELS } from '@/lib/date-utils';
import type { Habit } from '@/db/schema';

type Frequency = 'daily' | 'weekly' | 'custom';

export interface HabitFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: Frequency;
  frequencyDays: number[];
  categoryId: string;
  reminderEnabled: boolean;
  reminderTime: string;
}

interface HabitFormProps {
  initialData?: Habit;
  onSubmit: (data: HabitFormData) => void;
  onCancel: () => void;
}

export function HabitForm({ initialData, onSubmit, onCancel }: HabitFormProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { categories } = useCategories();

  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [icon, setIcon] = useState(initialData?.icon ?? '💪');
  const [color, setColor] = useState(initialData?.color ?? '#EF4444');
  const [frequency, setFrequency] = useState<Frequency>(initialData?.frequency ?? 'daily');
  const [frequencyDays, setFrequencyDays] = useState<number[]>(() => {
    if (initialData?.frequencyDays) {
      return JSON.parse(initialData.frequencyDays) as number[];
    }
    return [0, 1, 2, 3, 4];
  });
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '');
  const [reminderEnabled, setReminderEnabled] = useState(initialData?.reminderEnabled ?? false);
  const [reminderTime, setReminderTime] = useState(initialData?.reminderTime ?? '09:00');
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      frequency,
      frequencyDays,
      categoryId,
      reminderEnabled,
      reminderTime,
    });
  };

  const toggleDay = (dayIndex: number) => {
    setFrequencyDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const rowBg = colorScheme === 'dark' ? '#1e2022' : '#fff';
  const separatorColor = colorScheme === 'dark' ? '#2a2d2f' : '#f0f0f0';
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const frequencyLabel = t(`habit.frequency.${frequency}`);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Name input */}
      <View style={[styles.nameSection, { backgroundColor: rowBg }]}>
        <TextInput
          style={[styles.nameInput, { color: colors.text }]}
          value={name}
          onChangeText={setName}
          placeholder={t('habit.namePlaceholder')}
          placeholderTextColor={colors.icon}
          autoFocus={!initialData}
        />
        <TextInput
          style={[styles.descInput, { color: colors.icon }]}
          value={description}
          onChangeText={setDescription}
          placeholder={t('habit.descriptionPlaceholder')}
          placeholderTextColor={colorScheme === 'dark' ? '#555' : '#aaa'}
          multiline
        />
      </View>

      {/* Settings rows */}
      <View style={[styles.rowGroup, { backgroundColor: rowBg }]}>
        {/* Icon row */}
        <Pressable style={styles.row} onPress={() => setShowIconPicker(!showIconPicker)}>
          <ThemedText style={styles.rowLabel}>{t('habit.icon')}</ThemedText>
          <View style={styles.rowRight}>
            <View style={[styles.iconPreview, { backgroundColor: color }]}>
              <ThemedText style={styles.iconPreviewEmoji}>{icon}</ThemedText>
            </View>
            <ThemedText style={[styles.chevron, { color: colors.icon }]}>›</ThemedText>
          </View>
        </Pressable>

        {showIconPicker && (
          <View style={[styles.pickerContainer, { borderTopWidth: 1, borderTopColor: separatorColor }]}>
            <IconPicker
              selectedEmoji={icon}
              selectedColor={color}
              onEmojiSelect={setIcon}
              onColorSelect={setColor}
            />
          </View>
        )}

        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        {/* Frequency row */}
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>{t('habit.frequencyLabel')}</ThemedText>
          <View style={styles.frequencyPicker}>
            {(['daily', 'weekly', 'custom'] as const).map((f) => (
              <Pressable
                key={f}
                style={[
                  styles.freqChip,
                  {
                    backgroundColor: frequency === f
                      ? Colors.habit.completionDone
                      : (colorScheme === 'dark' ? '#2a2d2f' : '#f0f0f0'),
                  },
                ]}
                onPress={() => setFrequency(f)}>
                <ThemedText
                  style={[
                    styles.freqChipText,
                    frequency === f && { color: '#fff', fontWeight: '600' },
                  ]}>
                  {t(`habit.frequency.${f}`)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {frequency === 'custom' && (
          <View style={[styles.daysRow, { borderTopWidth: 1, borderTopColor: separatorColor }]}>
            {DAY_LABELS.map((label, index) => {
              const isActive = frequencyDays.includes(index);
              return (
                <Pressable
                  key={index}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isActive
                        ? Colors.habit.completionDone
                        : (colorScheme === 'dark' ? '#2a2d2f' : '#f0f0f0'),
                    },
                  ]}
                  onPress={() => toggleDay(index)}>
                  <ThemedText
                    style={[
                      styles.dayChipText,
                      isActive && { color: '#fff', fontWeight: '600' },
                    ]}>
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        {/* Category row */}
        <View style={styles.categorySection}>
          <ThemedText style={styles.rowLabel}>{t('habit.category')}</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSelected
                        ? Colors.habit.completionDone
                        : (colorScheme === 'dark' ? '#2a2d2f' : '#f0f0f0'),
                    },
                  ]}
                  onPress={() => setCategoryId(cat.id)}>
                  <ThemedText style={styles.catEmoji}>{cat.icon}</ThemedText>
                  <ThemedText
                    style={[
                      styles.catText,
                      isSelected && { color: '#fff', fontWeight: '600' },
                    ]}>
                    {cat.name}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        {/* Reminder row */}
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>{t('habit.reminder')}</ThemedText>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ true: Colors.habit.completionDone }}
          />
        </View>

        {reminderEnabled && (
          <>
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <View style={styles.row}>
              <TextInput
                style={[styles.timeInput, { color: colors.text }]}
                value={reminderTime}
                onChangeText={setReminderTime}
                placeholder="09:00 AM"
                placeholderTextColor={colors.icon}
              />
              <ThemedText style={[styles.chevron, { color: colors.icon }]}>›</ThemedText>
            </View>
          </>
        )}
      </View>

      {/* Create button */}
      <Pressable
        style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
        onPress={handleSubmit}
        disabled={!name.trim()}>
        <ThemedText style={styles.createButtonText}>
          {initialData ? t('common.save') : t('habit.create')}
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  nameSection: {
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: '600',
    paddingVertical: 4,
  },
  descInput: {
    fontSize: 15,
    paddingVertical: 4,
  },
  rowGroup: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
  },
  iconPreview: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPreviewEmoji: {
    fontSize: 18,
  },
  pickerContainer: {
    padding: 16,
  },
  separator: {
    height: 1,
    marginLeft: 16,
  },
  frequencyPicker: {
    flexDirection: 'row',
    gap: 6,
  },
  freqChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  freqChipText: {
    fontSize: 13,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dayChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  categorySection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  categoryScroll: {
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
  },
  catEmoji: {
    fontSize: 14,
  },
  catText: {
    fontSize: 13,
  },
  timeInput: {
    fontSize: 16,
    flex: 1,
  },
  createButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
