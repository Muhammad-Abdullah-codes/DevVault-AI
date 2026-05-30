import * as SecureStore from "expo-secure-store";

const API_KEY = "devvault.ai.apiKey";

export async function saveApiKey(key: string) {
  await SecureStore.setItemAsync(API_KEY, key.trim());
}

export async function getApiKey() {
  return await SecureStore.getItemAsync(API_KEY);
}

export async function deleteApiKey() {
  await SecureStore.deleteItemAsync(API_KEY);
}
