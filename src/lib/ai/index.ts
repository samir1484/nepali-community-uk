import "server-only";
import { AnthropicProvider } from "./anthropic-provider";
import { OpenAIProvider } from "./openai-provider";
import { GeminiProvider } from "./gemini-provider";
import { GroqProvider } from "./groq-provider";
import type { AIProvider } from "./types";

let cachedProvider: AIProvider | null = null;

/**
 * Single factory — nothing else should import a concrete provider. Switching
 * providers is one env var (AI_PROVIDER=anthropic|openai). Throws when unset
 * or misconfigured, and callers wrap this in try/catch, so "no key yet"
 * degrades to the same rule-based fallback as a provider outage instead of
 * needing its own code path.
 */
export function getAIProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  const providerName = process.env.AI_PROVIDER;
  if (providerName === "groq") {
    cachedProvider = new GroqProvider();
  } else if (providerName === "gemini") {
    cachedProvider = new GeminiProvider();
  } else if (providerName === "anthropic") {
    cachedProvider = new AnthropicProvider();
  } else if (providerName === "openai") {
    cachedProvider = new OpenAIProvider();
  } else {
    throw new Error(
      `AI_PROVIDER must be "groq", "gemini", "anthropic" or "openai", got: ${providerName ?? "(unset)"}`
    );
  }

  return cachedProvider;
}

export type { AIProvider, ChatTurn } from "./types";
