import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { Snippet } from "../types";
import { folders, writeCodeFile } from "./fileService";

function extensionFor(language: string, format: "txt" | "js" | "json") {
  if (format === "json") return "json";
  if (format === "txt") return "txt";

  const lang = language.toLowerCase();

  if (lang.includes("typescript")) return "ts";
  if (lang.includes("python")) return "py";
  if (lang.includes("java")) return "java";
  if (lang.includes("css")) return "css";
  if (lang.includes("html")) return "html";

  return "js";
}

export async function exportSnippet(
  snippet: Snippet,
  format: "txt" | "js" | "json",
) {
  const ext = extensionFor(snippet.language, format);
  const base =
    snippet.title
      .trim()
      .toLowerCase()
      .replace(/[^\w]+/g, "-") || "snippet";

  const name = `${base}.${ext}`;

  const body =
    format === "json"
      ? JSON.stringify(snippet, null, 2)
      : `// ${snippet.title}\\n// Language: ${snippet.language}\\n// Tags: ${snippet.tags}\\n\\n${snippet.code}`;

  return await writeCodeFile(name, body, folders.exports);
}

export async function shareFile(uri: string) {
  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(uri);
}

export async function getFileSize(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  return info.exists && "size" in info ? (info.size ?? 0) : 0;
}
