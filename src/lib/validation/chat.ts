import { z } from "zod";
import { CHAT_LANGUAGES } from "@/lib/chat/language";

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "Say something first").max(1000),
  language: z.enum(CHAT_LANGUAGES),
  /** Last few turns, sent by the client so the model has context. Capped to
   *  bound both the prompt size and what an abusive caller can push through. */
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .max(10)
    .default([]),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
