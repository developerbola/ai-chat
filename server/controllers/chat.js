import { streamText } from "hono/streaming";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import supabase from "../supabase/supabase.js";

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export default async function chat(c) {
  const user = c.get("user");
  const { messages, model, chat_id } = await c.req.json();

  if (!messages) {
    return c.json({ error: "Messages required" }, 400);
  }

  const userMessage = messages[messages.length - 1].content;

  await supabase.from("messages").insert({
    chat_id,
    role: "user",
    content: userMessage,
  });

  let assistantText = "";

  return streamText(c, async (stream) => {
    const completion = await client.chat.completions.create({
      messages,
      model: model || "gpt-oss-120b",
      stream: true,
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";

      if (content) {
        assistantText += content;
        await stream.write(content);
      }
    }

    await supabase.from("messages").insert({
      chat_id,
      role: "assistant",
      content: assistantText,
    });
  });
}