import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../theme/colors";

export function usePalette(dark?: boolean) {
  return dark ? Colors.dark : Colors.light;
}

export function Screen({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  const c = usePalette(dark);
  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: c.background }]}
      edges={["top", "left", "right"]}
    >
      {/* This View adds that guaranteed top margin/breathing room you wanted */}
      <View style={{ flex: 1, paddingTop: 12 }}>{children}</View>
    </SafeAreaView>
  );
}

export function Card({
  children,
  dark,
  style,
}: {
  children: React.ReactNode;
  dark?: boolean;
  style?: ViewStyle;
}) {
  const c = usePalette(dark);
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.card, borderColor: c.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Title({
  children,
  dark,
  style,
}: {
  children: React.ReactNode;
  dark?: boolean;
  style?: TextStyle;
}) {
  const c = usePalette(dark);
  return (
    <Text style={[styles.title, { color: c.text }, style]}>{children}</Text>
  );
}

export function Muted({
  children,
  dark,
  style,
}: {
  children: React.ReactNode;
  dark?: boolean;
  style?: TextStyle;
}) {
  const c = usePalette(dark);
  return (
    <Text style={[styles.muted, { color: c.muted }, style]}>{children}</Text>
  );
}

export function Button({
  label,
  onPress,
  dark,
  variant = "primary",
  icon,
}: {
  label: string;
  onPress: () => void;
  dark?: boolean;
  variant?: "primary" | "danger" | "ghost" | "outline";
  icon?: React.ReactNode;
}) {
  const c = usePalette(dark);

  let bg = c.primary;
  let textColor = "#FFFFFF";
  let borderColor = c.border;

  if (variant === "danger") {
    bg = c.danger;
  } else if (variant === "ghost") {
    bg = "transparent";
    textColor = c.primary;
    borderColor = "transparent";
  } else if (variant === "outline") {
    bg = "transparent";
    textColor = c.primary;
    borderColor = c.primary;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, { backgroundColor: bg, borderColor: borderColor }]}
    >
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
      <Text
        style={{
          color: textColor,
          fontWeight: "700",
          fontSize: 16,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function Input(
  props: React.ComponentProps<typeof TextInput> & {
    dark?: boolean;
    icon?: React.ReactNode;
  },
) {
  const c = usePalette(props.dark);
  return (
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: c.card, borderColor: c.border },
        props.style,
      ]}
    >
      {props.icon && <View style={styles.inputIcon}>{props.icon}</View>}
      <TextInput
        {...props}
        placeholderTextColor={c.muted}
        style={[styles.input, { color: c.text }]}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20, // Wider, cleaner margins
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
    // Modern soft shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.5, // Tighter tracking for modern look
  },
  muted: {
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    flexDirection: "row",
    borderRadius: 16,
    minHeight: 54,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 54,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
});
