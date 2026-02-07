import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { getWeekDays, DAY_LABELS, isSameDay, isToday } from '@/lib/date-utils';
import { useSelectedDate } from '@/contexts/selected-date-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function WeekSelector() {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const weekDays = getWeekDays(selectedDate);

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#1e2022' : '#fff' }]}>
      {weekDays.map((day, index) => {
        const selected = isSameDay(day, selectedDate);
        const today = isToday(day);

        return (
          <Pressable
            key={day.toISOString()}
            style={styles.dayColumn}
            onPress={() => setSelectedDate(day)}>
            <ThemedText
              style={[
                styles.dayLabel,
                { color: colors.icon },
                today && !selected && { color: colors.tint },
              ]}>
              {DAY_LABELS[index]}
            </ThemedText>
            <View
              style={[
                styles.dateCircle,
                selected && {
                  backgroundColor: colorScheme === 'dark' ? '#fff' : '#1a1a1a',
                },
                today && !selected && {
                  borderWidth: 1.5,
                  borderColor: colors.tint,
                },
              ]}>
              <ThemedText
                style={[
                  styles.dateNumber,
                  { color: colors.text },
                  selected && {
                    color: colorScheme === 'dark' ? '#151718' : '#fff',
                    fontWeight: '700',
                  },
                  today && !selected && { color: colors.tint, fontWeight: '700' },
                ]}>
                {String(day.getDate()).padStart(2, '0')}
              </ThemedText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
});
