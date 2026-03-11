import supabase from "../../supabase/supabase.js";

async function unpinChat(c) {
  const { chat_id } = await c.req.json();
  const user = c.get("user");
  try {
    const { error } = await supabase
      .from("chats")
      .update({ type: null })
      .eq("chat_id", chat_id)
      .eq("user_id", user.id);

    if (error) {
      return c.json({ error });
    }
    return c.json({ message: "Chat unpinned", chat_id });
  } catch (err) {
    return c.json({ error: err.message });
  }
}

export default unpinChat;
