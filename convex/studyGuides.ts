import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const saveStudyGuide = mutation({
  args: {
    threadId: v.id('threads'),
    messageId: v.optional(v.id('messages')),
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    topic: v.string(),
    difficulty: v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard')
    ),
    subject: v.string(),
    learningPath: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        type: v.union(
          v.literal('concept'),
          v.literal('example'),
          v.literal('practice'),
          v.literal('visualization')
        ),
        content: v.object({
          explanation: v.string(),
          examples: v.optional(v.array(v.string())),
          formulas: v.optional(v.array(v.string())),
          visualizations: v.optional(v.array(v.string())),
          practiceProblems: v.optional(v.array(v.string())),
        }),
        prerequisites: v.array(v.string()),
        estimatedTime: v.number(),
        completed: v.boolean(),
      })
    ),
    flowChart: v.optional(v.object({
      nodes: v.array(v.object({
        id: v.string(),
        label: v.string(),
        type: v.string(),
        position: v.object({ x: v.number(), y: v.number() }),
      })),
      edges: v.array(v.object({
        source: v.string(),
        target: v.string(),
        type: v.string(),
      })),
    })),
    tags: v.array(v.string()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const totalSteps = args.learningPath.length;
    return await ctx.db.insert('studyGuides', {
      ...args,
      createdAt: Date.now(),
      lastAccessed: undefined,
      progress: 0,
      totalSteps,
      completedSteps: 0,
      isPublic: args.isPublic || false,
    });
  },
});

export const getStudyGuidesByUser = query({
  args: { 
    userId: v.string(),
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
      .query('studyGuides')
      .withIndex('by_user', (q) => q.eq('userId', args.userId));

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

export const getStudyGuide = query({
  args: { 
    guideId: v.id('studyGuides'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.guideId);
  },
});

export const getPublicGuides = query({
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
      .query('studyGuides')
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

export const updateGuideProgress = mutation({
  args: {
    guideId: v.id('studyGuides'),
    progress: v.number(), // 0-100
    completedSteps: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.guideId, {
      progress: args.progress,
      completedSteps: args.completedSteps,
      lastAccessed: Date.now(),
    });
  },
});

export const markStepComplete = mutation({
  args: {
    guideId: v.id('studyGuides'),
    stepId: v.string(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const guide = await ctx.db.get(args.guideId);
    if (!guide) {
      throw new Error('Study guide not found');
    }

    const updatedLearningPath = guide.learningPath.map(step => 
      step.id === args.stepId ? { ...step, completed: args.completed } : step
    );

    const completedSteps = updatedLearningPath.filter(step => step.completed).length;
    const progress = Math.round((completedSteps / guide.totalSteps) * 100);

    await ctx.db.patch(args.guideId, {
      learningPath: updatedLearningPath,
      completedSteps,
      progress,
      lastAccessed: Date.now(),
    });
  },
});

export const updateStudyGuide = mutation({
  args: {
    guideId: v.id('studyGuides'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    subject: v.optional(v.string()),
    difficulty: v.optional(v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard')
    )),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { guideId, ...updates } = args;
    await ctx.db.patch(guideId, updates);
  },
});

export const deleteStudyGuide = mutation({
  args: {
    guideId: v.id('studyGuides'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.guideId);
  },
});

export const searchStudyGuides = query({
  args: {
    userId: v.string(),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userGuides = await ctx.db
      .query('studyGuides')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    const publicGuides = await ctx.db
      .query('studyGuides')
      .withIndex('by_public', (q) => q.eq('isPublic', true))
      .collect();

    const allGuides = [...userGuides, ...publicGuides];
    
    const searchTerm = args.query.toLowerCase();
    const filteredGuides = allGuides.filter(guide => 
      guide.title.toLowerCase().includes(searchTerm) ||
      guide.description?.toLowerCase().includes(searchTerm) ||
      guide.topic.toLowerCase().includes(searchTerm) ||
      guide.subject.toLowerCase().includes(searchTerm) ||
      guide.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    return filteredGuides
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, args.limit || 20);
  },
});

export const getRecentGuides = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('studyGuides')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(args.limit || 5);
  },
});

export const getGuideStats = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const guides = await ctx.db
      .query('studyGuides')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    const totalGuides = guides.length;
    const completedGuides = guides.filter(guide => guide.progress === 100).length;
    const inProgressGuides = guides.filter(guide => guide.progress > 0 && guide.progress < 100).length;
    const totalSteps = guides.reduce((sum, guide) => sum + guide.totalSteps, 0);
    const completedSteps = guides.reduce((sum, guide) => sum + guide.completedSteps, 0);
    const averageProgress = totalGuides > 0 ? Math.round(guides.reduce((sum, guide) => sum + guide.progress, 0) / totalGuides) : 0;

    return {
      totalGuides,
      completedGuides,
      inProgressGuides,
      totalSteps,
      completedSteps,
      averageProgress,
    };
  },
});
