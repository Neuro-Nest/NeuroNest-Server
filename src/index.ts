import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/routes-index";


allRoutes.get("/", (c) => c.text("Hello Hono!"));


serve(allRoutes, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});