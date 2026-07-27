import "server-only";
import type { AIProvider, ChatTurn } from "./types";

/** See anthropic-provider.ts for why this uses fetch rather than the SDK. */
export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not set.");
    this.apiKey = key;
    this.model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  }

  async chat(messages: ChatTurn[], systemPrompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
      throw new Error(`OpenAI API ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content ?? "";
  }
}
