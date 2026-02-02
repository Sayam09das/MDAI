# TODO: Interconnect EnrolledStudents.jsx and StudentAttendance.jsx

## Changes Required:

### 1. EnrolledStudents.jsx
- [x] Import `useNavigate` from react-router-dom
- [x] Add "View Details" button that navigates to attendance page with query params

### 2. ReturnStudentAttendance.jsx
- [x] Import `useSearchParams` from react-router-dom
- [x] Add logic to read courseId and studentId from URL query parameters
- [x] Auto-select course and student if params exist

## Execution Order:
- [x] 1. Edit EnrolledStudents.jsx - Add navigation
- [x] 2. Edit ReturnStudentAttendance.jsx - Add URL param handling


