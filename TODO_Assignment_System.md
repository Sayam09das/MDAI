# Assignment System Implementation Plan

## Phase 1: Backend Models
- [ ] Create `backend/models/assignmentModel.js` - Assignment schema
- [ ] Create `backend/models/submissionModel.js` - Submission schema

## Phase 2: Backend Controllers
- [ ] Create `backend/controllers/assignment.controller.js` - Assignment CRUD operations
- [ ] Create `backend/controllers/submission.controller.js` - Submission handling

## Phase 3: Backend Routes
- [ ] Create `backend/routes/assignment.routes.js` - Assignment API routes
- [ ] Create `backend/routes/submission.routes.js` - Submission API routes
- [ ] Register routes in `backend/app.js`

## Phase 4: Client API
- [ ] Add assignment APIs to `client/src/lib/api/studentApi.js`

## Phase 5: Teacher Dashboard Pages
- [ ] Create `MainAssignments/` folder and components
- [ ] Create `CreateAssignment/` folder and components
- [ ] Create `AssignmentSubmissions/` folder and components
- [ ] Create `GradeSubmission/` folder and components

## Phase 6: Student Dashboard Pages
- [ ] Create `StudentAssignments/` folder and components
- [ ] Create `SubmitAssignment/` folder and components

## Phase 7: Route Integration
- [ ] Update `client/src/routes/TeacherRoutes.jsx`
- [ ] Update `client/src/routes/StudentRoutes.jsx`

## Phase 8: Sidebar Integration
- [ ] Update `client/src/components/Dashboard/Teacher/TeacherSidebar.jsx`
- [ ] Update `client/src/components/Dashboard/Student/StudentSidebar.jsx`

## Features Implemented
✅ Teacher creates assignments (title, description, due date, max marks, submission type, attachments)
✅ Students view assignments on their dashboard
✅ Students submit assignments (file upload or text)
✅ Late submission detection
✅ Teacher grades submissions with feedback
✅ Real-time status updates (via API)
✅ Consolidated submissions view for teachers
✅ Assignment analytics

## API Endpoints

### Assignments
- `POST /api/assignments` - Create assignment (teacher)
- `GET /api/assignments` - Get teacher's assignments
- `GET /api/assignments/:id` - Get single assignment
- `PUT /api/assignments/:id` - Update assignment (teacher)
- `DELETE /api/assignments/:id` - Delete assignment (teacher)
- `GET /api/assignments/course/:courseId` - Get assignments for a course (student)

### Submissions
- `POST /api/submissions` - Submit assignment (student)
- `GET /api/submissions/assignment/:assignmentId` - Get all submissions for an assignment (teacher)
- `GET /api/submissions/my` - Get student's submissions
- `GET /api/submissions/:id` - Get single submission
- `PUT /api/submissions/:id/grade` - Grade submission (teacher)
- `PUT /api/submissions/:id` - Update submission (student, before deadline)

