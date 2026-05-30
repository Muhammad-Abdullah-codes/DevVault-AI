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
