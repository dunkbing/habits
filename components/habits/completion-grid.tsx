import { StyleSheet, View } from 'react-native';
import { getGridDays, formatDateKey, isToday, isFuture } from '@/lib/date-utils';
import type { Completion } from '@/db/schema';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CompletionGridProps {
  habitId: string;
  completions: Completion[];
  referenceDate: Date;
  rows?: number;
}

export function CompletionGrid({ habitId, completions, referenceDate, rows = 3 }: CompletionGridProps) {
  const colorScheme = useColorScheme();
  const days = getGridDays(referenceDate, rows);

  const completionMap = new Map<string, Completion>();
  for (const c of completions) {
    if (c.habitId === habitId) {
      completionMap.set(c.date, c);
    }
  }

  return (
    <View style={styles.grid}>
      {Array.from({ length: rows }, (_, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {days.slice(rowIdx * 7, rowIdx * 7 + 7).map((day) => {
            const key = formatDateKey(day);
            const completion = completionMap.get(key);
            const future = isFuture(day);
            const today = isToday(day);

            let backgroundColor: string;
            let opacity = 1;
            if (completion?.status === 'completed') {
              // Vary green intensity: brighter for more recent
              const daysAgo = Math.floor(
                (new Date().getTime() - day.getTime()) / (1000 * 60 * 60 * 24)
              );
              if (daysAgo <= 2) {
                backgroundColor = '#16A34A'; // bright green
              } else if (daysAgo <= 7) {
                backgroundColor = '#22C55E'; // medium green
              } else {
                backgroundColor = '#4ADE80'; // lighter green
              }
            } else if (completion?.status === 'skipped') {
              backgroundColor = Colors.habit.completionSkipped;
            } else if (future) {
              backgroundColor = colorScheme === 'dark' ? '#2a2d2f' : '#E5E7EB';
              opacity = 0.6;
            } else if (today) {
              backgroundColor = colorScheme === 'dark' ? '#2a2d2f' : '#E5E7EB';
            } else {
              // Past, not completed — missed
              backgroundColor = colorScheme === 'dark' ? '#374151' : '#D1D5DB';
            }

            return (
              <View
                key={key}
                style={[
                  styles.square,
                  { backgroundColor, opacity },
                  today && styles.todaySquare,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  square: {
    flex: 1,
    aspectRatio: 1.6,
    borderRadius: 4,
    maxHeight: 22,
  },
  todaySquare: {
    borderWidth: 1,
    borderColor: '#22C55E',
  },
});
