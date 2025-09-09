import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const savePracticeTest = mutation({
  args: {
    threadId: v.id('threads'),
    messageId: v.optional(v.id('messages')),
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    subject: v.string(),
    difficulty: v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard')
    ),
    questionCount: v.number(),
    timeLimit: v.optional(v.number()),
    questions: v.array(
      v.object({
        id: v.string(),
        question: v.string(),
        type: v.union(
          v.literal('multiple-choice'),
          v.literal('true-false'),
          v.literal('fill-in-blank'),
          v.literal('short-answer')
        ),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        points: v.number(),
        difficulty: v.union(
          v.literal('easy'),
          v.literal('medium'),
          v.literal('hard')
        ),
        tags: v.array(v.string()),
        timeLimit: v.optional(v.number()),
      })
    ),
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    settings: v.optional(
      v.object({
        randomizeQuestions: v.boolean(),
        showExplanations: v.boolean(),
        allowRetake: v.boolean(),
        showCorrectAnswers: v.boolean(),
        timePerQuestion: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('practiceTests', {
      ...args,
      createdAt: Date.now(),
      lastTaken: undefined,
      attempts: 0,
      averageScore: 0,
    });
  },
});

export const getPracticeTestsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('practiceTests')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

export const getPracticeTestsByThread = query({
  args: { threadId: v.id('threads') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('practiceTests')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .order('desc')
      .collect();
  },
});

export const getPracticeTest = query({
  args: { testId: v.id('practiceTests') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.testId);
  },
});

export const getPublicTests = query({
  args: { 
    limit: v.optional(v.number()),
    subject: v.optional(v.string()),
    difficulty: v.optional(v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard')
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('practiceTests')
      .withIndex('by_public', (q) => q.eq('isPublic', true));

    if (args.subject) {
      query = query.filter((q) => q.eq(q.field('subject'), args.subject));
    }

    if (args.difficulty) {
      query = query.filter((q) => q.eq(q.field('difficulty'), args.difficulty));
    }

    return await query
      .order('desc')
      .take(args.limit || 50);
  },
});

export const updatePracticeTest = mutation({
  args: {
    testId: v.id('practiceTests'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    subject: v.optional(v.string()),
    difficulty: v.optional(v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard')
    )),
    timeLimit: v.optional(v.number()),
    questions: v.optional(v.array(
      v.object({
        id: v.string(),
        question: v.string(),
        type: v.union(
          v.literal('multiple-choice'),
          v.literal('true-false'),
          v.literal('fill-in-blank'),
          v.literal('short-answer')
        ),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        points: v.number(),
        difficulty: v.union(
          v.literal('easy'),
          v.literal('medium'),
          v.literal('hard')
        ),
        tags: v.array(v.string()),
        timeLimit: v.optional(v.number()),
      })
    )),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
    settings: v.optional(
      v.object({
        randomizeQuestions: v.boolean(),
        showExplanations: v.boolean(),
        allowRetake: v.boolean(),
        showCorrectAnswers: v.boolean(),
        timePerQuestion: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { testId, ...updates } = args;
    await ctx.db.patch(testId, updates);
  },
});

export const deletePracticeTest = mutation({
  args: { testId: v.id('practiceTests') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.testId);
  },
});

export const recordTestAttempt = mutation({
  args: {
    testId: v.id('practiceTests'),
    score: v.number(), // 0-100
    timeSpent: v.number(), // in seconds
    answers: v.array(v.object({
      questionId: v.string(),
      answer: v.string(),
      isCorrect: v.boolean(),
      timeSpent: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const newAttempts = test.attempts + 1;
    const newAverageScore = ((test.averageScore * test.attempts) + args.score) / newAttempts;

    await ctx.db.patch(args.testId, {
      attempts: newAttempts,
      averageScore: newAverageScore,
      lastTaken: Date.now(),
    });

    // Store attempt details (you might want to create a separate attempts table)
    return { success: true, newAverageScore, newAttempts };
  },
});

export const updateTestProgress = mutation({
  args: {
    testId: v.id('practiceTests'),
    lastTaken: v.optional(v.number()),
    attempts: v.optional(v.number()),
    averageScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { testId, ...updates } = args;
    await ctx.db.patch(testId, updates);
  },
});

export const getTestStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const tests = await ctx.db
      .query('practiceTests')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    const totalTests = tests.length;
    const totalAttempts = tests.reduce((sum, test) => sum + test.attempts, 0);
    const averageScore = tests.length > 0 
      ? tests.reduce((sum, test) => sum + test.averageScore, 0) / tests.length 
      : 0;

    const difficultyStats = tests.reduce((stats, test) => {
      if (!stats[test.difficulty]) {
        stats[test.difficulty] = { count: 0, averageScore: 0 };
      }
      stats[test.difficulty].count++;
      stats[test.difficulty].averageScore += test.averageScore;
      return stats;
    }, {} as Record<string, { count: number; averageScore: number }>);

    // Calculate average scores per difficulty
    Object.keys(difficultyStats).forEach(difficulty => {
      const stat = difficultyStats[difficulty];
      stat.averageScore = stat.count > 0 ? stat.averageScore / stat.count : 0;
    });

    return {
      totalTests,
      totalAttempts,
      averageScore,
      difficultyStats,
    };
  },
});
