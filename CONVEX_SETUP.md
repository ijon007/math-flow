# Convex Setup for Math Flow

This document outlines the Convex database setup for the Math Flow application.

## Database Schema

### Tables

1. **threads** - Chat conversations
   - `title`: Thread title
   - `userId`: Clerk user ID
   - `createdAt`: Creation timestamp
   - `updatedAt`: Last update timestamp
   - `messageCount`: Number of messages
   - `isBookmarked`: Bookmark status
   - `tags`: Array of tags
   - `preview`: First message preview

2. **messages** - Chat messages
   - `threadId`: Reference to thread
   - `role`: "user", "assistant", or "system"
   - `content`: Text content
   - `parts`: Array of message parts (text, tool calls)
   - `createdAt`: Creation timestamp
   - `order`: Message order in thread

3. **graphs** - Generated mathematical graphs
   - `threadId`: Reference to thread
   - `messageId`: Reference to generating message
   - `userId`: Clerk user ID
   - `title`: Graph title
   - `type`: Graph type (function, bar, line, etc.)
   - `equation`: Mathematical equation
   - `data`: Graph data points
   - `config`: Chart configuration
   - `metadata`: Additional metadata

4. **flashcards** - Generated flashcards
   - `threadId`: Reference to thread
   - `messageId`: Reference to generating message
   - `userId`: Clerk user ID
   - `topic`: Flashcard topic
   - `difficulty`: "easy", "medium", or "hard"
   - `cards`: Array of flashcard objects
   - `mastery`: Mastery level (0-100)
   - `studyCount`: Number of study sessions

5. **stepByStepSolutions** - Step-by-step solutions
   - `threadId`: Reference to thread
   - `messageId`: Reference to generating message
   - `userId`: Clerk user ID
   - `problem`: Original problem
   - `method`: Solving method
   - `solution`: Final solution
   - `steps`: Array of solution steps

6. **bookmarks** - Thread bookmarks
   - `threadId`: Reference to thread
   - `userId`: Clerk user ID
   - `createdAt`: Bookmark timestamp
   - `tags`: Array of tags
   - `notes`: Optional notes

## Environment Setup

1. Copy `env.example` to `.env.local`
2. Add your Convex URL:
   ```
   NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
   ```

## Features

- ✅ Thread-based conversations with persistent storage
- ✅ Real-time message synchronization
- ✅ Automatic extraction and storage of tool outputs (graphs, flashcards, step-by-step)
- ✅ Bookmark functionality
- ✅ User-specific data isolation
- ✅ Sidebar integration showing recent threads
- ✅ Search and filtering across all content types

## Usage

1. Start a new conversation - creates a new thread
2. Send messages - automatically saved to database
3. Generate graphs/flashcards/step-by-step - automatically extracted and stored
4. Bookmark conversations - saved to bookmarks table
5. View generated content in respective pages (graphs, flashcards, bookmarks)

## API Functions

### Threads
- `createThread` - Create new conversation thread
- `getThreadsByUser` - Get user's threads
- `getBookmarkedThreads` - Get bookmarked threads
- `toggleBookmark` - Toggle bookmark status
- `deleteThread` - Delete thread and all related data

### Messages
- `addMessage` - Add message to thread
- `getMessagesByThread` - Get thread messages
- `updateMessage` - Update message content

### Graphs
- `saveGraph` - Save generated graph
- `getGraphsByUser` - Get user's graphs
- `deleteGraph` - Delete graph

### Flashcards
- `saveFlashcards` - Save generated flashcards
- `getFlashcardsByUser` - Get user's flashcards
- `updateFlashcardProgress` - Update study progress
- `deleteFlashcard` - Delete flashcard set

### Step-by-Step
- `saveStepByStep` - Save solution
- `getStepByStepByUser` - Get user's solutions
- `deleteStepByStep` - Delete solution
