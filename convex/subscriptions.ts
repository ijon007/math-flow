import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrUpdateSubscription = mutation({
  args: {
    userId: v.string(),
    customerId: v.string(),
    isPro: v.boolean(),
    plan: v.union(v.literal("monthly"), v.literal("yearly")),
    status: v.string(),
    subscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        customerId: args.customerId,
        isPro: args.isPro,
        plan: args.plan,
        status: args.status,
        subscriptionId: args.subscriptionId,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new subscription
      return await ctx.db.insert("subscriptions", {
        userId: args.userId,
        customerId: args.customerId,
        isPro: args.isPro,
        plan: args.plan,
        status: args.status,
        subscriptionId: args.subscriptionId,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const getSubscriptionByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getSubscriptionByCustomer = query({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .first();
  },
});

export const updateSubscriptionStatus = mutation({
  args: {
    subscriptionId: v.string(),
    status: v.string(),
    isPro: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscription", (q) => q.eq("subscriptionId", args.subscriptionId))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const updateData: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.isPro !== undefined) {
      updateData.isPro = args.isPro;
    }

    await ctx.db.patch(subscription._id, updateData);
    return subscription._id;
  },
});

// Temporary debug query - remove this later
export const getAllSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subscriptions").collect();
  },
});

// Temporary fix mutation - remove this later
export const fixSubscriptionUserId = mutation({
  args: {
    subscriptionId: v.string(),
    correctUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscription", (q) => q.eq("subscriptionId", args.subscriptionId))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await ctx.db.patch(subscription._id, {
      userId: args.correctUserId,
      updatedAt: Date.now(),
    });

    return subscription._id;
  },
});
