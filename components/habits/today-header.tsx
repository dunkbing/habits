import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { formatMonthYear } from '@/lib/date-utils';
import { useSelectedDate } from '@/contexts/selected-date-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function TodayHeader() {
  const { selectedDate } = useSelectedDate();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>😊</ThemedText>
      </View>
      <ThemedText style={styles.monthYear}>
        {formatMonthYear(selectedDate)}
      </ThemedText>
      <Pressable
        style={[styles.gearButton, { backgroundColor: colorScheme === 'dark' ? '#2a2d2f' : '#f0f0f0' }]}
        onPress={() => router.push('/(tabs)/settings')}
        hitSlop={8}>
        <ThemedText style={styles.gearIcon}>⚙️</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#818CF8',
  },
  avatarText: {
    fontSize: 22,
  },
  monthYear: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearIcon: {
    fontSize: 20,
  },
});
