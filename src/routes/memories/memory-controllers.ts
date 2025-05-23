import type { Context } from "hono";
import { prismaClient as prisma } from "../../../lib/prisma";
import {
  type GetMemoriesResult,
  type CreateMemoryResult,
  type GetMemoryByIdResult,
  type GetMemoriesOnUserResult,
  type SearchMemoriesResult,
  GetMemoriesError,
  CreateMemoryError,
  GetMemoryByIdError,
  UpdateMemoryError,
  DeleteMemoryError,
  GetMemoriesOnUserError,
  SearchMemoriesError,
} from "./memory-types";
import type { Memory } from "../../generated/prisma";

export const GetMemories = async ({
  page,
  limit,
  tags,
}: {
  page: number;
  limit: number;
  tags?: string;
}): Promise<GetMemoriesResult> => {
  try {
    const totalMemories = await prisma.memory.count();
    if (totalMemories === 0) {
      throw GetMemoriesError.MEMORIES_NOT_FOUND;
    }

    const totalPages = Math.ceil(totalMemories / limit);
    if (page > totalPages) {
      throw GetMemoriesError.PAGE_BEYOND_LIMIT;
    }

    const memories = await prisma.memory.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { memories };
  } catch (e) {
    console.error(e);
    if (e === GetMemoriesError.MEMORIES_NOT_FOUND) throw e;
    if (e === GetMemoriesError.PAGE_BEYOND_LIMIT) throw e;
    throw GetMemoriesError.UNKNOWN;
  }
};

export const CreateMemory = async ({
  userId,
  content,
  title,
  tags,
}: {
  userId: string;
  content: string;
  title?: string;
  tags?: string[];
}): Promise<CreateMemoryResult> => {
  try {
    if (!userId) throw CreateMemoryError.USER_NOT_FOUND;
    if (!content) throw CreateMemoryError.CONTENT_REQUIRED;

    const memory = await prisma.memory.create({
      data: {
        userId,
        content,
        title,
        tags: tags || [],
      },
    });

    return { memory };
  } catch (e) {
    console.error(e);
    if (e === CreateMemoryError.USER_NOT_FOUND) throw e;
    if (e === CreateMemoryError.CONTENT_REQUIRED) throw e;
    throw CreateMemoryError.UNKNOWN;
  }
};

export const GetMemoryById = async ({
  memoryId,
}: {
  memoryId: string;
}): Promise<GetMemoryByIdResult> => {
  try {
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
    });

    if (!memory) throw GetMemoryByIdError.MEMORY_NOT_FOUND;

    return { memory };
  } catch (e) {
    console.error(e);
    if (e === GetMemoryByIdError.MEMORY_NOT_FOUND) throw e;
    throw GetMemoryByIdError.UNKNOWN;
  }
};

export const UpdateMemory = async ({
  memoryId,
  userId,
  content,
  title,
  tags,
}: {
  memoryId: string;
  userId: string;
  content?: string;
  title?: string;
  tags?: string[];
}): Promise<{ memory: Memory }> => {
  try {
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
    });

    if (!memory) throw UpdateMemoryError.MEMORY_NOT_FOUND;
    if (memory.userId !== userId) throw UpdateMemoryError.USER_NOT_AUTHORIZED;

    const updated = await prisma.memory.update({
      where: { id: memoryId },
      data: {
        content,
        title,
        tags,
      },
    });

    return { memory: updated };
  } catch (e) {
    console.error(e);
    if (e === UpdateMemoryError.MEMORY_NOT_FOUND) throw e;
    if (e === UpdateMemoryError.USER_NOT_AUTHORIZED) throw e;
    throw UpdateMemoryError.UNKNOWN;
  }
};

export const DeleteMemory = async (parameters: {
  memoryId: string;
  userId: string;
}): Promise<string> => {
  try {
    const { memoryId, userId } = parameters;
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
    });

    if (!memory) throw DeleteMemoryError.MEMORY_NOT_FOUND;
    
    if (memory.userId !== userId) throw DeleteMemoryError.USER_NOT_FOUND;

    await prisma.memory.delete({
      where: { id: memoryId },
    });

    return "Memory deleted successfully";
  } catch (e) {
    console.error(e);
    if (e === DeleteMemoryError.MEMORY_NOT_FOUND) throw e;
    if (e === DeleteMemoryError.USER_NOT_FOUND) throw e;
    throw DeleteMemoryError.UNKNOWN;
  }
};

export const GetMemoriesOnUser = async ({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}): Promise<GetMemoriesOnUserResult> => {
  try {
    const total = await prisma.memory.count({
      where: { userId },
    });

    if (total === 0) throw GetMemoriesOnUserError.MEMORIES_NOT_FOUND;

    const totalPages = Math.ceil(total / limit);
    if (page > totalPages) throw GetMemoriesOnUserError.PAGE_BEYOND_LIMIT;

    const memories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { memories };
  } catch (e) {
    console.error(e);
    if (e === GetMemoriesOnUserError.USER_NOT_FOUND) throw e;
    if (e === GetMemoriesOnUserError.MEMORIES_NOT_FOUND) throw e;
    if (e === GetMemoriesOnUserError.PAGE_BEYOND_LIMIT) throw e;
    throw GetMemoriesOnUserError.UNKNOWN;
  }
};

export const SearchMemories = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<SearchMemoriesResult> => {
  try {
    if (!query || query.trim() === "") throw SearchMemoriesError.QUERY_REQUIRED;

    const totalMemories = await prisma.memory.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    if (totalMemories === 0) throw SearchMemoriesError.MEMORIES_NOT_FOUND;

    const totalPages = Math.ceil(totalMemories / limit);
    if (page > totalPages) throw SearchMemoriesError.PAGE_BEYOND_LIMIT;

    const memories = await prisma.memory.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      memories,
      page,
      totalPages,
      totalMemories,
    };
  } catch (e) {
    console.error("Search error:", e);
    if (e === SearchMemoriesError.QUERY_REQUIRED) throw e;
    if (e === SearchMemoriesError.MEMORIES_NOT_FOUND) throw e;
    if (e === SearchMemoriesError.PAGE_BEYOND_LIMIT) throw e;
    throw SearchMemoriesError.UNKNOWN;
  }
};
