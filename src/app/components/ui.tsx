import React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Colors } from "../theme/colors";

export function usePalette(dark?: boolean) {
  return dark ? Colors.dark : Colors.light;
}

export function Screen({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  const c = usePalette(dark);
  return <View style={[styles.screen, { backgroundColor: c.background }]}>{children}</View>;
}

export function Card({ children, dark, style }: { children: React.ReactNode; dark?: boolean; style?: ViewStyle }) {
  const c = usePalette(dark);
  return <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }, style]}>{children}</View>;
}

export function Title({ children, dark, style }: { children: React.ReactNode; dark?: boolean; style?: TextStyle }) {
  const c = usePalette(dark);
  return <Text style={[styles.title, { color: c.text }, style]}>{children}</Text>;
}

export function Muted({ children, dark, style }: { children: React.ReactNode; dark?: boolean; style?: TextStyle }) {
  const c = usePalette(dark);
  return <Text style={[styles.muted, { color: c.muted }, style]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  dark,
  variant = "primary"
}: {
  label: string;
  onPress: () => void;
  dark?: boolean;
  variant?: "primary" | "danger" | "ghost";
}) {
  const c = usePalette(dark);
  const bg = variant === "danger" ? c.danger : variant === "ghost" ? "transparent" : c.primary;
  const color = variant === "ghost" ? c.primary : "#FFFFFF";
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: bg, borderColor: c.border }]}>
      <Text style={{ color, fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Input(props: React.ComponentProps<typeof TextInput> & { dark?: boolean }) {
  const c = usePalette(props.dark);
  return (
    <TextInput
      {...props}
      placeholderTextColor={c.muted}
      style={[styles.input, { backgroundColor: c.card, color: c.text, borderColor: c.border }, props.style]}
    />
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8
  },
  muted: {
    fontSize: 13
  },
  button: {
    borderRadius: 14,
    minHeight: 46,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginVertical: 6
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    minHeight: 46,
    marginBottom: 10
  }
});
