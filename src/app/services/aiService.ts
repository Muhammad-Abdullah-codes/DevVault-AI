import { getApiKey } from "./secureService";

export type AiMode = "explain" | "summary" | "improve";

function fallback(code: string, mode: AiMode) {
  const lines = code.split("\n").length;
  const chars = code.length;

  if (mode === "summary") {
    return `Offline summary:\nThis snippet contains ${lines} line(s) and ${chars} character(s). It appears to define reusable logic or configuration that you can store and revisit later. Add clear tags and a descriptive title to make it easier to find.`;
  }

  if (mode === "improve") {
    return `Offline improvement suggestions:\n• Use meaningful variable and function names.\n• Add comments only where the logic is not obvious.\n• Handle errors and edge cases.\n• Keep the snippet small and reusable.\n• Add tags for framework, language, and purpose.`;
  }

  return `Offline explanation:\nThis is a locally generated explanation because no API key is configured or the AI request failed. The snippet has ${lines} line(s). Read it from top to bottom, identify inputs, outputs, state changes, and side effects.`;
}

export async function generateAiResponse(code: string, language: string, mode: AiMode) {
  const apiKey = await getApiKey();

  if (!apiKey) return fallback(code, mode);

  const task =
    mode === "explain"
      ? "Explain this code clearly for a developer."
      : mode === "summary"
      ? "Summarize what this code does in short bullet points."
      : "Suggest practical improvements for this code.";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a concise senior software engineer." },
          { role: "user", content: `${task}\nLanguage: ${language}\n\n${code}` }
        ],
        temperature: 0.2
      })
    });

    if (!res.ok) return fallback(code, mode);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || fallback(code, mode);
  } catch {
    return fallback(code, mode);
  }
}
