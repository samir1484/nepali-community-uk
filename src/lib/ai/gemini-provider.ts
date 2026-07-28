import "server-only";
import type { AIProvider, ChatTurn } from "./types";

/**
 * Google Gemini — the reason this provider exists is its free tier: a key from
 * Google AI Studio costs nothing and needs no card, which makes it the only
 * realistic way to put a real language model behind a community site with no
 * budget. It also handles Nepali and Devanagari noticeably better than the
 * free Llama-based alternatives, which matters for a bilingual assistant.
 *
 * Note Gemini names the assistant role "model" rather than "assistant", and
 * takes the system prompt as a separate system_instruction field.
 */
export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set.");
    this.apiKey = key;
    this.model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
  }

  async chat(messages: ChatTurn[], systemPrompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": this.apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw new Error(`Gemini API ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    // Join every text part — Gemini can split a reply across several.
    return (
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("")
        .trim() ?? ""
    );
  }
}
