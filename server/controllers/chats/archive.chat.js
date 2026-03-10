import supabase from "../../supabase/supabase.js";

async function archiveChat(c) {
  const { chat_id } = await c.req.json();
  try {
    const { error } = await supabase
      .from("chats")
      .update({ type: "archived" })
      .eq("chat_id", chat_id);

    if (error) {
      return c.json({ error });
    }
    return c.json({ message: "Chat pinned", chat_id });
  } catch (err) {
    return c.json({ error: err.message });
  }
}

export default archiveChat;
