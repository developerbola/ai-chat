import { config } from "dotenv";
config();

import { Hono } from "hono";
import { cors } from "hono/cors";

import { handle } from "hono/vercel";
import Routes from "./routes/routes.js";

const app = new Hono().basePath("/api");

app.use("/*", cors());
app.route("/", Routes);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
export const DELETE = handler;
