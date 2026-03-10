import { Hono } from "hono";
import chat from "../controllers/chat.js";
import { chatsHistory } from "../controllers/chats.js";
import authMiddleware from "../middleware/auth.middleware.js";

const routes = new Hono();

routes.post("/chat", authMiddleware, chat);
routes.get("/chats-history", authMiddleware, chatsHistory);

routes.get("*", (c) => {
  return c.json(
    {
      path: c.req.path,
      error: "Path not found",
    },
    404,
  );
});

export default routes;
