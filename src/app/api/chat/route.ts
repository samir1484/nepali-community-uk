import { NextResponse, type NextRequest } from "next/server";
import { chatRequestSchema } from "@/lib/validation/chat";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getGroundingData } from "@/lib/chat/grounding";
import { getRuleBasedReply, buildSystemPrompt } from "@/lib/chat/responder";
import { detectLanguage, type ChatLanguage } from "@/lib/chat/language";
import { getAIProvider } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(`chat:${ip}`, 60, 15);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages — please wait a moment before sending more." },
      { status: 429 }
    );
  }

  const { message, history } = parsed.data;

  // The visitor's toggle is authoritative. Detection only steps in when they
  // clearly switched language mid-conversation without touching the toggle.
  const detected = detectLanguage(message);
  const language: ChatLanguage = detected ?? parsed.data.language;

  const data = await getGroundingData();
  let reply = "";
  let source: "ai" | "rules" = "rules";
  let aiError: string | null = null;

  try {
    const provider = getAIProvider();
    const aiReply = await provider.chat(
      [...history, { role: "user", content: message }],
      buildSystemPrompt(data, language)
    );
    if (aiReply.trim()) {
      reply = aiReply.trim();
      source = "ai";
    }
  } catch (err) {
    // Unset AI_PROVIDER lands here too, which is the normal case — the
    // rule-based reply below is the intended default, not a degraded state.
    if (process.env.AI_PROVIDER) {
      console.error("AI chat call failed, using rule-based reply", err);
      aiError = err instanceof Error ? err.message : "unknown error";
    }
  }

  if (!reply) reply = getRuleBasedReply(message, data, language);

  // Diagnostics for setting a provider up. Deliberately says only which
  // provider is *named* and whether a key is present — never the key itself,
  // and the error text only when a provider was explicitly configured, so an
  // unconfigured site leaks nothing.
  const diagnostics = process.env.AI_PROVIDER
    ? {
        aiProvider: process.env.AI_PROVIDER,
        aiKeyPresent: Boolean(
          process.env.GROQ_API_KEY ??
            process.env.GEMINI_API_KEY ??
            process.env.ANTHROPIC_API_KEY ??
            process.env.OPENAI_API_KEY
        ),
        ...(aiError ? { aiError } : {}),
      }
    : { aiProvider: null };

  return NextResponse.json({ reply, language, source, ...diagnostics });
}
