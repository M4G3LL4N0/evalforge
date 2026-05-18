const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function getModelIds() {
  return {
    fast: process.env.OPENROUTER_MODEL_FAST || "openai/gpt-4o-mini",
    deep: process.env.OPENROUTER_MODEL_DEEP || "anthropic/claude-3.5-haiku",
    skeptic: process.env.OPENROUTER_MODEL_SKEPTIC || "deepseek/deepseek-chat",
    judge: process.env.OPENROUTER_MODEL_JUDGE || "google/gemini-flash-1.5",
  };
}

function openRouterHeaders(apiKey: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const referer = process.env.OPENROUTER_HTTP_REFERER || process.env.NEXT_PUBLIC_APP_URL;
  if (referer) headers["HTTP-Referer"] = referer;
  headers["X-Title"] = process.env.OPENROUTER_APP_TITLE || "EvalForge";

  return headers;
}

export async function callOpenRouter(params: {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
}): Promise<{ content: string; model: string; raw: Record<string, unknown> }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY. Add it to .env.local and restart the server.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: openRouterHeaders(apiKey),
    body: JSON.stringify({
      model: params.model,
      messages: params.messages,
      temperature: params.temperature ?? 0.2,
      max_tokens: params.maxTokens ?? 4096,
    }),
  });

  const text = await response.text();
  let raw: Record<string, unknown> = {};
  try {
    raw = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    raw = { text };
  }

  if (!response.ok) {
    const error = raw.error;
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message)
        : text || response.statusText;
    throw new Error(`OpenRouter error for ${params.model}: ${message}`);
  }

  const choice = Array.isArray(raw.choices) ? raw.choices[0] : undefined;
  const message = choice && typeof choice === "object" && "message" in choice ? choice.message : undefined;
  const content =
    message && typeof message === "object" && message !== null && "content" in message
      ? String((message as { content?: unknown }).content ?? "")
      : "";

  if (!content.trim()) {
    throw new Error(`OpenRouter returned an empty response for ${params.model}.`);
  }

  return { content, model: params.model, raw };
}
