import "server-only";
import type { AIProvider, ChatTurn } from "./types";

/**
 * Groq — free tier, and by far the fastest of the options because it runs on
 * custom inference hardware. Its API is OpenAI-compatible, so this is the
 * OpenAI provider pointed at a different host with a different default model.
 *
 * Worth knowing when picking between providers: Groq's free Llama models are
 * weaker at Nepali/Devanagari than Gemini is, so replies in Nepali can read
 * more stilted. The rule-based responder still handles the common questions in
 * proper Nepali either way, since it only defers to the model for open-ended
 * ones.
 */
export class GroqProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    const key = process.env.GROQ_API_KEY;
    if (!key) throw new Error("GROQ_API_KEY is not set.");
    this.apiKey = key;
    this.model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  }

  async chat(messages: ChatTurn[], systemPrompt: string): Promise<string> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 600,
        temperature: 0.4,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw new Error(`Groq API ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  }
}
