import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMessage = mutation({
  args: {
    threadId: v.id("threads"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.optional(v.string()),
    parts: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) throw new Error("Thread not found");
    
    const messageId = await ctx.db.insert("messages", {
      threadId: args.threadId,
      role: args.role,
      content: args.content,
      parts: args.parts,
      createdAt: Date.now(),
      order: thread.messageCount,
    });
    
    // Update thread message count and timestamp
    await ctx.db.patch(args.threadId, {
      messageCount: thread.messageCount + 1,
      updatedAt: Date.now(),
    });
    
    return messageId;
  },
});

export const getMessagesByThread = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_thread_order", (q) => q.eq("threadId", args.threadId))
      .collect();
  },
});

export const getMessage = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.messageId);
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.optional(v.string()),
    parts: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const { messageId, ...updates } = args;
    await ctx.db.patch(messageId, updates);
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});
