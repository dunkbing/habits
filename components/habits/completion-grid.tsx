import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { Completion } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatDateKey, isFuture } from "@/lib/date-utils";

interface CompletionGridProps {
  habitId: string;
  completions: Completion[];
  referenceDate: Date; // Any day in current month
  rows?: number; // default 3
}

/* ------------------------------
   Get all days in month (1 → 30/31)
--------------------------------*/
function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];

  for (let i = 1; i <= lastDay; i++) {
    days.push(new Date(year, month, i));
  }

  return days;
}

/* ------------------------------
   Split days into rows and pad to equal width
--------------------------------*/
function splitIntoRows(days: Date[], rows: number): (Date | null)[][] {
  const result: (Date | null)[][] = [];
  const perRow = Math.ceil(days.length / rows);

  /* Split into rows */
  for (let i = 0; i < rows; i++) {
    const start = i * perRow;
    const end = start + perRow;
    result.push(days.slice(start, end));
  }

  /* Find max columns across all rows */
  const maxCols = Math.max(...result.map((r) => r.length));

  /* Pad each row with null to match maxCols */
  return result.map((row) => {
    const padded = [...row];
    while (padded.length < maxCols) {
      padded.push(null);
    }
    return padded;
  });
}

/* ------------------------------
   Component
--------------------------------*/
export function CompletionGrid({
  habitId,
  completions,
  referenceDate,
  rows = 3,
}: CompletionGridProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  /* Get all days in the month */
  const days = useMemo(() => getMonthDays(referenceDate), [referenceDate]);

  /* Split into rows with padding */
  const rowsData = useMemo(() => splitIntoRows(days, rows), [days, rows]);

  /* Build completion lookup map */
  const completionMap = useMemo(() => {
    const map = new Map<string, Completion>();
    for (const c of completions) {
      if (c.habitId === habitId) {
        map.set(c.date, c);
      }
    }
    return map;
  }, [completions, habitId]);

  return (
    <View style={styles.grid}>
      {rowsData.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((day, colIdx) => {
            /* Empty placeholder for padding */
            if (!day) {
              return (
                <View
                  key={`empty-${rowIdx}-${colIdx}`}
                  style={[styles.square, styles.empty]}
                />
              );
            }

            const key = formatDateKey(day);
            const completion = completionMap.get(key);
            const future = isFuture(day);

            let backgroundColor: string;

            /* ------------ Color Logic ------------ */
            if (completion?.status === "completed") {
              backgroundColor = Colors.habit.completionDone; // Green
            } else if (completion?.status === "skipped") {
              backgroundColor = Colors.habit.completionSkipped; // Orange
            } else if (future) {
              // Future days
              backgroundColor = colorScheme === "dark" ? "#334155" : "#E2E8F0";
            } else {
              // Missed/incomplete past days / today
              backgroundColor = colorScheme === "dark" ? "#475569" : "#CBD5E1";
            }

            return (
              <View
                key={key}
                style={[
                  styles.square,
                  { backgroundColor },
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

/* ------------------------------
   Styles
--------------------------------*/
const styles = StyleSheet.create({
  grid: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  square: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
    maxHeight: 24,
  },
  empty: {
    backgroundColor: "transparent",
  },
});
