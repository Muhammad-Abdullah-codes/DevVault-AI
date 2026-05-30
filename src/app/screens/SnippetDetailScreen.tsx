import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Snippet } from "../types";
import { deleteSnippet, getSnippet, saveAiHistory, toggleFavorite } from "../database/sqlite";
import { generateAiResponse, AiMode } from "../services/aiService";
import { exportSnippet, shareFile } from "../services/exportService";
import { Button, Card, Muted, Screen, Title, usePalette } from "../components/ui";

type Props = NativeStackScreenProps<RootStackParamList, "SnippetDetail"> & { dark: boolean };

export function SnippetDetailScreen({ navigation, route, dark }: Props) {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [aiText, setAiText] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const c = usePalette(dark);

  const load = async () => setSnippet(await getSnippet(route.params.id));

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [route.params.id]);

  const remove = () => {
    Alert.alert("Delete snippet?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteSnippet(route.params.id);
          navigation.goBack();
        }
      }
    ]);
  };

  const favorite = async () => {
    if (!snippet) return;
    await toggleFavorite(snippet.id, snippet.isFavorite);
    await load();
  };

  const runAi = async (mode: AiMode) => {
    if (!snippet) return;
    setLoadingAi(true);
    const result = await generateAiResponse(snippet.code, snippet.language, mode);
    setAiText(result);
    await saveAiHistory(snippet.id, mode, result);
    setLoadingAi(false);
  };

  const exportAndShare = async (format: "txt" | "js" | "json", share = false) => {
    if (!snippet) return;
    const uri = await exportSnippet(snippet, format);
    if (share) await shareFile(uri);
    Alert.alert("Exported", `Saved locally:\n${uri}`);
  };

  if (!snippet) {
    return (
      <Screen dark={dark}>
        <Muted dark={dark}>Snippet not found.</Muted>
      </Screen>
    );
  }

  return (
    <Screen dark={dark}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title dark={dark}>{snippet.isFavorite ? "⭐ " : ""}{snippet.title}</Title>
        <Muted dark={dark}>{snippet.language} • {snippet.tags || "no tags"}</Muted>

        {snippet.screenshot ? (
          <Image source={{ uri: snippet.screenshot }} style={{ height: 180, borderRadius: 16, marginVertical: 12 }} />
        ) : null}

        <Card dark={dark} style={{ backgroundColor: c.code }}>
          <Text selectable style={{ color: "#E2E8F0", fontFamily: "monospace", lineHeight: 20 }}>
            {snippet.code}
          </Text>
        </Card>

        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Button label={snippet.isFavorite ? "Unfavorite" : "Favorite"} dark={dark} onPress={favorite} />
          <Button label="Edit" dark={dark} variant="ghost" onPress={() => navigation.navigate("CreateSnippet", { id: snippet.id })} />
          <Button label="Delete" dark={dark} variant="danger" onPress={remove} />
        </View>

        <Card dark={dark}>
          <Title dark={dark} style={{ fontSize: 18 }}>AI Code Explanation</Title>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            <Button label="Explain" dark={dark} onPress={() => runAi("explain")} />
            <Button label="Summary" dark={dark} variant="ghost" onPress={() => runAi("summary")} />
            <Button label="Improve" dark={dark} variant="ghost" onPress={() => runAi("improve")} />
          </View>
          <Text selectable style={{ color: c.text, marginTop: 10, lineHeight: 21 }}>
            {loadingAi ? "Generating..." : aiText || "Select an AI action to generate a response."}
          </Text>
        </Card>

        <Card dark={dark}>
          <Title dark={dark} style={{ fontSize: 18 }}>Export & Sharing</Title>
          <Button label="Save as .txt" dark={dark} variant="ghost" onPress={() => exportAndShare("txt")} />
          <Button label="Save as code file" dark={dark} variant="ghost" onPress={() => exportAndShare("js")} />
          <Button label="Save as .json" dark={dark} variant="ghost" onPress={() => exportAndShare("json")} />
          <Button label="Share Code File" dark={dark} onPress={() => exportAndShare("js", true)} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
