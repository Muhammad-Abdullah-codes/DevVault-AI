import * as SQLite from "expo-sqlite";
import { Snippet, SnippetInput } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (!db) db = await SQLite.openDatabaseAsync("devvault.db");
  return db;
}

export async function initDatabase() {
  const database = await getDb();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      tags TEXT DEFAULT '',
      isFavorite INTEGER DEFAULT 0,
      screenshot TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      snippetId INTEGER,
      promptType TEXT NOT NULL,
      response TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(snippetId) REFERENCES snippets(id) ON DELETE CASCADE
    );
  `);
}

export async function createSnippet(input: SnippetInput) {
  const database = await getDb();
  const now = new Date().toISOString();
  const result = await database.runAsync(
    `INSERT INTO snippets (title, code, language, tags, screenshot, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [input.title, input.code, input.language, input.tags, input.screenshot ?? null, now, now]
  );
  return result.lastInsertRowId;
}

export async function updateSnippet(id: number, input: SnippetInput) {
  const database = await getDb();
  const now = new Date().toISOString();
  await database.runAsync(
    `UPDATE snippets
     SET title = ?, code = ?, language = ?, tags = ?, screenshot = ?, updatedAt = ?
     WHERE id = ?`,
    [input.title, input.code, input.language, input.tags, input.screenshot ?? null, now, id]
  );
}

export async function deleteSnippet(id: number) {
  const database = await getDb();
  await database.runAsync(`DELETE FROM snippets WHERE id = ?`, [id]);
}

export async function toggleFavorite(id: number, current: number) {
  const database = await getDb();
  await database.runAsync(`UPDATE snippets SET isFavorite = ?, updatedAt = ? WHERE id = ?`, [
    current ? 0 : 1,
    new Date().toISOString(),
    id
  ]);
}

export async function getSnippet(id: number): Promise<Snippet | null> {
  const database = await getDb();
  return await database.getFirstAsync<Snippet>(`SELECT * FROM snippets WHERE id = ?`, [id]);
}

export async function getAllSnippets(search = ""): Promise<Snippet[]> {
  const database = await getDb();
  const q = `%${search.trim()}%`;
  return await database.getAllAsync<Snippet>(
    `SELECT * FROM snippets
     WHERE title LIKE ? OR code LIKE ? OR language LIKE ? OR tags LIKE ?
     ORDER BY updatedAt DESC`,
    [q, q, q, q]
  );
}

export async function getFavoriteSnippets(): Promise<Snippet[]> {
  const database = await getDb();
  return await database.getAllAsync<Snippet>(
    `SELECT * FROM snippets WHERE isFavorite = 1 ORDER BY updatedAt DESC`
  );
}

export async function saveAiHistory(snippetId: number, promptType: string, response: string) {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO ai_history (snippetId, promptType, response, createdAt) VALUES (?, ?, ?, ?)`,
    [snippetId, promptType, response, new Date().toISOString()]
  );
}

export async function getStats() {
  const database = await getDb();
  const total = await database.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM snippets`);
  const fav = await database.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM snippets WHERE isFavorite = 1`);
  const langs = await database.getFirstAsync<{ count: number }>(`SELECT COUNT(DISTINCT language) as count FROM snippets`);
  return {
    total: total?.count ?? 0,
    favorites: fav?.count ?? 0,
    languages: langs?.count ?? 0
  };
}
