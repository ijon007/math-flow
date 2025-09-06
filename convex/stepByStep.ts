import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveStepByStep = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stepByStepSolutions", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getStepByStepByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stepByStepSolutions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getStepByStepByThread = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stepByStepSolutions")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .collect();
  },
});

export const getStepByStep = query({
  args: { stepByStepId: v.id("stepByStepSolutions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.stepByStepId);
  },
});

export const updateStepByStep = mutation({
  args: {
    stepByStepId: v.id("stepByStepSolutions"),
    problem: v.optional(v.string()),
    method: v.optional(v.string()),
    solution: v.optional(v.string()),
    steps: v.optional(v.array(v.object({
      stepNumber: v.number(),
      description: v.string(),
      equation: v.string(),
      tip: v.optional(v.string()),
      highlight: v.optional(v.string()),
    }))),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { stepByStepId, ...updates } = args;
    await ctx.db.patch(stepByStepId, updates);
  },
});

export const deleteStepByStep = mutation({
  args: { stepByStepId: v.id("stepByStepSolutions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.stepByStepId);
  },
});
