# Notifications Fix Plan

## Task ✅ COMPLETED
Replace hardcoded demo notifications in StudentNavbar and TeacherNavbar with real message notifications from the messaging system.

## Files Edited
1. `client/src/components/Dashboard/Student/StudentNavbar.jsx` ✅
2. `client/src/components/Dashboard/Teacher/TeacherNavbar.jsx` ✅

## Changes Made

### StudentNavbar.jsx
✅ Removed hardcoded demo notifications array
✅ Initialize notifications from localStorage (for persistence)
✅ Listen to socket `new_message_notification` events
✅ Update notification display to show sender name, message preview, and time
✅ Handle notification click to navigate to messages
✅ Added "Mark all read" and "Clear" buttons
✅ Show sender avatar in notifications
✅ Added empty state when no notifications

### TeacherNavbar.jsx
✅ Same changes as StudentNavbar.jsx
✅ Navigation path: `/teacher/messages?conversation={id}`

## Implementation Details

1. **Socket Integration**: Dynamically import socket.io-client and connect to receive `new_message_notification` events
2. **Notification Format**:
   - id: unique identifier (timestamp)
   - text: formatted message like "John Doe: Hey, how are you?"
   - time: "Just now" (can be updated to relative time)
   - unread: boolean
   - senderName: sender's full name
   - senderImage: sender's profile image URL
   - conversationId: for navigation

3. **Persistence**: Store notifications in localStorage (`student_notifications` / `teacher_notifications`) to persist across page refreshes

4. **Features**:
   - Max 20 notifications stored
   - Click notification to mark as read and navigate to conversation
   - "Mark all read" button
   - "Clear" button to remove all notifications
   - Empty state with icon when no notifications
   - Unread indicator (indigo dot)
   - Sender avatar display

## Follow-up Steps
1. Test notifications appear correctly when receiving messages
2. Test notification click navigates to messages
3. Test unread count updates correctly

