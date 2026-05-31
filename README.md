# 🚀 DevVault AI (DevSnippets)

An **offline-first** code snippet vault for mobile developers, featuring local file management and AI-powered code explanations. Built to help developers store, organize, and understand reusable code directly on their device, even without an internet connection.

---

## ✨ Core Features

- **⚡ Offline-First Architecture:** Core functionality works 100% offline. Snippets are saved locally using SQLite.
- **🤖 AI Code Assistant:** Securely provide an OpenAI API key to generate code explanations, summaries, and improvement suggestions. Includes a built-in offline fallback.
- **📂 Local File Manager:** Manage developer resources using Expo FileSystem. Supports virtual folders (Screenshots, Exports, Templates, Downloads), file movement, and importing.
- **🔍 Smart Snippet Management:** Create, edit, delete, favorite, and search snippets by title, tags, or language.
- **📤 Export & Sharing:** Export code as `.txt`, `.js`, or `.json` files and share them directly to other mobile applications.
- **🌗 Adaptive UI:** A highly polished, native-feeling interface with automatic Dark/Light mode support and safe-area handling.

---

## 🛠️ Tech Stack & Storage Implementation

This project strictly adheres to separation of concerns for device storage:

| Technology                 | Usage in App                                                              |
| :------------------------- | :------------------------------------------------------------------------ |
| **React Native & Expo**    | Core framework and cross-platform native compilation.                     |
| **TypeScript**             | Strict typing for robust models and navigation props.                     |
| **SQLite (`expo-sqlite`)** | Relational database for storing snippets and AI history.                  |
| **AsyncStorage**           | Lightweight key-value store for User Preferences (Dark/Light mode).       |
| **SecureStore**            | Encrypted keychain storage for the user's OpenAI API Key.                 |
| **FileSystem**             | Document directory management for exporting files and saving screenshots. |

---

## 🏗️ Architecture & Implementation Details

_(As required by the assignment parameters)_

### 1. Database Structure

The application uses a local SQLite database (`devvault.db`) initialized with two primary tables:

- `snippets`: Stores `id`, `title`, `code`, `language`, `tags`, `isFavorite`, and `screenshot` (URI).
- `ai_history`: A relational table linked via `snippetId` to track the history of AI prompts (`explain`, `summary`, `improve`) and their generated responses.

### 2. Offline Storage Approach

The app utilizes a **Local-First** approach. Read and write operations (CRUD) are executed directly against the local SQLite instance. This guarantees zero-latency saves and ensures that the developer can access their entire vault while offline.

### 3. File Management Implementation

Using `expo-file-system`, the app partitions the device's Document Directory into virtual folders: `Screenshots/`, `Exports/`, `Templates/`, and `Downloads/`. The File Manager screen reads these directories dynamically, calculating file sizes and allowing users to invoke native OS APIs to copy, move, delete, or share files safely without cluttering the user's main photo gallery.

### 4. AI Integration Workflow

The AI pipeline is designed with security and resilience in mind:

1.  The user's API key is securely saved to the device's encrypted keychain using `expo-secure-store`.
2.  When an AI action is triggered, the app fetches the key, constructs a system prompt based on the user's intent, and sends a REST request to OpenAI.
3.  **Offline Fallback:** If the API key is missing, or if the fetch fails (due to no internet), the app catches the error and generates a local algorithmic summary based on code length and characteristics, ensuring the UI never breaks.

---

## 📱 Demo & Screenshots

Watch the full walkthrough of the app's features, including offline storage, AI explanations, and local file management:

### 🎬 [Watch the App Demo Video](./demo/screen-recording.mp4)
