import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createThread = mutation({
  args: {
    title: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const threadId = await ctx.db.insert("threads", {
      title: args.title,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0,
      isBookmarked: false,
      tags: [],
    });
    return threadId;
  },
});

export const getThreadsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getBookmarkedThreads = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_user_bookmarked", (q) => 
        q.eq("userId", args.userId).eq("isBookmarked", true)
      )
      .order("desc")
      .collect();
  },
});

export const getThread = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.threadId);
  },
});

export const updateThread = mutation({
  args: {
    threadId: v.id("threads"),
    title: v.optional(v.string()),
    isBookmarked: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    preview: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { threadId, ...updates } = args;
    await ctx.db.patch(threadId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const toggleBookmark = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
    isBookmarked: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, {
      isBookmarked: args.isBookmarked,
      updatedAt: Date.now(),
    });
    
    if (args.isBookmarked) {
      await ctx.db.insert("bookmarks", {
        threadId: args.threadId,
        userId: args.userId,
        createdAt: Date.now(),
        tags: [],
      });
    } else {
      const bookmark = await ctx.db
        .query("bookmarks")
        .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();
      
      if (bookmark) {
        await ctx.db.delete(bookmark._id);
      }
    }
  },
});

export const deleteThread = mutation({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    // Delete all related data
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect();
    
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    
    const graphs = await ctx.db
      .query("graphs")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect();
    
    for (const graph of graphs) {
      await ctx.db.delete(graph._id);
    }
    
    const flashcards = await ctx.db
      .query("flashcards")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect();
    
    for (const flashcard of flashcards) {
      await ctx.db.delete(flashcard._id);
    }
    
    const stepByStepSolutions = await ctx.db
      .query("stepByStepSolutions")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect();
    
    for (const solution of stepByStepSolutions) {
      await ctx.db.delete(solution._id);
    }
    
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect();
    
    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }
    
    // Finally delete the thread
    await ctx.db.delete(args.threadId);
  },
});
