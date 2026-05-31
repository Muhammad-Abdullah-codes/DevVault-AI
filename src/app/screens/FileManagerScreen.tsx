import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertButton,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ManagedFile } from "../types";
import {
  copyManagedFile,
  deleteManagedFile,
  folders,
  importLocalFile,
  listManagedFiles,
  moveManagedFile,
  readTextFile,
} from "../services/fileService";
import { shareFile } from "../services/exportService";
import {
  Button,
  Card,
  Muted,
  Screen,
  Title,
  usePalette,
} from "../components/ui";

const folderList = [
  { label: "Screenshots", uri: folders.screenshots, icon: "image" as const },
  { label: "Exports", uri: folders.exports, icon: "share" as const },
  { label: "Templates", uri: folders.templates, icon: "copy" as const },
  { label: "Downloads", uri: folders.downloads, icon: "download" as const },
];

export function FileManagerScreen({ dark }: { dark: boolean }) {
  const [currentFolder, setCurrentFolder] = useState(folderList[1]);
  const [files, setFiles] = useState<ManagedFile[]>([]);
  const [preview, setPreview] = useState("");
  const c = usePalette(dark);

  const load = async () => setFiles(await listManagedFiles(currentFolder.uri));

  useEffect(() => {
    load();
  }, [currentFolder.uri]);

  const openFile = async (file: ManagedFile) => {
    if (file.isDirectory) return;
    if (/\.(txt|js|json|ts|tsx|css|html|py)$/i.test(file.name)) {
      setPreview(await readTextFile(file.uri));
    } else {
      setPreview(
        "Preview is only available for text/code files. You can still share, move, or delete this file.",
      );
    }
  };

  const chooseTarget = (file: ManagedFile, move: boolean) => {
    const buttons: AlertButton[] = folderList.map((f) => ({
      text: f.label,
      onPress: async () => {
        if (move) await moveManagedFile(file.uri, f.uri);
        else await copyManagedFile(file.uri, f.uri);
        setPreview("");
        load();
      },
    }));
    buttons.push({ text: "Cancel", style: "cancel" });
    Alert.alert(
      move ? "Move file" : "Copy file",
      "Choose target folder",
      buttons,
    );
  };

  const remove = (file: ManagedFile) => {
    Alert.alert("Delete file?", file.name, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteManagedFile(file.uri);
          setPreview("");
          load();
        },
      },
    ]);
  };

  const importFile = async () => {
    await importLocalFile();
    setCurrentFolder(folderList[3]); // Switch to downloads
    load();
  };

  return (
    <Screen dark={dark}>
      <Title dark={dark}>File Manager</Title>
      <Muted dark={dark} style={{ marginBottom: 16 }}>
        Browse, import, and manage local resources.
      </Muted>

      {/* Horizontal Scroll for Folder Pills */}
      <View style={{ marginHorizontal: -20, marginBottom: 20 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        >
          {folderList.map((f) => {
            const isActive = currentFolder.uri === f.uri;
            return (
              <TouchableOpacity
                key={f.uri}
                activeOpacity={0.7}
                onPress={() => setCurrentFolder(f)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isActive
                    ? c.primary
                    : dark
                      ? "#1E293B"
                      : "#F1F5F9",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isActive ? c.primary : c.border,
                }}
              >
                <Ionicons
                  name={f.icon}
                  size={16}
                  color={isActive ? "#FFF" : c.text}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: isActive ? "#FFF" : c.text,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Button
        label="Import File / Resource"
        dark={dark}
        variant="outline"
        icon={
          <Ionicons name="cloud-download-outline" size={20} color={c.primary} />
        }
        onPress={importFile}
      />

      <FlatList
        data={files}
        keyExtractor={(item) => item.uri}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 12 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Ionicons
              name="folder-open-outline"
              size={48}
              color={c.border}
              style={{ marginBottom: 16 }}
            />
            <Muted dark={dark}>No files in this folder.</Muted>
          </View>
        }
        renderItem={({ item }) => (
          <Card dark={dark}>
            <TouchableOpacity
              onPress={() => openFile(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: dark ? "#0F172A" : "#F1F5F9",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name={item.isDirectory ? "folder" : "document-text"}
                  size={22}
                  color={c.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: c.text,
                    fontWeight: "700",
                    fontSize: 16,
                    marginBottom: 2,
                  }}
                >
                  {item.name}
                </Text>
                <Muted dark={dark} style={{ fontSize: 13 }}>
                  {Math.round((item.size ?? 0) / 1024)} KB
                </Muted>
              </View>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                gap: 8,
                flexWrap: "wrap",
                borderTopWidth: 1,
                borderTopColor: c.border,
                paddingTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => shareFile(item.uri)}
                style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
              >
                <Ionicons name="share-outline" size={20} color={c.primary} />
                <Text
                  style={{
                    fontSize: 12,
                    color: c.primary,
                    marginTop: 4,
                    fontWeight: "600",
                  }}
                >
                  Share
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => chooseTarget(item, false)}
                style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
              >
                <Ionicons name="copy-outline" size={20} color={c.primary} />
                <Text
                  style={{
                    fontSize: 12,
                    color: c.primary,
                    marginTop: 4,
                    fontWeight: "600",
                  }}
                >
                  Copy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => chooseTarget(item, true)}
                style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
              >
                <Ionicons name="move-outline" size={20} color={c.primary} />
                <Text
                  style={{
                    fontSize: 12,
                    color: c.primary,
                    marginTop: 4,
                    fontWeight: "600",
                  }}
                >
                  Move
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => remove(item)}
                style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
              >
                <Ionicons name="trash-outline" size={20} color={c.danger} />
                <Text
                  style={{
                    fontSize: 12,
                    color: c.danger,
                    marginTop: 4,
                    fontWeight: "600",
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />

      {preview ? (
        <Card dark={dark} style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Title dark={dark} style={{ fontSize: 18, marginBottom: 0 }}>
              Preview
            </Title>
            <TouchableOpacity onPress={() => setPreview("")}>
              <Ionicons name="close-circle" size={24} color={c.muted} />
            </TouchableOpacity>
          </View>
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
              selectable
              style={{
                color: c.text,
                fontFamily: "monospace",
                fontSize: 13,
                lineHeight: 20,
              }}
            >
              {preview}
            </Text>
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}
