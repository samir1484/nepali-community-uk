"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatAvatar } from "./ChatAvatar";
import type { ChatLanguage } from "@/lib/chat/language";

type Turn = { role: "user" | "assistant"; content: string };

const COPY: Record<
  ChatLanguage,
  { title: string; subtitle: string; placeholder: string; suggestions: string[]; error: string }
> = {
  en: {
    title: "Community Assistant",
    subtitle: "Ask about jobs, rooms, events or anything on the site",
    placeholder: "Type your question…",
    suggestions: ["What jobs are available?", "How do I post a room?", "Is it free to join?"],
    error: "Sorry, something went wrong. Please try again.",
  },
  ne: {
    title: "समुदाय सहायक",
    subtitle: "जागिर, कोठा, कार्यक्रम वा साइटको बारेमा सोध्नुहोस्",
    placeholder: "तपाईंको प्रश्न लेख्नुहोस्…",
    suggestions: ["कुन जागिर उपलब्ध छ?", "कोठा कसरी राख्ने?", "सामेल हुन निःशुल्क छ?"],
    error: "माफ गर्नुहोस्, केही गडबड भयो। फेरि प्रयास गर्नुहोस्।",
  },
};

const OPENERS: Record<ChatLanguage, string> = {
  en: "Namaste! I can help you find jobs, rooms, events, businesses and more on Nepali Community UK. What are you looking for?",
  ne: "नमस्ते! Nepali Community UK मा जागिर, कोठा, कार्यक्रम, व्यवसाय र अन्य खोज्न सहयोग गर्न सक्छु। तपाईं के खोज्दै हुनुहुन्छ?",
};

export function ChatWidget({ avatarSrc }: { avatarSrc: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<ChatLanguage>("en");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const copy = COPY[language];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, isSending]);

  /**
   * Switching language rewrites the opener but keeps the conversation, so a
   * visitor who changes their mind doesn't lose what they've already asked.
   */
  function switchLanguage(next: ChatLanguage) {
    setLanguage(next);
    setTurns((current) =>
      current.length <= 1 ? [{ role: "assistant", content: OPENERS[next] }] : current
    );
  }

  function open() {
    setIsOpen(true);
    if (turns.length === 0) setTurns([{ role: "assistant", content: OPENERS[language] }]);
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || isSending) return;

    setInput("");
    const nextTurns: Turn[] = [...turns, { role: "user", content: message }];
    setTurns(nextTurns);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message,
          language,
          // Trim the opener and cap history to what the API accepts.
          history: nextTurns.slice(1, -1).slice(-8),
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string; language?: ChatLanguage };

      if (!response.ok || !data.reply) {
        setTurns((c) => [...c, { role: "assistant", content: data.error ?? copy.error }]);
        return;
      }

      // The server may have detected the visitor switched language.
      if (data.language && data.language !== language) setLanguage(data.language);
      setTurns((c) => [...c, { role: "assistant", content: data.reply as string }]);
    } catch {
      setTurns((c) => [...c, { role: "assistant", content: copy.error }]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex h-[30rem] w-[min(22rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-xl border bg-card shadow-2xl">
          <div className="flex items-start justify-between gap-2 border-b bg-secondary/40 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <ChatAvatar src={avatarSrc} px={36} className="size-9 shrink-0" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{copy.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{copy.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-1 border-b px-3 py-2" role="group" aria-label="Reply language">
            {(["en", "ne"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLanguage(code)}
                aria-pressed={language === code}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  language === code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {code === "en" ? "English" : "नेपाली"}
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {turns.map((turn, index) =>
              turn.role === "user" ? (
                <div
                  key={index}
                  className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                >
                  {turn.content}
                </div>
              ) : (
                <div key={index} className="flex items-end gap-2">
                  <ChatAvatar src={avatarSrc} px={28} className="size-7 shrink-0" />
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                    {turn.content}
                  </div>
                </div>
              )
            )}

            {isSending && (
              <div className="flex items-end gap-2">
                <ChatAvatar src={avatarSrc} px={28} className="size-7 shrink-0" />
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 size={14} className="animate-spin" />
                  {language === "ne" ? "सोच्दै…" : "Thinking…"}
                </div>
              </div>
            )}

            {turns.length <= 1 && !isSending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {copy.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t px-3 py-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
              maxLength={1000}
              className="flex-1"
            />
            <Button type="submit" size="icon-sm" disabled={!input.trim() || isSending} aria-label="Send">
              <Send size={14} />
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        aria-label={isOpen ? "Close community assistant" : "Open community assistant"}
        aria-expanded={isOpen}
        className={cn(
          "flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-lg ring-2 ring-brand-crimson transition-transform duration-300 hover:scale-105 active:scale-95",
          isOpen ? "bg-brand-crimson text-white" : "bg-[#f4ede3]"
        )}
      >
        {isOpen ? <X size={24} /> : <ChatAvatar src={avatarSrc} px={56} className="size-14" />}
      </button>
    </div>
  );
}
