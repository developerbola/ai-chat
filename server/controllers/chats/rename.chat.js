import supabase from "../../supabase/supabase.js";

async function renameChat(c) {
  const { title, chat_id } = await c.req.json();
  try {
    const { error } = await supabase
      .from("chats")
      .update({ title })
      .eq("chat_id", chat_id);

    if (error) {
      return c.json({ error });
    }
    return c.json({ message: "Chat renamed", chat_id });
  } catch (err) {
    return c.json({ error: err.message });
  }
}

export default renameChat;
