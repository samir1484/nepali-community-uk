export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AIProvider {
  chat(messages: ChatTurn[], systemPrompt: string): Promise<string>;
}
