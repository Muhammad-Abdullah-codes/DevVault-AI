import React, { useCallback, useState } from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Snippet, TabScreenProps } from "../types";
import { getAllSnippets, getStats } from "../database/sqlite";
import {
  Button,
  Card,
  Input,
  Muted,
  Screen,
  Title,
  usePalette,
} from "../components/ui";

type Props = TabScreenProps<"Home"> & { dark: boolean };

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
    }, []),
  );

  const doSearch = async (text: string) => {
    setSearch(text);
    setSnippets(await getAllSnippets(text));
  };

  const ListHeader = () => (
    <View style={{ paddingBottom: 10 }}>
      <Title dark={dark}>DevVault AI</Title>
      <Muted dark={dark} style={{ marginBottom: 24 }}>
        Offline code snippets, local files, and AI explanations.
      </Muted>

      <Input
        dark={dark}
        placeholder="Search snippets..."
        value={search}
        onChangeText={doSearch}
        icon={<Ionicons name="search" size={20} color={c.muted} />}
      />

      <View style={{ flexDirection: "row", gap: 12, marginVertical: 12 }}>
        <Card
          dark={dark}
          style={{ flex: 1, alignItems: "center", padding: 16 }}
        >
          <Ionicons
            name="code-slash"
            size={24}
            color={c.primary}
            style={{ marginBottom: 8 }}
          />
          <Title dark={dark} style={{ fontSize: 24, marginBottom: 2 }}>
            {stats.total}
          </Title>
          <Muted dark={dark} style={{ fontSize: 13 }}>
            Snippets
          </Muted>
        </Card>
        <Card
          dark={dark}
          style={{ flex: 1, alignItems: "center", padding: 16 }}
        >
          <Ionicons
            name="star"
            size={24}
            color={c.primary}
            style={{ marginBottom: 8 }}
          />
          <Title dark={dark} style={{ fontSize: 24, marginBottom: 2 }}>
            {stats.favorites}
          </Title>
          <Muted dark={dark} style={{ fontSize: 13 }}>
            Favorites
          </Muted>
        </Card>
        <Card
          dark={dark}
          style={{ flex: 1, alignItems: "center", padding: 16 }}
        >
          <Ionicons
            name="layers"
            size={24}
            color={c.primary}
            style={{ marginBottom: 8 }}
          />
          <Title dark={dark} style={{ fontSize: 24, marginBottom: 2 }}>
            {stats.languages}
          </Title>
          <Muted dark={dark} style={{ fontSize: 13 }}>
            Languages
          </Muted>
        </Card>
      </View>

      <Button
        label="Create New Snippet"
        dark={dark}
        icon={<Ionicons name="add-circle" size={20} color="#FFF" />}
        onPress={() => navigation.navigate("CreateSnippet")}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
          marginBottom: 12,
        }}
      >
        <Title dark={dark} style={{ fontSize: 20, marginBottom: 0 }}>
          Recent Snippets
        </Title>
        <Ionicons name="list" size={20} color={c.muted} />
      </View>
    </View>
  );

  return (
    <Screen dark={dark}>
      <FlatList
        data={snippets}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={c.border}
              style={{ marginBottom: 16 }}
            />
            <Muted dark={dark} style={{ textAlign: "center" }}>
              No snippets found. Create your first one to get started.
            </Muted>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("SnippetDetail", { id: item.id })
            }
          >
            <Card dark={dark}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: c.text,
                    fontWeight: "800",
                    fontSize: 17,
                    marginBottom: 6,
                    flex: 1,
                  }}
                >
                  {item.title}
                </Text>
                {item.isFavorite ? (
                  <Ionicons name="star" size={18} color="#F59E0B" />
                ) : null}
              </View>

              <Muted dark={dark} style={{ marginBottom: 14 }}>
                <Ionicons name="terminal-outline" size={14} /> {item.language} •{" "}
                {item.tags || "No tags"}
              </Muted>

              <View
                style={{
                  backgroundColor: dark ? "#000" : "#F8FAFC",
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: c.border,
                }}
              >
                <Text
                  numberOfLines={3}
                  style={{
                    color: c.muted,
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {item.code}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
