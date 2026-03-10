import { Hono } from "hono";

import authMiddleware from "../middleware/auth.middleware.js";

import chat from "../controllers/chat.js";
import chatsHistory from "../controllers/chats/history.chat.js";
import addChat from "../controllers/chats/add.chat.js";
import removeChat from "../controllers/chats/remove.chat.js";
import pinChat from "../controllers/chats/pin.chat.js";
import archiveChat from "../controllers/chats/archive.chat.js";

const routes = new Hono();

routes.post("/chat", authMiddleware, chat);

routes.get("/chats-history", authMiddleware, chatsHistory);
routes.get("/add-chat", authMiddleware, addChat);
routes.get("/remove-chat", authMiddleware, removeChat);
routes.get("/pin-chat", authMiddleware, pinChat);
routes.get("/archive-chat", authMiddleware, archiveChat);

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
