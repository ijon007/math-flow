import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveGraph = mutation({
  args: {
    threadId: v.id("threads"),
    messageId: v.optional(v.id("messages")),
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    equation: v.optional(v.string()),
    data: v.any(),
    config: v.optional(v.any()),
    metadata: v.optional(v.any()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("graphs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getGraphsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("graphs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getGraphsByThread = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("graphs")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .collect();
  },
});

export const getGraph = query({
  args: { graphId: v.id("graphs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.graphId);
  },
});

export const updateGraph = mutation({
  args: {
    graphId: v.id("graphs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { graphId, ...updates } = args;
    await ctx.db.patch(graphId, updates);
  },
});

export const deleteGraph = mutation({
  args: { graphId: v.id("graphs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.graphId);
  },
});
