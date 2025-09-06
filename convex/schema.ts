import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  threads: defineTable({
    title: v.string(),
    userId: v.string(), // Clerk user ID
    createdAt: v.number(),
    updatedAt: v.number(),
    messageCount: v.number(),
    isBookmarked: v.boolean(),
    tags: v.array(v.string()),
    preview: v.optional(v.string()), // First message preview
  })
  .index("by_user", ["userId"])
  .index("by_user_bookmarked", ["userId", "isBookmarked"])
  .index("by_updated", ["updatedAt"]),

  messages: defineTable({
    threadId: v.id("threads"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.optional(v.string()), // Text content for non-tool messages
    parts: v.array(v.object({
      type: v.string(), // "text" or "tool-{toolName}"
      text: v.optional(v.string()),
      state: v.optional(v.string()), // "loading", "success", "error"
      input: v.optional(v.any()), // Tool input parameters
      output: v.optional(v.any()), // Tool output data
      errorText: v.optional(v.string()),
      toolCallId: v.optional(v.string()), // Tool call identifier
    })),
    createdAt: v.number(),
    order: v.number(), // For message ordering within thread
  })
  .index("by_thread", ["threadId"])
  .index("by_thread_order", ["threadId", "order"]),

  graphs: defineTable({
    threadId: v.id("threads"),
    messageId: v.id("messages"), // Reference to the message that generated this
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(), // "function", "bar", "line", "scatter", "histogram", "polar", "parametric"
    equation: v.optional(v.string()), // For function graphs
    data: v.any(), // Chart/graph data points
    config: v.optional(v.any()), // Chart configuration
    metadata: v.optional(v.any()), // Additional metadata
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_thread", ["threadId"])
  .index("by_message", ["messageId"])
  .index("by_type", ["type"]),

  flashcards: defineTable({
    threadId: v.id("threads"),
    messageId: v.id("messages"),
    userId: v.string(),
    topic: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    subject: v.optional(v.string()),
    tags: v.array(v.string()),
    cards: v.array(v.object({
      id: v.string(),
      front: v.string(),
      back: v.string(),
    })),
    createdAt: v.number(),
    lastStudied: v.optional(v.number()),
    mastery: v.number(), // 0-100
    studyCount: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_thread", ["threadId"])
  .index("by_message", ["messageId"])
  .index("by_difficulty", ["difficulty"])
  .index("by_subject", ["subject"]),

  stepByStepSolutions: defineTable({
    threadId: v.id("threads"),
    messageId: v.id("messages"),
    userId: v.string(),
    problem: v.string(),
    method: v.string(),
    solution: v.string(),
    steps: v.array(v.object({
      stepNumber: v.number(),
      description: v.string(),
      equation: v.string(),
      tip: v.optional(v.string()),
      highlight: v.optional(v.string()),
    })),
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_thread", ["threadId"])
  .index("by_message", ["messageId"])
  .index("by_method", ["method"]),

  bookmarks: defineTable({
    threadId: v.id("threads"),
    userId: v.string(),
    createdAt: v.number(),
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
  })
  .index("by_user", ["userId"])
  .index("by_thread", ["threadId"])
  .index("by_user_thread", ["userId", "threadId"]),
});
