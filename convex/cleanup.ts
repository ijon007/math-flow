import { mutation } from './_generated/server';

export const cleanupOrphanedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all threads
    const threads = await ctx.db.query('threads').collect();
    const threadIds = new Set(threads.map((t) => t._id));

    // Find orphaned messages
    const allMessages = await ctx.db.query('messages').collect();
    const orphanedMessages = allMessages.filter(
      (m) => !threadIds.has(m.threadId)
    );

    console.log(`Found ${orphanedMessages.length} orphaned messages`);

    // Delete orphaned messages
    for (const message of orphanedMessages) {
      await ctx.db.delete(message._id);
    }

    // Find orphaned graphs
    const allGraphs = await ctx.db.query('graphs').collect();
    const orphanedGraphs = allGraphs.filter((g) => !threadIds.has(g.threadId));

    console.log(`Found ${orphanedGraphs.length} orphaned graphs`);

    // Delete orphaned graphs
    for (const graph of orphanedGraphs) {
      await ctx.db.delete(graph._id);
    }

    // Find orphaned flashcards
    const allFlashcards = await ctx.db.query('flashcards').collect();
    const orphanedFlashcards = allFlashcards.filter(
      (f) => !threadIds.has(f.threadId)
    );

    console.log(`Found ${orphanedFlashcards.length} orphaned flashcards`);

    // Delete orphaned flashcards
    for (const flashcard of orphanedFlashcards) {
      await ctx.db.delete(flashcard._id);
    }

    // Find orphaned step-by-step solutions
    const allStepByStep = await ctx.db.query('stepByStepSolutions').collect();
    const orphanedStepByStep = allStepByStep.filter(
      (s) => !threadIds.has(s.threadId)
    );

    console.log(
      `Found ${orphanedStepByStep.length} orphaned step-by-step solutions`
    );

    // Delete orphaned step-by-step solutions
    for (const solution of orphanedStepByStep) {
      await ctx.db.delete(solution._id);
    }

    // Find orphaned bookmarks
    const allBookmarks = await ctx.db.query('bookmarks').collect();
    const orphanedBookmarks = allBookmarks.filter(
      (b) => !threadIds.has(b.threadId)
    );

    console.log(`Found ${orphanedBookmarks.length} orphaned bookmarks`);

    // Delete orphaned bookmarks
    for (const bookmark of orphanedBookmarks) {
      await ctx.db.delete(bookmark._id);
    }

    return {
      deletedMessages: orphanedMessages.length,
      deletedGraphs: orphanedGraphs.length,
      deletedFlashcards: orphanedFlashcards.length,
      deletedStepByStep: orphanedStepByStep.length,
      deletedBookmarks: orphanedBookmarks.length,
    };
  },
});

export const resetInactiveStreaks = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query('users').collect();
    let resetCount = 0;

    for (const user of users) {
      if (user.lastActivityDate) {
        const lastActivity = new Date(user.lastActivityDate);
        const daysSinceLastActivity = Math.floor(
          (Date.now() - lastActivity.getTime()) / (24 * 60 * 60 * 1000)
        );

        // If more than 1 day has passed since last activity, reset streak
        if (daysSinceLastActivity > 1) {
          await ctx.db.patch(user._id, {
            streak: 0,
            lastActivityDate: null,
            updatedAt: Date.now(),
          });
          resetCount++;
        }
      }
    }

    console.log(`Reset streaks for ${resetCount} inactive users`);
    return { resetCount };
  },
});
