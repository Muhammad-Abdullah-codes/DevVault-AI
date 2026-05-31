import React, { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Snippet, TabScreenProps } from "../types";
import { getFavoriteSnippets } from "../database/sqlite";
import { Card, Muted, Screen, Title, usePalette } from "../components/ui";

type Props = TabScreenProps<"Favorites"> & { dark: boolean };

export function FavoritesScreen({ navigation, dark }: Props) {
  const [rows, setRows] = useState<Snippet[]>([]);
  const c = usePalette(dark);

  useFocusEffect(
    useCallback(() => {
      getFavoriteSnippets().then(setRows);
    }, []),
  );

  return (
    <Screen dark={dark}>
      <Title dark={dark}>Favorites</Title>
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Muted dark={dark}>No favorite snippets yet.</Muted>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SnippetDetail", { id: item.id })
            }
          >
            <Card dark={dark}>
              <Text style={{ color: c.text, fontWeight: "800", fontSize: 16 }}>
                ⭐ {item.title}
              </Text>
              <Muted dark={dark}>
                {item.language} • {item.tags}
              </Muted>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
