# Attendance Frontend Fix

## Issue
Course ID and Student ID are required but attendance is not showing because the frontend doesn't pass these IDs.

## Root Cause
- `ReturnStudentAttendance.jsx` doesn't pass `courseId` and `studentId` props to `StudentAttendance` component
- There's no UI to select a course and student

## Solution
Update `ReturnStudentAttendance.jsx` to:
1. Fetch teacher's courses using `/api/courses/teacher`
2. Fetch students using `/api/teacher/students`
3. Add dropdowns to select course and student
4. Pass the selected IDs to `StudentAttendance` component

## Files to Edit
- `client/src/Pages/teacher/Dashboard/MainAttendance/ReturnStudentAttendance.jsx`

## Status
- [x] Update ReturnStudentAttendance.jsx with course/student selection UI
- [x] Test the fix

