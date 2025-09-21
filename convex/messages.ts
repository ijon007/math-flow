import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Helper function to update user streak
async function updateUserStreakHelper(ctx: any, userId: string) {
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
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
}

export const addMessage = mutation({
  args: {
    threadId: v.id('threads'),
    role: v.union(
      v.literal('user'),
      v.literal('assistant'),
      v.literal('system')
    ),
    content: v.optional(v.string()),
    parts: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      console.error(`Thread not found: ${args.threadId}`);
      throw new Error(`Thread not found: ${args.threadId}`);
    }

    const messageId = await ctx.db.insert('messages', {
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

    // Update user streak if this is a user message
    if (args.role === 'user') {
      await updateUserStreakHelper(ctx, thread.userId);
    }

    return messageId;
  },
});

export const getMessagesByThread = query({
  args: { threadId: v.id('threads') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_thread_order', (q) => q.eq('threadId', args.threadId))
      .collect();
  },
});

export const getMessage = query({
  args: { messageId: v.id('messages') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.messageId);
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id('messages'),
    content: v.optional(v.string()),
    parts: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const { messageId, ...updates } = args;
    await ctx.db.patch(messageId, updates);
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id('messages') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});
