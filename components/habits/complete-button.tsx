import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CompleteButtonProps {
  isCompleted: boolean;
  onPress: () => void;
  size?: number;
}

export function CompleteButton({ isCompleted, onPress, size = 42 }: CompleteButtonProps) {
  const colorScheme = useColorScheme();

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const borderColor = colorScheme === 'dark' ? '#4B5563' : '#D1D5DB';

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
          isCompleted
            ? { backgroundColor: Colors.habit.completionDone }
            : { borderWidth: 2.5, borderColor },
        ]}>
        {isCompleted && (
          <View style={styles.checkContainer}>
            <View style={[styles.checkShort, { width: size * 0.2 }]} />
            <View style={[styles.checkLong, { width: size * 0.35 }]} />
          </View>
        )}
        {!isCompleted && (
          <View style={[styles.plusContainer, { width: size * 0.4, height: size * 0.4 }]}>
            <View style={[styles.plusH, { backgroundColor: borderColor }]} />
            <View style={[styles.plusV, { backgroundColor: borderColor }]} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkContainer: {
    width: 18,
    height: 14,
    position: 'relative',
  },
  checkShort: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
    bottom: 2,
    left: 0,
    transform: [{ rotate: '45deg' }],
  },
  checkLong: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
    bottom: 5,
    left: 4,
    transform: [{ rotate: '-45deg' }],
  },
  plusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusH: {
    position: 'absolute',
    width: '100%',
    height: 2,
    borderRadius: 1,
  },
  plusV: {
    position: 'absolute',
    width: 2,
    height: '100%',
    borderRadius: 1,
  },
});
