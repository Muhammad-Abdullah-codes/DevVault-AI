import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { createSnippet, getSnippet, updateSnippet } from "../database/sqlite";
import { pickScreenshot } from "../services/fileService";
import { Button, Card, Input, Muted, Screen, Title, usePalette } from "../components/ui";

type Props = NativeStackScreenProps<RootStackParamList, "CreateSnippet"> & { dark: boolean };

export function CreateSnippetScreen({ navigation, route, dark }: Props) {
  const editingId = route.params?.id;
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [tags, setTags] = useState("");
  const [code, setCode] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const c = usePalette(dark);

  useEffect(() => {
    const load = async () => {
      if (!editingId) return;
      const row = await getSnippet(editingId);
      if (!row) return;
      setTitle(row.title);
      setLanguage(row.language);
      setTags(row.tags);
      setCode(row.code);
      setScreenshot(row.screenshot ?? null);
    };
    load();
  }, [editingId]);

  const save = async () => {
    if (!title.trim() || !code.trim()) {
      Alert.alert("Missing fields", "Title and code content are required.");
      return;
    }

    const input = {
      title: title.trim(),
      language: language.trim() || "Text",
      tags: tags.trim(),
      code,
      screenshot
    };

    if (editingId) await updateSnippet(editingId, input);
    else await createSnippet(input);

    navigation.goBack();
  };

  const attach = async () => {
    const uri = await pickScreenshot();
    if (uri) setScreenshot(uri);
  };

  return (
    <Screen dark={dark}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title dark={dark}>{editingId ? "Edit Snippet" : "Create Snippet"}</Title>

        <Input dark={dark} placeholder="Title" value={title} onChangeText={setTitle} />
        <Input dark={dark} placeholder="Programming language" value={language} onChangeText={setLanguage} />
        <Input dark={dark} placeholder="Tags, comma separated" value={tags} onChangeText={setTags} />

        <Text style={{ color: c.text, fontWeight: "700", marginBottom: 6 }}>Code Content</Text>
        <Input
          dark={dark}
          placeholder="Paste or type your code..."
          value={code}
          onChangeText={setCode}
          multiline
          textAlignVertical="top"
          style={{ minHeight: 260, fontFamily: "monospace" }}
        />

        <Card dark={dark}>
          <Muted dark={dark}>Attach a screenshot related to this snippet.</Muted>
          {screenshot ? (
            <Image source={{ uri: screenshot }} style={{ height: 160, borderRadius: 12, marginVertical: 10 }} />
          ) : null}
          <Button label="Attach Screenshot" dark={dark} variant="ghost" onPress={attach} />
        </Card>

        <Button label={editingId ? "Update Snippet" : "Save Snippet"} dark={dark} onPress={save} />
      </ScrollView>
    </Screen>
  );
}
