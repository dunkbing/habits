import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

const EMOJI_OPTIONS = [
  '💪', '🏃', '📚', '🧘', '💧', '🍎', '😴', '✍️',
  '🎯', '🧠', '💼', '💰', '🎨', '🎵', '🌱', '❤️',
  '🏋️', '🚴', '🧹', '📝', '🙏', '☀️', '🌙', '⭐',
];

const COLOR_OPTIONS = [
  '#EF4444', '#F59E0B', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

interface IconPickerProps {
  selectedEmoji: string;
  selectedColor: string;
  onEmojiSelect: (emoji: string) => void;
  onColorSelect: (color: string) => void;
}

export function IconPicker({
  selectedEmoji,
  selectedColor,
  onEmojiSelect,
  onColorSelect,
}: IconPickerProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <View style={[styles.previewBox, { backgroundColor: selectedColor }]}>
          <ThemedText style={styles.previewEmoji}>{selectedEmoji}</ThemedText>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.emojiRow}>
        {EMOJI_OPTIONS.map((emoji) => (
          <Pressable
            key={emoji}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji && {
                backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
              },
            ]}
            onPress={() => onEmojiSelect(emoji)}>
            <ThemedText style={styles.emojiText}>{emoji}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.colorRow}>
        {COLOR_OPTIONS.map((color) => (
          <Pressable
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              selectedColor === color && styles.colorSelected,
            ]}
            onPress={() => onColorSelect(color)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  preview: {
    alignItems: 'center',
  },
  previewBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewEmoji: {
    fontSize: 32,
  },
  emojiRow: {
    gap: 6,
    paddingHorizontal: 4,
  },
  emojiButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 22,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
