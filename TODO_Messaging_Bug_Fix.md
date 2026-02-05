# Messaging System Bug Fix - Null Reference Error

## Error
```
TypeError: Cannot read properties of null (reading '_id')
```

## Root Cause
The `p.userId` field can be `null` when MongoDB population fails or returns null, and the code tries to access `._id` on it without proper null checking.

## Fixes Required

### 1. Fix getConversations function (line ~368-375)
- Location: `backend/controllers/message.controller.js`
- Issue: `p.userId._id` is accessed without null check

### 2. Fix getOrCreateConversation function (line ~466-467)
- Location: `backend/controllers/message.controller.js`
- Issue: `p.userId._id` is accessed without null check

### 3. Fix searchConversations function (line ~513)
- Location: `backend/controllers/message.controller.js`
- Issue: `p.userId._id` is accessed without null check

## Progress
- [x] Analyze error
- [x] Create plan
- [x] Fix getConversations function
- [x] Fix getOrCreateConversation function
- [x] Fix searchConversations function
- [x] Verify all unsafe access patterns are fixed

## Summary of Changes
Fixed `TypeError: Cannot read properties of null (reading '_id')` error and "Unknown User" display issue by:

### 1. Added optional chaining for null safety (5 locations):

**`getConversations`** (lines ~352-363):
- `p.userId?._id` instead of `p.userId._id`
- `otherParticipant?.userId` instead of `otherParticipant.userId`

**`getOrCreateConversation`** (lines ~449-476):
- `p.userId?._id` instead of `p.userId._id`
- `otherParticipant.userId?._id` instead of `otherParticipant.userId._id`

**`searchConversations`** (lines ~516-523):
- `p.userId?._id?.toString()` instead of `p.userId._id.toString()`
- `otherParticipant?.userId?.fullName` instead of `otherParticipant.userId.fullName`

### 2. Added population for participant user data in `getConversations`:

Added proper population of `participants.userId` with both User and Teacher models to display actual names and profile pictures instead of "Unknown User".

## Testing
Deploy to Render and test the following:
- [x] Fetch conversations list (should show actual student names)
- [x] Create new conversation
- [x] Search conversations

