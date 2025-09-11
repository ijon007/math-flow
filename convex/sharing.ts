import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const shareItem = mutation({
  args: {
    itemType: v.union(
      v.literal('thread'),
      v.literal('flashcard'),
      v.literal('graph'),
      v.literal('practiceTest'),
      v.literal('studyGuide')
    ),
    itemId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { itemType, itemId, userId } = args;

    // Check if already shared
    const existingShare = await ctx.db
      .query('shared')
      .withIndex('by_item', (q) => q.eq('itemType', itemType).eq('itemId', itemId))
      .first();

    if (existingShare) {
      if (existingShare.isActive) {
        return existingShare._id; // Already shared
      } else {
        // Reactivate existing share
        await ctx.db.patch(existingShare._id, { isActive: true });
        return existingShare._id;
      }
    }

    // Create new share
    const shareId = await ctx.db.insert('shared', {
      itemType,
      itemId,
      userId,
      createdAt: Date.now(),
      isActive: true,
    });

    return shareId;
  },
});

export const unshareItem = mutation({
  args: {
    itemType: v.union(
      v.literal('thread'),
      v.literal('flashcard'),
      v.literal('graph'),
      v.literal('practiceTest'),
      v.literal('studyGuide')
    ),
    itemId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { itemType, itemId, userId } = args;

    const existingShare = await ctx.db
      .query('shared')
      .withIndex('by_item', (q) => q.eq('itemType', itemType).eq('itemId', itemId))
      .first();

    if (existingShare && existingShare.userId === userId) {
      await ctx.db.patch(existingShare._id, { isActive: false });
      return true;
    }

    return false;
  },
});

export const getSharedItem = query({
  args: {
    itemType: v.union(
      v.literal('thread'),
      v.literal('flashcard'),
      v.literal('graph'),
      v.literal('practiceTest'),
      v.literal('studyGuide')
    ),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const { itemType, itemId } = args;

    // Check if item is shared
    const share = await ctx.db
      .query('shared')
      .withIndex('by_item', (q) => q.eq('itemType', itemType).eq('itemId', itemId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();

    if (!share) {
      console.log('No active share found for:', { itemType, itemId });
      return null;
    }

    // Get the actual item based on type
    let item;
    switch (itemType) {
      case 'thread':
        item = await ctx.db.get(itemId as any);
        break;
      case 'flashcard':
        item = await ctx.db.get(itemId as any);
        break;
      case 'graph':
        item = await ctx.db.get(itemId as any);
        break;
      case 'practiceTest':
        item = await ctx.db.get(itemId as any);
        break;
      case 'studyGuide':
        item = await ctx.db.get(itemId as any);
        break;
      default:
        return null;
    }

    if (!item) {
      console.log('Item not found in database:', { itemType, itemId });
      return null;
    }

    return item;
  },
});

export const isItemShared = query({
  args: {
    itemType: v.union(
      v.literal('thread'),
      v.literal('flashcard'),
      v.literal('graph'),
      v.literal('practiceTest'),
      v.literal('studyGuide')
    ),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const { itemType, itemId } = args;

    const share = await ctx.db
      .query('shared')
      .withIndex('by_item', (q) => q.eq('itemType', itemType).eq('itemId', itemId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();

    return !!share;
  },
});
