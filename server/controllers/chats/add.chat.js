import supabase from "../../supabase/supabase.js";

async function addChat(c) {
  const { title } = await c.req.json();
  const user = c.get("user");

  try {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        title: title || "New Chat",
        user_id: user.id,
      })
      .select();
    if (error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ chat_id: data[0].chat_id });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
}

export default addChat;
