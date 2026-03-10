import supabase from "../supabase/supabase.js";

export default async function authMiddleware(c, next) {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "No token provided" }, 401);
    }
    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return c.json({ error: "Invalid token" }, 401);
    }
    c.set("user", data.user);
    await next();
  } catch (error) {
    console.error(error);
    return c.json({ error: "Authentication failed" }, 500);
  }
}
