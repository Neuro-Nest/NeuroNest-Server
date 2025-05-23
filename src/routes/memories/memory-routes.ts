import { Hono } from "hono";
import {
  authenticationMiddleware,
  type SecureSession,
} from "../middleware/session-middleware";
import {
  GetMemories,
  GetMemoryById,
  CreateMemory,
  UpdateMemory,
  DeleteMemory,
} from "./memory-controllers";
import {
  GetMemoriesError,
  CreateMemoryError,
  UpdateMemoryError,
  DeleteMemoryError,
  GetMemoryByIdError,
} from "./memory-types";
import { getPagination } from "../../extras/pagination";

export const memoryRoutes = new Hono<SecureSession>();

// POST /memories - Create a memory
memoryRoutes.post("/", authenticationMiddleware, async (c) => {
// memoryRoutes.post("/", async (c) => {
  try {
    const userId = c.get("user").id;
    const { title, content, tags } = await c.req.json();
    const result = await CreateMemory({ userId, title, content, tags });
    return c.json(result, 201);
  } catch (error) {
    if (error === CreateMemoryError.CONTENT_REQUIRED) {
      return c.json({ error: "Content is required!" }, 400);
    }
    if (error === CreateMemoryError.USER_NOT_FOUND) {
      return c.json({ error: "User not found!" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});

// GET /memories - List all memories (with pagination, optional filters/tags)
memoryRoutes.get("/", async (c) => {
  try {
    const { page, limit } = getPagination(c);
    const tags = c.req.query("tags"); // comma-separated list
    const result = await GetMemories({ page, limit, tags });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetMemoriesError.MEMORIES_NOT_FOUND) {
      return c.json({ error: "No memories found." }, 404);
    }
    if (error === GetMemoriesError.PAGE_BEYOND_LIMIT) {
      return c.json({ error: "No memories found on the requested page." }, 404);
    }
    return c.json({ error: "Unknown error." }, 500);
  }
});

// GET /memories/:id - Get single memory
memoryRoutes.get("/:id", async (c) => {
  try {
    const memoryId = c.req.param("id");
    const result = await GetMemoryById({ memoryId });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetMemoryByIdError.MEMORY_NOT_FOUND) {
      return c.json({ error: "Memory not found." }, 404);
    }
    return c.json({ error: "Unknown error." }, 500);
  }
});

// PUT /memories/:id - Update memory
memoryRoutes.put("/:id", authenticationMiddleware, async (c) => {
// memoryRoutes.patch("/:id", async (c) => {
  try {
    const userId = c.get("user").id;
    //const{ userId} = await c.req.json();
    const memoryId = c.req.param("id");
    const { title, content, tags } = await c.req.json();
    const result = await UpdateMemory({ memoryId, userId, title, content, tags });
    return c.json(result, 200);
  } catch (error) {
    if (error === UpdateMemoryError.MEMORY_NOT_FOUND) {
      return c.json({ error: "Memory not found." }, 404);
    }
    if (error === UpdateMemoryError.USER_NOT_AUTHORIZED) {
      return c.json({ error: "Not authorized to update this memory." }, 403);
    }
    return c.json({ error: "Unknown error." }, 500);
  }
});

// DELETE /memories/:id - Delete memory
//memoryRoutes.delete("/:id", authenticationMiddleware, async (c) => {
memoryRoutes.delete("/:id", async (c) => {
  try {
    //const userId = c.get("user").id;
    const{ userId} = await c.req.json();
    const memoryId = c.req.param("id");
    await DeleteMemory({ memoryId, userId });
    return c.json({ message: "Memory deleted successfully." }, 200);
  } catch (error) {
    if (error === DeleteMemoryError.MEMORY_NOT_FOUND) {
      return c.json({ error: "Memory not found." }, 404);
    }
    if (error === DeleteMemoryError.USER_NOT_FOUND) {
      return c.json({ error: "Not authorized to delete this memory." }, 403);
    }
    return c.json({ error: "Unknown error." }, 500);
  }
});
