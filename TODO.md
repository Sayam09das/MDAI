# TODO - Teacher Real-time Stats Implementation

## Backend Changes
- [x] 1. Add `getTeacherDashboardStats` function in `backend/controllers/teacherAuth.controller.js`
- [x] 2. Add new route `GET /api/teacher/dashboard/stats` in `backend/routes/teacher.routes.js`

## Frontend Changes
- [x] 3. Update `TeacherStats.jsx` to fetch and display real-time stats
- [ ] 4. Test the implementation

## Details

### Backend: `getTeacherDashboardStats` function should:
1. Get teacher ID from `req.user.id`
2. Find all courses by this teacher
3. Calculate:
   - totalCourses: count of courses
   - totalStudents: count of unique students from PAID enrollments
   - liveClasses: count of lessons (from lessonModel)
   - earnings: sum of course price × PAID enrollment count

### Frontend: `TeacherStats.jsx` changes:
1. Use `useEffect` to fetch data on mount
2. Add loading state
3. Handle API response and display real data

