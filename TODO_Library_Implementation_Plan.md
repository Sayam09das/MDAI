# Library Implementation Plan

## 📋 Current State Analysis

### Backend Status ✅
- **ResourceModel.js**: Complete with fields for teacher/admin info, file uploads, file types
- **resource.controller.js**: Complete with CRUD operations for teachers and admins
- **resource.routes.js**: Complete with authentication middleware
- **multer.js**: Configured for 100MB file uploads

### Frontend Status ⚠️
- **TeacherLibrary.jsx**: Exists with UI but uses static data (needs API integration)
- **Student Routes**: No library route yet (need to create)
- **Admin Routes**: No library route yet (need to create)

---

## 🎯 Implementation Tasks

### Phase 1: Backend Updates (Already Done ✅)
- [x] ResourceModel.js - Full schema with teacher/admin fields
- [x] resource.controller.js - CRUD operations with auth
- [x] resource.routes.js - Protected routes for all roles

### Phase 2: Frontend - API Integration Layer
- [ ] Create `api.js` in client/src/lib/ for resource API calls
- [ ] Create API endpoints for:
  - GET /api/resources (all resources for students)
  - GET /api/resources/admin/all (all resources for admin)
  - GET /api/resources/teacher/me (own resources for teacher)
  - POST /api/resources (create resource)
  - PUT /api/resources/:id (update resource)
  - DELETE /api/resources/:id (delete resource)

### Phase 3: Teacher Library - Full Implementation
- [ ] Update TeacherLibrary.jsx to:
  - Fetch own resources from API on mount
  - Implement upload modal with file selection
  - Support video, image, zip, pdf uploads
  - Show edit/delete buttons for own resources
  - Display teacher name, email, profile image
  - Real-time CRUD operations

### Phase 4: Student Library - Full Implementation
- [ ] Create StudentLibrary.jsx:
  - View ALL resources from all teachers
  - Display teacher name, email, profile for each resource
  - Filter by file type (video, pdf, zip, image)
  - Search by title, description, course, teacher
  - Download functionality for all files
  - View preview for supported files
  - Grid/List view toggle

- [ ] Create ReturnStudentLibrary.jsx wrapper
- [ ] Add route to StudentRoutes.jsx
- [ ] Update StudentSidebar.jsx library link

### Phase 5: Admin Library - Full Implementation
- [ ] Create AdminLibrary.jsx:
  - View ALL resources (teacher + admin uploads)
  - See uploader info (teacher or admin)
  - Filter by uploader type (teacher/admin)
  - Filter by file type
  - Search functionality
  - **EDIT** any resource (full edit capabilities)
  - **DELETE** any resource (no restrictions)

- [ ] Create ReturnAdminLibrary.jsx wrapper
- [ ] Add route to DashboardRoutes.jsx in admin/

---

## 📁 File Changes Summary

### New Files to Create:
1. `client/src/lib/resourceApi.js` - API integration layer
2. `client/src/Pages/Student/Dashboard/MainLibrary/StudentLibrary.jsx`
3. `client/src/Pages/Student/Dashboard/MainLibrary/ReturnStudentLibrary.jsx`
4. `client/src/Pages/admin/Dashboard/MainLibrary/AdminLibrary.jsx`
5. `client/src/Pages/admin/Dashboard/MainLibrary/ReturnAdminLibrary.jsx`

### Files to Update:
1. `client/src/routes/StudentRoutes.jsx` - Add library route
2. `client/src/routes/DashboardRoutes.jsx` (admin) - Add library route
3. `client/src/Pages/teacher/Dashboard/MainTeacherLibrary/TeacherLibrary.jsx` - Connect to API

---

## 🔐 Role-Based Permissions

| Feature | Student | Teacher | Admin |
|---------|---------|---------|-------|
| View all resources | ✅ | ✅ (own) | ✅ (all) |
| Upload resources | ❌ | ✅ | ✅ |
| Edit own resources | ❌ | ✅ (own) | ✅ (all) |
| Delete own resources | ❌ | ✅ (own) | ✅ (all) |
| Edit any resources | ❌ | ❌ | ✅ |
| Delete any resources | ❌ | ❌ | ✅ |
| Download resources | ✅ | ✅ | ✅ |

---

## 🚀 Next Steps
1. Create API integration layer
2. Implement Student Library
3. Implement Admin Library
4. Update Teacher Library with API
5. Test all functionality

