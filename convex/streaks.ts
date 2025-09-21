import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getUserStreak = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.userId))
      .first();

    if (!user) {
      return { streak: 0, lastActivityDate: null };
    }

    return {
      streak: user.streak || 0,
      lastActivityDate: user.lastActivityDate || null,
    };
  },
});

export const updateUserStreak = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.userId))
      .first();

    if (!user) {
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let newStreak = 1;
    let lastActivityDate = today;

    if (user.lastActivityDate) {
      if (user.lastActivityDate === today) {
        // Already updated today, no change needed
        return;
      } else if (user.lastActivityDate === yesterday) {
        // Consecutive day, increment streak
        newStreak = (user.streak || 0) + 1;
      } else {
        // Gap in days, reset streak
        newStreak = 1;
      }
    }

    await ctx.db.patch(user._id, {
      streak: newStreak,
      lastActivityDate,
      updatedAt: Date.now(),
    });
  },
});

export const checkAndResetStreak = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.userId))
      .first();

    if (!user || !user.lastActivityDate) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = new Date(user.lastActivityDate);
    const daysSinceLastActivity = Math.floor(
      (Date.now() - lastActivity.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysSinceLastActivity > 1) {
      await ctx.db.patch(user._id, {
        streak: 0,
        lastActivityDate: undefined,
        updatedAt: Date.now(),
      });
    }
  },
});
