import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import { BottomTabParamList } from "../types";
import { HomeScreen } from "../screens/HomeScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { FileManagerScreen } from "../screens/FileManagerScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { Colors } from "../theme/colors";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabs({
  dark,
  setDark,
}: {
  dark: boolean;
  setDark: (v: boolean) => void;
}) {
  const c = dark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets(); // <-- Fetches the exact size of the system action bar

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.card,
          borderTopColor: c.border,
          // Dynamically adjust height and padding based on the phone's bottom inset
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 12,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} dark={dark} />}
      </Tab.Screen>

      <Tab.Screen
        name="Favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "star" : "star-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      >
        {(props) => <FavoritesScreen {...props} dark={dark} />}
      </Tab.Screen>

      <Tab.Screen
        name="Files"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "folder" : "folder-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      >
        {(props) => <FileManagerScreen {...props} dark={dark} />}
      </Tab.Screen>

      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      >
        {(props) => <SettingsScreen {...props} dark={dark} setDark={setDark} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
