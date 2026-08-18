import OpenAI from "openai";

// ponytail: single client, no provider abstraction — one endpoint, one model
const client = new OpenAI({
  apiKey: process.env.ZAI_API_KEY,
  baseURL: "https://api.z.ai/api/coding/paas/v4",
});

export const MODEL = "glm-5.2";

export async function askLLM(
  system: string,
  user: string,
): Promise<string> {
  const r = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.3,
  });
  return r.choices[0]?.message?.content ?? "";
}

/** askLLM + strict JSON extraction. Throws with LLM reply on parse failure. */
export async function askJSON<T>(system: string, user: string): Promise<T> {
  const raw = await askLLM(system, user);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("LLM returned no JSON: " + raw.slice(0, 200));
  return JSON.parse(match[0]) as T;
}
