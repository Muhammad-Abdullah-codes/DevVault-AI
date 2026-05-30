import React, { useCallback, useState } from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { useFocusEffect, NativeStackScreenProps } from "@react-navigation/native";
import { RootStackParamList, Snippet } from "../types";
import { getAllSnippets, getStats } from "../database/sqlite";
import { Button, Card, Input, Muted, Screen, Title, usePalette } from "../components/ui";

type Props = NativeStackScreenProps<RootStackParamList, "Tabs"> & { dark: boolean };

export function HomeScreen({ navigation, dark }: Props) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, favorites: 0, languages: 0 });
  const c = usePalette(dark);

  const load = async (q = search) => {
    setSnippets(await getAllSnippets(q));
    setStats(await getStats());
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const doSearch = async (text: string) => {
    setSearch(text);
    setSnippets(await getAllSnippets(text));
  };

  return (
    <Screen dark={dark}>
      <Title dark={dark}>DevVault AI</Title>
      <Muted dark={dark}>Offline code snippets, local files, and AI explanations.</Muted>

      <Input dark={dark} placeholder="Search by title, code, language, tags..." value={search} onChangeText={doSearch} />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Card dark={dark} style={{ flex: 1 }}>
          <Title dark={dark} style={{ fontSize: 20 }}>{stats.total}</Title>
          <Muted dark={dark}>Snippets</Muted>
        </Card>
        <Card dark={dark} style={{ flex: 1 }}>
          <Title dark={dark} style={{ fontSize: 20 }}>{stats.favorites}</Title>
          <Muted dark={dark}>Favorites</Muted>
        </Card>
        <Card dark={dark} style={{ flex: 1 }}>
          <Title dark={dark} style={{ fontSize: 20 }}>{stats.languages}</Title>
          <Muted dark={dark}>Languages</Muted>
        </Card>
      </View>

      <Button label="+ Create Snippet" dark={dark} onPress={() => navigation.navigate("CreateSnippet")} />

      <FlatList
        data={snippets}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Muted dark={dark}>No snippets yet. Create your first one.</Muted>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("SnippetDetail", { id: item.id })}>
            <Card dark={dark}>
              <Text style={{ color: c.text, fontWeight: "800", fontSize: 16 }}>
                {item.isFavorite ? "⭐ " : ""}{item.title}
              </Text>
              <Muted dark={dark}>{item.language} • {item.tags || "no tags"}</Muted>
              <Text numberOfLines={2} style={{ color: c.muted, marginTop: 8, fontFamily: "monospace" }}>
                {item.code}
              </Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
