import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { ManagedFile } from "../types";

const root = `${FileSystem.documentDirectory}DevVaultAI/`;

export const folders = {
  root,
  screenshots: `${root}Screenshots/`,
  exports: `${root}Exports/`,
  templates: `${root}Templates/`,
  downloads: `${root}Downloads/`,
};

export async function ensureAppFolders() {
  for (const uri of Object.values(folders)) {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(uri, { intermediates: true });
    }
  }

  const templateUri = `${folders.templates}react-component-template.js`;
  const templateInfo = await FileSystem.getInfoAsync(templateUri);

  if (!templateInfo.exists) {
    await FileSystem.writeAsStringAsync(
      templateUri,
      "export default function Component() {\\n  return null;\\n}\\n",
    );
  }
}

export async function pickScreenshot(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (result.canceled) return null;

  await ensureAppFolders();

  const asset = result.assets[0];
  const ext = asset.uri.split(".").pop() || "jpg";
  const dest = `${folders.screenshots}screenshot-${Date.now()}.${ext}`;

  await FileSystem.copyAsync({ from: asset.uri, to: dest });
  return dest;
}

export async function importLocalFile() {
  const res = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  });

  if (res.canceled) return null;

  await ensureAppFolders();

  const file = res.assets[0];
  const safeName = file.name.replace(/[^\w.\-]/g, "_");
  const dest = `${folders.downloads}${Date.now()}-${safeName}`;

  await FileSystem.copyAsync({ from: file.uri, to: dest });
  return dest;
}

export async function listManagedFiles(
  folderUri: string,
): Promise<ManagedFile[]> {
  await ensureAppFolders();

  const names = await FileSystem.readDirectoryAsync(folderUri);

  const rows = await Promise.all(
    names.map(async (name) => {
      const uri = `${folderUri}${name}`;
      const info = await FileSystem.getInfoAsync(uri);

      return {
        name,
        uri,
        isDirectory: info.exists ? Boolean(info.isDirectory) : false,
        size: info.exists && "size" in info ? info.size : 0,
        modificationTime:
          info.exists && "modificationTime" in info ? info.modificationTime : 0,
      };
    }),
  );

  return rows.sort(
    (a, b) => Number(b.modificationTime ?? 0) - Number(a.modificationTime ?? 0),
  );
}

export async function deleteManagedFile(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}

export async function copyManagedFile(from: string, targetFolder: string) {
  await ensureAppFolders();

  const name = from.split("/").filter(Boolean).pop() || `file-${Date.now()}`;
  const to = `${targetFolder}${Date.now()}-${name}`;

  await FileSystem.copyAsync({ from, to });
  return to;
}

export async function moveManagedFile(from: string, targetFolder: string) {
  const to = await copyManagedFile(from, targetFolder);
  await deleteManagedFile(from);
  return to;
}

export async function writeCodeFile(
  fileName: string,
  content: string,
  folderUri = folders.exports,
) {
  await ensureAppFolders();

  const safeName = fileName.replace(/[^\w.\-]/g, "_");
  const uri = `${folderUri}${safeName}`;

  await FileSystem.writeAsStringAsync(uri, content);
  return uri;
}

export async function readTextFile(uri: string) {
  return await FileSystem.readAsStringAsync(uri);
}
