# Messaging System Fix - TODO List

## Backend Fixes
- [x] 1. Add sender population utility function
- [x] 2. Update sendMessage controller with utility
- [x] 3. Update getMessages controller with utility
- [x] 4. Update getConversations controller with utility
- [x] 5. Update getOrCreateConversation controller with utility
- [x] 6. Fix socket handler for sender population

## Frontend Fixes
- [ ] 7. Create message normalization utility
- [ ] 8. Update StudentMessages.jsx with normalization
- [ ] 9. Update TeacherMessages.jsx with normalization
- [ ] 10. Update SocketContext for message normalization

## Testing
- [ ] 11. Test real-time messages
- [ ] 12. Test stored chat history
- [ ] 13. Verify sender names display correctly

## Implementation Details

### Backend Utility (message.controller.js)
```javascript
// Helper function to populate sender info
const populateSenderInfo = async (senderId, senderModel) => {
  try {
    if (senderModel === "User") {
      const user = await User.findById(senderId).select("fullName profileImage email");
      return user ? {
        _id: user._id,
        fullName: user.fullName || "Unknown User",
        profileImage: user.profileImage || null,
        role: "student",
        email: user.email
      } : null;
    } else if (senderModel === "Teacher") {
      const teacher = await Teacher.findById(senderId).select("fullName profileImage email");
      return teacher ? {
        _id: teacher._id,
        fullName: teacher.fullName || "Unknown Teacher",
        profileImage: teacher.profileImage || null,
        role: "teacher",
        email: teacher.email
      } : null;
    }
  } catch (error) {
    console.error("Error populating sender:", error);
    return null;
  }
  return null;
};
```

### Socket Handler Fix (socket.js)
- Import User and Teacher models
- Populate sender info before emitting
- Include sender role in payload

### Frontend Normalization
- Add helper to ensure sender object always has required fields
- Handle cases where sender is just an ID
- Provide fallback for missing fields

