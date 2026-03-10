import { config } from "dotenv";
config();

import { Hono } from "hono";
import { cors } from "hono/cors";

import { handle } from "hono/vercel";
import Routes from "./routes/routes.js";

const app = new Hono().basePath("/api");

app.use(
  "/*",
  cors({ origin: ["http://localhost:5173", "https://chatt-aii.vercel.app"] }),
);
app.route("/", Routes);

// export default app;
const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
export const DELETE = handler;
