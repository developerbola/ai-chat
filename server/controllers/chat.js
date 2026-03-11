import { streamText } from "hono/streaming";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import supabase from "../supabase/supabase.js";

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export default async function chat(c) {
  const { messages, model, chat_id } = await c.req.json();
  const user = c.get("user");

  if (!messages) {
    return c.json({ error: "Messages required" }, 400);
  }

  if (!chat_id) {
    return c.json({ error: "Chat ID required" }, 400);
  }

  // Verify the chat belongs to the user
  const { data: chat, error: chatError } = await supabase
    .from("chats")
    .select("chat_id")
    .eq("chat_id", chat_id)
    .eq("user_id", user.id)
    .single();

  if (chatError || !chat) {
    return c.json({ error: "Chat not found or access denied" }, 404);
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
      reasoning_effort: "low",
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
