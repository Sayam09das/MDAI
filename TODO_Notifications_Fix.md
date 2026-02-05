# Notifications Fix Plan

## Task ✅ COMPLETED
Replace hardcoded demo notifications in StudentNavbar and TeacherNavbar with real message notifications from the messaging system.

## Files Edited

### Navbar Files
1. `client/src/components/Dashboard/Student/StudentNavbar.jsx` ✅
2. `client/src/components/Dashboard/Teacher/TeacherNavbar.jsx` ✅

### Messages Pages (URL params handling)
3. `client/src/Pages/teacher/Dashboard/Messages/TeacherMessages.jsx` ✅
4. `client/src/Pages/Student/Dashboard/Messages/StudentMessages.jsx` ✅

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
✅ Same real-time notification system as StudentNavbar
✅ Navigation path: `/teacher/messages?conversation={id}`

### TeacherMessages.jsx & StudentMessages.jsx
✅ Added URL query parameter handling (`?conversation={id}`)
✅ Auto-open conversation when clicking notification
✅ Clear URL after opening conversation
✅ Fallback to fetch conversation directly if not in conversation list

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

## How it Works

1. When a new message is sent via socket, the navbar receives `new_message_notification` event
2. The notification is added to the state with sender info and message content
3. Clicking a notification navigates to `/teacher/messages?conversation={id}` or `/student-dashboard/messages?conversation={id}`
4. The messages page reads the URL parameter and automatically opens the conversation
5. The URL is cleared after the conversation opens

