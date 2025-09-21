import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Get today's date in YYYY-MM-DD format
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get or create today's usage record for a user
export const getOrCreateTodayUsage = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const today = getTodayString();
    
    // Try to find existing usage for today
    const existingUsage = await ctx.db
      .query('usage')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', today))
      .first();

    if (existingUsage) {
      return existingUsage;
    }

    // Create new usage record for today
    const usageId = await ctx.db.insert('usage', {
      userId,
      date: today,
      aiMessages: 0,
      flashcards: 0,
      graphs: 0,
      stepByStep: 0,
      practiceTests: 0,
      studyGuides: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(usageId);
  },
});

// Increment usage for a specific feature
export const incrementUsage = mutation({
  args: { 
    userId: v.string(), 
    feature: v.union(
      v.literal('aiMessages'),
      v.literal('flashcards'),
      v.literal('graphs'),
      v.literal('stepByStep'),
      v.literal('practiceTests'),
      v.literal('studyGuides')
    )
  },
  handler: async (ctx, { userId, feature }) => {
    const today = getTodayString();
    
    // Get or create today's usage
    const usage = await ctx.db
      .query('usage')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', today))
      .first();

    if (usage) {
      // Update existing usage
      await ctx.db.patch(usage._id, {
        [feature]: usage[feature] + 1,
        updatedAt: Date.now(),
      });
      return usage[feature] + 1;
    } else {
      // Create new usage record
      const newUsage = {
        userId,
        date: today,
        aiMessages: 0,
        flashcards: 0,
        graphs: 0,
        stepByStep: 0,
        practiceTests: 0,
        studyGuides: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      newUsage[feature] = 1;
      
      const usageId = await ctx.db.insert('usage', newUsage);
      return 1;
    }
  },
});

// Get current usage for a user
export const getCurrentUsage = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const today = getTodayString();
    
    const usage = await ctx.db
      .query('usage')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', today))
      .first();

    if (!usage) {
      return {
        aiMessages: 0,
        flashcards: 0,
        graphs: 0,
        stepByStep: 0,
        practiceTests: 0,
        studyGuides: 0,
      };
    }

    return {
      aiMessages: usage.aiMessages,
      flashcards: usage.flashcards,
      graphs: usage.graphs,
      stepByStep: usage.stepByStep,
      practiceTests: usage.practiceTests,
      studyGuides: usage.studyGuides,
    };
  },
});

// Check if user has reached limit for a feature
export const checkUsageLimit = query({
  args: { 
    userId: v.string(), 
    feature: v.union(
      v.literal('aiMessages'),
      v.literal('flashcards'),
      v.literal('graphs'),
      v.literal('stepByStep'),
      v.literal('practiceTests'),
      v.literal('studyGuides')
    )
  },
  handler: async (ctx, { userId, feature }) => {
    // Get user's pro status
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
      .first();

    if (user?.isPro) {
      return { hasReachedLimit: false, currentUsage: 0, limit: Infinity };
    }

    // Get current usage
    const today = getTodayString();
    
    const usageRecord = await ctx.db
      .query('usage')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', today))
      .first();

    const usage = usageRecord ? {
      aiMessages: usageRecord.aiMessages,
      flashcards: usageRecord.flashcards,
      graphs: usageRecord.graphs,
      stepByStep: usageRecord.stepByStep,
      practiceTests: usageRecord.practiceTests,
      studyGuides: usageRecord.studyGuides,
    } : {
      aiMessages: 0,
      flashcards: 0,
      graphs: 0,
      stepByStep: 0,
      practiceTests: 0,
      studyGuides: 0,
    };

    const currentUsage = usage[feature];

    // Define limits for free users
    const limits = {
      aiMessages: 5,
      flashcards: 2,
      graphs: 2,
      stepByStep: 1,
      practiceTests: 0,
      studyGuides: 0,
    };

    const limit = limits[feature];
    const hasReachedLimit = currentUsage >= limit;

    return {
      hasReachedLimit,
      currentUsage,
      limit,
    };
  },
});

// Get usage limits for a user
export const getUsageLimits = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Get user's pro status
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
      .first();

    if (user?.isPro) {
      return {
        aiMessages: { current: 0, limit: Infinity, hasReachedLimit: false },
        flashcards: { current: 0, limit: Infinity, hasReachedLimit: false },
        graphs: { current: 0, limit: Infinity, hasReachedLimit: false },
        stepByStep: { current: 0, limit: Infinity, hasReachedLimit: false },
        practiceTests: { current: 0, limit: Infinity, hasReachedLimit: false },
        studyGuides: { current: 0, limit: Infinity, hasReachedLimit: false },
      };
    }

    // Get current usage
    const today = getTodayString();
    
    const usageRecord = await ctx.db
      .query('usage')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', today))
      .first();

    const usage = usageRecord ? {
      aiMessages: usageRecord.aiMessages,
      flashcards: usageRecord.flashcards,
      graphs: usageRecord.graphs,
      stepByStep: usageRecord.stepByStep,
      practiceTests: usageRecord.practiceTests,
      studyGuides: usageRecord.studyGuides,
    } : {
      aiMessages: 0,
      flashcards: 0,
      graphs: 0,
      stepByStep: 0,
      practiceTests: 0,
      studyGuides: 0,
    };

    // Define limits for free users
    const limits = {
      aiMessages: 5,
      flashcards: 2,
      graphs: 2,
      stepByStep: 1,
      practiceTests: 0,
      studyGuides: 0,
    };

    const result: Record<string, { current: number; limit: number; hasReachedLimit: boolean }> = {};
    
    for (const [feature, limit] of Object.entries(limits)) {
      const current = usage[feature as keyof typeof usage];
      result[feature] = {
        current,
        limit,
        hasReachedLimit: current >= limit,
      };
    }

    return result;
  },
});
