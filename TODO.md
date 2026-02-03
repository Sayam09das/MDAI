# Teacher Settings Implementation Plan

## 1. Update Teacher Model ✅
- [x] Add `settings` object to teacher schema with:
  - [x] `theme` (string, default: 'system')
  - [x] `language` (string, default: 'en')
  - [x] `notifications` (object with email, push, sms, newStudent, classReminder, newMessage, weeklyReport)
  - [x] `privacy` (object with profileVisible, showEmail, showPhone, allowMessages)

## 2. Add Backend API Endpoints ✅
- [x] Add `GET /api/teacher/settings` - Get teacher settings
- [x] Add `PATCH /api/teacher/settings` - Update all settings
- [x] Add `POST /api/teacher/change-password` - Change password with validation
- [x] Add `GET /api/teacher/profile` - Get current teacher profile data

## 3. Update TeacherSettings.jsx ✅
- [x] Fetch settings on component mount
- [x] Fetch teacher profile data
- [x] Save settings to API when changed
- [x] Add loading states and error handling
- [x] Implement password change with API
- [x] Add toast notifications for success/error

## 4. Testing
- [ ] Test settings load on page mount
- [ ] Test settings save when toggling
- [ ] Test password change functionality
- [ ] Test theme/language changes persist

