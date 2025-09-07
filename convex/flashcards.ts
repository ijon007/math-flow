import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveFlashcards = mutation({
  args: {
    threadId: v.id("threads"),
    messageId: v.optional(v.id("messages")),
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("flashcards", {
      ...args,
      createdAt: Date.now(),
      lastStudied: undefined,
      mastery: 0,
      studyCount: 0,
    });
  },
});

export const getFlashcardsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getFlashcardsByThread = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flashcards")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .collect();
  },
});

export const getFlashcard = query({
  args: { flashcardId: v.id("flashcards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.flashcardId);
  },
});

export const updateFlashcard = mutation({
  args: {
    flashcardId: v.id("flashcards"),
    topic: v.optional(v.string()),
    subject: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    cards: v.optional(v.array(v.object({
      id: v.string(),
      front: v.string(),
      back: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const { flashcardId, ...updates } = args;
    await ctx.db.patch(flashcardId, updates);
  },
});

export const updateFlashcardProgress = mutation({
  args: {
    flashcardId: v.id("flashcards"),
    mastery: v.number(),
    studyCount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.flashcardId, {
      mastery: args.mastery,
      studyCount: args.studyCount,
      lastStudied: Date.now(),
    });
  },
});

export const deleteFlashcard = mutation({
  args: { flashcardId: v.id("flashcards") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.flashcardId);
  },
});
