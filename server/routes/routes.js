import { Hono } from "hono";

import authMiddleware from "../middleware/auth.middleware.js";

import chat from "../controllers/chat.js";
import chatsHistory from "../controllers/chats/history.chat.js";
import addChat from "../controllers/chats/add.chat.js";
import pinChat from "../controllers/chats/pin.chat.js";
import archiveChat from "../controllers/chats/archive.chat.js";
import renameChat from "../controllers/chats/rename.chat.js";
import deleteChat from "../controllers/chats/delete.chat.js";

const routes = new Hono();

routes.post("/chat", authMiddleware, chat);

routes.get("/chats-history", authMiddleware, chatsHistory);
routes.post("/add-chat", authMiddleware, addChat);
routes.post("/rename-chat", authMiddleware, renameChat);
routes.delete("/delete-chat", authMiddleware, deleteChat);
routes.post("/pin-chat", authMiddleware, pinChat);
routes.post("/archive-chat", authMiddleware, archiveChat);


routes.get("*", (c) => {
  return c.json(
    {
      path: c.req.path,
      error: "Path not found",
    },
    404,
  );``
});

export default routes;
