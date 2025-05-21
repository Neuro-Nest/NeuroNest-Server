import { Hono } from "hono";
import { webClientUrl } from "../../lib/environment";
import { cors } from "hono/cors";

export const allRoutes = new Hono();

allRoutes.use(
  cors({
    origin: webClientUrl,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
  })
);

allRoutes.get("/", (c) => {
  return c.json({ message: "Hello World" });
});
