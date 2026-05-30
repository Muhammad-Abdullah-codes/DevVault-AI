import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { ManagedFile } from "../types";
import {
  copyManagedFile,
  deleteManagedFile,
  folders,
  importLocalFile,
  listManagedFiles,
  moveManagedFile,
  readTextFile
} from "../services/fileService";
import { shareFile } from "../services/exportService";
import { Button, Card, Muted, Screen, Title, usePalette } from "../components/ui";

const folderList = [
  { label: "Screenshots", uri: folders.screenshots },
  { label: "Exports", uri: folders.exports },
  { label: "Templates", uri: folders.templates },
  { label: "Downloads", uri: folders.downloads }
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
      setPreview("Preview is available for text/code files. You can still share, move, copy, or delete this file.");
    }
  };

  const chooseTarget = (file: ManagedFile, move: boolean) => {
    Alert.alert(move ? "Move file" : "Copy file", "Choose target folder", folderList.map((f) => ({
      text: f.label,
      onPress: async () => {
        if (move) await moveManagedFile(file.uri, f.uri);
        else await copyManagedFile(file.uri, f.uri);
        setPreview("");
        load();
      }
    })).concat([{ text: "Cancel", style: "cancel" as const }]));
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
        }
      }
    ]);
  };

  const importFile = async () => {
    await importLocalFile();
    setCurrentFolder(folderList[3]);
    load();
  };

  return (
    <Screen dark={dark}>
      <Title dark={dark}>File Manager</Title>
      <Muted dark={dark}>Browse, import, delete, move, copy, and share local developer files.</Muted>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 10 }}>
        {folderList.map((f) => (
          <TouchableOpacity key={f.uri} onPress={() => setCurrentFolder(f)}>
            <Text style={{
              color: currentFolder.uri === f.uri ? "#FFFFFF" : c.primary,
              backgroundColor: currentFolder.uri === f.uri ? c.primary : "transparent",
              borderColor: c.border,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 999,
              fontWeight: "700"
            }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button label="Import / Download Resource" dark={dark} onPress={importFile} />

      <FlatList
        data={files}
        keyExtractor={(item) => item.uri}
        ListEmptyComponent={<Muted dark={dark}>No files in this folder.</Muted>}
        renderItem={({ item }) => (
          <Card dark={dark}>
            <TouchableOpacity onPress={() => openFile(item)}>
              <Text style={{ color: c.text, fontWeight: "800" }}>{item.isDirectory ? "📁" : "📄"} {item.name}</Text>
              <Muted dark={dark}>{Math.round((item.size ?? 0) / 1024)} KB</Muted>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              <Button label="Share" dark={dark} variant="ghost" onPress={() => shareFile(item.uri)} />
              <Button label="Copy" dark={dark} variant="ghost" onPress={() => chooseTarget(item, false)} />
              <Button label="Move" dark={dark} variant="ghost" onPress={() => chooseTarget(item, true)} />
              <Button label="Delete" dark={dark} variant="danger" onPress={() => remove(item)} />
            </View>
          </Card>
        )}
      />

      {preview ? (
        <Card dark={dark}>
          <Title dark={dark} style={{ fontSize: 18 }}>Preview</Title>
          <Text selectable style={{ color: c.text, fontFamily: "monospace" }}>{preview}</Text>
        </Card>
      ) : null}
    </Screen>
  );
}
