import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./navigation/RootNavigator";
import { initDatabase } from "./database/sqlite";
import { ensureAppFolders } from "./services/fileService";
import { getThemePreference } from "./services/storageService";
import { Colors } from "./theme/colors";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const boot = async () => {
      try {
        await initDatabase();
        await ensureAppFolders();
        const pref = await getThemePreference();
        setDark(pref === "dark");
      } catch (error) {
        console.log("Boot error:", error);
      } finally {
        setReady(true);
      }
    };
    boot();
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.dark.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationIndependentTree>
        <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
          <RootNavigator dark={dark} setDark={setDark} />
        </NavigationContainer>
      </NavigationIndependentTree>
    </SafeAreaProvider>
  );
}
