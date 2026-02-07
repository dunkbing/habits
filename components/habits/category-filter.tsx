import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/themed-text';
import { useCategories } from '@/hooks/use-categories';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CategoryFilterProps {
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ selectedCategoryId, onSelect }: CategoryFilterProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const colorScheme = useColorScheme();

  const isAllSelected = selectedCategoryId === null;
  const activeBg = Colors.habit.completionDone;
  const inactiveBg = colorScheme === 'dark' ? '#2a2d2f' : '#f0f0f0';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <Pressable
        style={[
          styles.chip,
          { backgroundColor: isAllSelected ? activeBg : inactiveBg },
          isAllSelected && styles.chipActive,
        ]}
        onPress={() => onSelect(null)}>
        <ThemedText
          style={[
            styles.chipText,
            isAllSelected && { color: '#fff', fontWeight: '700' },
          ]}>
          {t('categories.all')}
        </ThemedText>
      </Pressable>

      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <Pressable
            key={cat.id}
            style={[
              styles.chip,
              { backgroundColor: isSelected ? activeBg : inactiveBg },
              isSelected && styles.chipActive,
            ]}
            onPress={() => onSelect(cat.id)}>
            <ThemedText
              style={[
                styles.chipText,
                isSelected && { color: '#fff', fontWeight: '700' },
              ]}>
              {cat.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
