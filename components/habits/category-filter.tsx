import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useCategories } from "@/hooks/use-categories";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface CategoryFilterProps {
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({
  selectedCategoryId,
  onSelect,
}: CategoryFilterProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const colorScheme = useColorScheme();

  const isAllSelected = selectedCategoryId === null;
  const activeBg = Colors.habit.completionDone;
  const inactiveBg = colorScheme === "dark" ? "#2A2A2A" : "#fff";

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      <Pressable
        style={[
          styles.chip,
          { backgroundColor: isAllSelected ? activeBg : inactiveBg },
          isAllSelected && styles.chipActive,
        ]}
        onPress={() => onSelect(null)}
      >
        <ThemedText
          style={[
            styles.chipText,
            isAllSelected && { color: "#fff", fontWeight: "600" },
          ]}
        >
          {t("categories.all")}
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
            onPress={() => onSelect(cat.id)}
          >
            <ThemedText
              style={[
                styles.chipText,
                isSelected && { color: "#fff", fontWeight: "600" },
              ]}
            >
              {cat.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    marginBottom: 0, // Added margin bottom to separate from list
  },
  container: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: {
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
