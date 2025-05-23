import type { Memory } from "../../generated/prisma";

// Result and Error types for fetching all memories
export type GetMemoriesResult = {
  memories: Memory[];
};

export enum GetMemoriesError {
  MEMORIES_NOT_FOUND = "MEMORIES_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  UNKNOWN = "UNKNOWN"
}

// Result and Error types for creating a memory
export type CreateMemoryResult = {
  memory: Memory;
};

export enum CreateMemoryError {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  CONTENT_REQUIRED = "CONTENT_REQUIRED",
  UNKNOWN = "UNKNOWN"
}

// Result and Error types for fetching a memory by ID
export type GetMemoryByIdResult = {
  memory: Memory;
};

export enum GetMemoryByIdError {
  MEMORY_NOT_FOUND = "MEMORY_NOT_FOUND",
  UNKNOWN = "UNKNOWN"
}

// Result and Error types for updating a memory
export type UpdateMemoryResult = {
  memory: Memory;
};

export enum UpdateMemoryError {
  MEMORY_NOT_FOUND = "MEMORY_NOT_FOUND",
  USER_NOT_AUTHORIZED = "USER_NOT_AUTHORIZED",
  UNKNOWN = "UNKNOWN"
}

// Error types for deleting a memory
export enum DeleteMemoryError {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  MEMORY_NOT_FOUND = "MEMORY_NOT_FOUND",
  UNKNOWN = "UNKNOWN"
}

// Result and Error types for getting memories of a specific user
export type GetMemoriesOnUserResult = {
  memories: Memory[];
};

export enum GetMemoriesOnUserError {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  MEMORIES_NOT_FOUND = "MEMORIES_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  UNKNOWN = "UNKNOWN"
}

// Result and Error types for searching memories
export type SearchMemoriesResult = {
  memories: Memory[];
  page: number;
  totalPages: number;
  totalMemories: number;
};

export enum SearchMemoriesError {
  UNKNOWN = "UNKNOWN",
  QUERY_REQUIRED = "QUERY_REQUIRED",
  MEMORIES_NOT_FOUND = "MEMORIES_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT"
}
