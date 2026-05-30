import React, { useEffect, useState } from "react";
import { Alert, Switch, Text } from "react-native";
import { saveApiKey, getApiKey, deleteApiKey } from "../services/secureService";
import { setThemePreference } from "../services/storageService";
import { folders, listManagedFiles } from "../services/fileService";
import { Button, Card, Input, Muted, Screen, Title, usePalette } from "../components/ui";

export function SettingsScreen({
  dark,
  setDark
}: {
  dark: boolean;
  setDark: (v: boolean) => void;
}) {
  const [apiKey, setApiKeyState] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const c = usePalette(dark);

  const load = async () => {
    const key = await getApiKey();
    setHasKey(Boolean(key));
    const all = await Promise.all([
      listManagedFiles(folders.screenshots),
      listManagedFiles(folders.exports),
      listManagedFiles(folders.templates),
      listManagedFiles(folders.downloads)
    ]);
    setFileCount(all.flat().length);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleTheme = async (v: boolean) => {
    setDark(v);
    await setThemePreference(v ? "dark" : "light");
  };

  const saveKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert("Missing API key", "Paste your API key first.");
      return;
    }
    await saveApiKey(apiKey);
    setApiKeyState("");
    setHasKey(true);
    Alert.alert("Saved", "API key saved securely using SecureStore.");
  };

  const removeKey = async () => {
    await deleteApiKey();
    setHasKey(false);
    Alert.alert("Removed", "API key deleted from SecureStore.");
  };

  return (
    <Screen dark={dark}>
      <Title dark={dark}>Settings</Title>

      <Card dark={dark}>
        <Title dark={dark} style={{ fontSize: 18 }}>Appearance</Title>
        <Text style={{ color: c.text, marginBottom: 8 }}>Dark Mode</Text>
        <Switch value={dark} onValueChange={toggleTheme} />
        <Muted dark={dark}>Theme preference is stored with AsyncStorage.</Muted>
      </Card>

      <Card dark={dark}>
        <Title dark={dark} style={{ fontSize: 18 }}>AI Settings</Title>
        <Muted dark={dark}>{hasKey ? "API key is saved in SecureStore." : "No API key saved. Offline fallback will be used."}</Muted>
        <Input
          dark={dark}
          placeholder="Paste API key"
          value={apiKey}
          onChangeText={setApiKeyState}
          secureTextEntry
        />
        <Button label="Save API Key" dark={dark} onPress={saveKey} />
        <Button label="Delete API Key" dark={dark} variant="danger" onPress={removeKey} />
      </Card>

      <Card dark={dark}>
        <Title dark={dark} style={{ fontSize: 18 }}>Storage</Title>
        <Muted dark={dark}>SQLite database: snippets and AI history.</Muted>
        <Muted dark={dark}>FileSystem folders: Screenshots, Exports, Templates, Downloads.</Muted>
        <Text style={{ color: c.text, fontWeight: "800", marginTop: 8 }}>{fileCount} managed file(s)</Text>
      </Card>

      <Card dark={dark}>
        <Title dark={dark} style={{ fontSize: 18 }}>About</Title>
        <Muted dark={dark}>DevVault AI is an offline-first developer utility app built with Expo, React Native, TypeScript, SQLite, AsyncStorage, SecureStore, and Expo FileSystem.</Muted>
      </Card>
    </Screen>
  );
}
