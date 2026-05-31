import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps } from "@react-navigation/native";

export type Snippet = {
  id: number;
  title: string;
  code: string;
  language: string;
  tags: string;
  isFavorite: number;
  screenshot?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SnippetInput = {
  title: string;
  code: string;
  language: string;
  tags: string;
  screenshot?: string | null;
};

export type ManagedFile = {
  name: string;
  uri: string;
  isDirectory: boolean;
  size?: number;
  modificationTime?: number;
};

export type RootStackParamList = {
  Tabs: undefined;
  CreateSnippet: { id?: number } | undefined;
  SnippetDetail: { id: number };
};

export type BottomTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Files: undefined;
  Settings: undefined;
};

// --- CRITICAL NAVIGATION TYPE ---
// This composite type allows screens inside the BottomTabs (like Home and Favorites)
// to securely navigate to screens in the RootStack (like SnippetDetail).
export type TabScreenProps<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
