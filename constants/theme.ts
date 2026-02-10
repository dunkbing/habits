import { Platform } from "react-native";

const tintColorLight = "#22C55E"; // Green
const tintColorDark = "#4ADE80"; // Light Green for Dark Mode

export const Colors = {
  light: {
    text: "#11181C",
    background: "#F8FAFC", // Softer white/gray
    tint: tintColorLight,
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorLight,
    border: "#E2E8F0",
  },
  dark: {
    text: "#ECEDEE",
    background: "#1d1d1dff", // Dark Slate
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#64748B",
    tabIconSelected: tintColorDark,
    border: "#1E293B",
  },
  habit: {
    completionDone: "#22C55E",
    completionMissed: "#9CA3AF",
    completionSkipped: "#F59E0B",
    cardBackgroundLight: "#FFFFFF",
    cardBackgroundDark: "#2A2A2A",
    buttonBackgroundLight: "#F1F5F9",
    buttonBackgroundDark: "#334155",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
