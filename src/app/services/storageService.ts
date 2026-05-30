import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeMode } from "../theme/colors";

const THEME_KEY = "devvault.theme";

export async function getThemePreference(): Promise<ThemeMode> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  return value === "dark" ? "dark" : "light";
}

export async function setThemePreference(mode: ThemeMode) {
  await AsyncStorage.setItem(THEME_KEY, mode);
}
