import { Hono } from "hono";
import { cors } from "hono/cors";
import { webClientUrl } from "../../utils/environment";
import { authenticationsRoutes } from "./authentications/authentication-routes";

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

allRoutes.route("/authentications", authenticationsRoutes);

allRoutes.get("/", (c) => {
  return c.json({ message: "Hello World" });
});
