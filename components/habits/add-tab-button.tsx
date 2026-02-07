import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export function AddTabButton({ style }: BottomTabBarButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      style={[style, styles.wrapper]}
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push('/habit/create');
      }}>
      <View style={styles.button}>
        <View style={styles.plus}>
          <View style={styles.plusH} />
          <View style={styles.plusV} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  plus: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusH: {
    position: 'absolute',
    width: 22,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },
  plusV: {
    position: 'absolute',
    width: 3,
    height: 22,
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },
});
