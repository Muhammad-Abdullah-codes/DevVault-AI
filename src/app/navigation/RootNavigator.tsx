import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { BottomTabs } from "./BottomTabs";
import { CreateSnippetScreen } from "../screens/CreateSnippetScreen";
import { SnippetDetailScreen } from "../screens/SnippetDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {(props) => <BottomTabs {...props} dark={dark} setDark={setDark} />}
      </Stack.Screen>
      <Stack.Screen name="CreateSnippet" options={{ title: "Snippet" }}>
        {(props) => <CreateSnippetScreen {...props} dark={dark} />}
      </Stack.Screen>
      <Stack.Screen name="SnippetDetail" options={{ title: "Snippet Details" }}>
        {(props) => <SnippetDetailScreen {...props} dark={dark} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
