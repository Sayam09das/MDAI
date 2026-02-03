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

---

# TODO - Student Performance Analytics (Backend to Frontend)

## Backend Changes
- [x] 1. Add `getStudentPerformanceAnalytics` function in `backend/controllers/teacherAuth.controller.js`
- [x] 2. Add new route `GET /api/teacher/dashboard/student-performance` in `backend/routes/teacher.routes.js`

## Frontend Changes
- [x] 3. Update `StudentPerformance.jsx` to fetch and display real performance data

## Details

### Backend: `getStudentPerformanceAnalytics` function:
1. Get teacher ID from `req.user.id`
2. Find all courses by this teacher
3. Calculate attendance-based performance metrics:
   - Weekly: Daily attendance rates for last 7 days
   - Monthly: Weekly aggregated attendance for last 4 weeks
   - Yearly: Monthly aggregated attendance for 6 data points
4. Returns data in format: `{ name: string, students: number }[]`
5. Also returns summary with total students and average attendance

### Frontend: `StudentPerformance.jsx` changes:
1. Use `useEffect` to fetch data when range changes
2. Add loading state with skeleton UI
3. Add error state with fallback message
4. Fetch from `${BACKEND_URL}/api/teacher/dashboard/student-performance?range=${range}`
5. Display attendance percentage instead of student count
6. Show total students in header

