import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../types";
import { HomeScreen } from "../screens/HomeScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { FileManagerScreen } from "../screens/FileManagerScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { Colors } from "../theme/colors";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabs({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const c = dark ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: c.primary,
        tabBarStyle: { backgroundColor: c.card, borderTopColor: c.border },
        headerStyle: { backgroundColor: c.card },
        headerTintColor: c.text
      }}
    >
      <Tab.Screen name="Home" options={{ tabBarIcon: () => "🏠" as any }}>
        {(props) => <HomeScreen {...props} dark={dark} />}
      </Tab.Screen>
      <Tab.Screen name="Favorites" options={{ tabBarIcon: () => "⭐" as any }}>
        {(props) => <FavoritesScreen {...props} dark={dark} />}
      </Tab.Screen>
      <Tab.Screen name="Files" options={{ tabBarIcon: () => "📁" as any }}>
        {(props) => <FileManagerScreen {...props} dark={dark} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{ tabBarIcon: () => "⚙️" as any }}>
        {(props) => <SettingsScreen {...props} dark={dark} setDark={setDark} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
