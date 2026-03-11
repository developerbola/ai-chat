import supabase from "../supabase/supabase.js";

async function messages(c) {
  try {
    const user = c.get("user");
    const { chat_id } = await c.req.json();

    if (!chat_id) {
      return c.json({ error: "Chat ID required" }, 400);
    }

    // First verify the chat belongs to the user
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("chat_id")
      .eq("chat_id", chat_id)
      .eq("user_id", user.id)
      .single();

    if (chatError || !chat) {
      return c.json({ error: "Chat not found or access denied" }, 404);
    }

    const {
      data: messages,
      error,
    } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("chat_id", chat_id)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return c.json({ messages });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Server error" }, 500);
  }
}

export default messages;
