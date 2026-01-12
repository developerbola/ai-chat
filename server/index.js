import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamText } from "hono/streaming";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { handle } from "hono/vercel";

const app = new Hono();
const client = new Cerebras({
  apiKey: process.env["CEREBRAS_API_KEY"],
});

app.use("/*", cors());

app.post("/chat", async (c) => {
  const { messages, model } = await c.req.json();

  if (!messages || !Array.isArray(messages)) {
    return c.json({ error: "Messages array is required" }, 400);
  }

  return streamText(c, async (stream) => {
    try {
      const completion = await client.chat.completions.create({
        messages: messages,
        model: model || "llama-3.3-70b",
        stream: true,
      });

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          await stream.write(content);
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      await stream.write("Error: Failed to generate response");
    }
  });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
export const DELETE = handler;
