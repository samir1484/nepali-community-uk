import "server-only";
import type { AIProvider, ChatTurn } from "./types";

/**
 * Calls Anthropic's Messages API over plain fetch rather than the SDK. The
 * chatbot's default path is the rule-based responder, so pulling in an SDK
 * that only runs once an API key is configured would be dead weight in every
 * deploy. Swapping to the SDK later is a change to this one file.
 */
export class AnthropicProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY is not set.");
    this.apiKey = key;
    this.model = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";
  }

  async chat(messages: ChatTurn[], systemPrompt: string): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 600,
        temperature: 0.4,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
      // A hanging model call shouldn't hold a serverless function open.
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    // Scan for the first text block rather than assuming content[0] is text.
    const textBlock = data.content?.find((block) => block.type === "text");
    return textBlock?.text ?? "";
  }
}
