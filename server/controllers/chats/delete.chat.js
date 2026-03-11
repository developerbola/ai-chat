import supabase from "../../supabase/supabase.js";

async function deleteChat(c) {
  const { chat_id } = await c.req.json();
  const user = c.get("user");

  try {
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("chat_id", chat_id)
      .eq("user_id", user.id);
    if (error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ message: "Chat deleted successfully", chat_id });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
}

export default deleteChat;
