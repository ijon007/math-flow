import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    polarCustomerId: v.optional(v.string()),
    isPro: v.optional(v.boolean()),
    hasSeenUpgradePrompt: v.optional(v.boolean()),
    billingInterval: v.optional(v.union(v.literal('month'), v.literal('year'))),
    renewsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    polarSubscriptionId: v.optional(v.string()),
    planProductId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerkUserId', ['clerkUserId'])
    .index('by_polarCustomerId', ['polarCustomerId'])
    .index('by_polarSubscriptionId', ['polarSubscriptionId'])
    .index('by_email', ['email']),
  threads: defineTable({
    title: v.string(),
    userId: v.string(), // Clerk user ID
    createdAt: v.number(),
    updatedAt: v.number(),
    messageCount: v.number(),
    isBookmarked: v.boolean(),
    isShared: v.optional(v.boolean()),
    tags: v.array(v.string()),
    preview: v.optional(v.string()), // First message preview
  })
    .index('by_user', ['userId'])
    .index('by_user_bookmarked', ['userId', 'isBookmarked'])
    .index('by_updated', ['updatedAt']),

  messages: defineTable({
    threadId: v.id('threads'),
    role: v.union(
      v.literal('user'),
      v.literal('assistant'),
      v.literal('system')
    ),
    content: v.optional(v.string()), // Text content for non-tool messages
    parts: v.array(v.any()), // AI SDK message parts with flexible structure
    createdAt: v.number(),
    order: v.number(), // For message ordering within thread
  })
    .index('by_thread', ['threadId'])
    .index('by_thread_order', ['threadId', 'order']),

  graphs: defineTable({
    threadId: v.id('threads'),
    messageId: v.optional(v.id('messages')), // Reference to the message that generated this
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(), // "function", "bar", "line", "scatter", "histogram", "polar", "parametric"
    equation: v.optional(v.string()), // For function graphs
    data: v.any(), // Chart/graph data points
    config: v.optional(v.any()), // Chart configuration
    metadata: v.optional(v.any()), // Additional metadata
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_thread', ['threadId'])
    .index('by_message', ['messageId'])
    .index('by_type', ['type']),

  flashcards: defineTable({
    threadId: v.id('threads'),
    messageId: v.optional(v.id('messages')),
    userId: v.string(),
    topic: v.string(),
    difficulty: v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard')
    ),
    subject: v.optional(v.string()),
    tags: v.array(v.string()),
    cards: v.array(
      v.object({
        id: v.string(),
        front: v.string(),
        back: v.string(),
      })
    ),
    createdAt: v.number(),
    lastStudied: v.optional(v.number()),
    mastery: v.number(), // 0-100
    studyCount: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_thread', ['threadId'])
    .index('by_message', ['messageId'])
    .index('by_difficulty', ['difficulty'])
    .index('by_subject', ['subject']),

  stepByStepSolutions: defineTable({
    threadId: v.id('threads'),
    messageId: v.id('messages'),
    userId: v.string(),
    problem: v.string(),
    method: v.string(),
    solution: v.string(),
    steps: v.array(
      v.object({
        stepNumber: v.number(),
        description: v.string(),
        equation: v.string(),
        tip: v.optional(v.string()),
        highlight: v.optional(v.string()),
      })
    ),
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_thread', ['threadId'])
    .index('by_message', ['messageId'])
    .index('by_method', ['method']),

  bookmarks: defineTable({
    threadId: v.id('threads'),
    userId: v.string(),
    createdAt: v.number(),
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_thread', ['threadId'])
    .index('by_user_thread', ['userId', 'threadId']),

  practiceTests: defineTable({
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
    timeLimit: v.optional(v.number()), // in minutes
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
        options: v.optional(v.array(v.string())), // for multiple choice
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        points: v.number(),
        difficulty: v.union(
          v.literal('easy'),
          v.literal('medium'),
          v.literal('hard')
        ),
        tags: v.array(v.string()),
        timeLimit: v.optional(v.number()), // per question in seconds
      })
    ),
    tags: v.array(v.string()),
    createdAt: v.number(),
    lastTaken: v.optional(v.number()),
    attempts: v.number(),
    averageScore: v.number(), // 0-100
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
  })
    .index('by_user', ['userId'])
    .index('by_thread', ['threadId'])
    .index('by_message', ['messageId'])
    .index('by_difficulty', ['difficulty'])
    .index('by_subject', ['subject'])
    .index('by_public', ['isPublic'])
    .index('by_user_public', ['userId', 'isPublic']),
});
