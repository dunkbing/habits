import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import type { Completion } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatDateKey, isFuture, isToday } from "@/lib/date-utils";

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
            const today = isToday(day);
            const future = isFuture(day);
            console.log({
              day: key,
              status: completion?.status,
              today,
              future,
            });
            let backgroundColor: string;
            let borderColor: string | undefined;
            let borderWidth = 0;

            /* ------------ Color Logic ------------ */
            if (completion?.status === "completed") {
              backgroundColor = "#22C55E"; // Green - completed
            } else if (completion?.status === "skipped") {
              backgroundColor = "#F59E0B"; // Orange - skipped
            } else if (future) {
              // Future days - light gray
              backgroundColor = colorScheme === "dark" ? "#2A2D2F" : "#E5E7EB";
            } else {
              // Missed/incomplete past days - medium gray
              backgroundColor = colorScheme === "dark" ? "#374151" : "#D1D5DB";
            }

            // /* Today border indicator (only if not completed) */
            // if (today && completion?.status !== "completed") {
            //   borderWidth = 2;
            //   borderColor = colorScheme === "dark" ? "#4B5563" : "#9CA3AF";
            // }

            return (
              <View
                key={key}
                style={[
                  styles.square,
                  { backgroundColor },
                  borderWidth > 0 && { borderWidth, borderColor },
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
