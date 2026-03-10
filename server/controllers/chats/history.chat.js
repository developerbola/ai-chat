import supabase from "../../supabase/supabase.js";

async function chatsHistory(c) {
  try {
    const user = c.get("user");

    const page = parseInt(c.req.query("page") || "1");
    const limit = 10;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data: chats,
      error,
      count,
    } = await supabase
      .from("chats")
      .select(
        `chat_id,
         title
        `,
        { count: "exact" },
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    return c.json({
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      data: chats,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Server error" }, 500);
  }
}

export default chatsHistory;
