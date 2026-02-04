# Fix React Error #31 in MyCourses.jsx

## Issue
React error #31 occurs when an object is rendered directly in JSX instead of a primitive value (string, number, etc.).

## Root Cause
In `MyCourses.jsx`, the `fetchProgressForCourses` function stores the entire progress object `{percentage, completedLessons, totalLessons, remainingLessons}` in `progressMap`:

```js
progressMap[result.courseId] = result.progress;
```

But later, it tries to use it as a number in the progress bar:
```js
const progress = progressData[courseId] || e.progress || 0;
// progress is now an object, not a number
```

This causes React error #31 when the object is rendered in JSX.

## Fix Applied
File: `client/src/Pages/Student/Dashboard/MyCourses/MyCourses.jsx`

Line 94-95, changed:
```js
// Before
progressMap[result.courseId] = result.progress;

// After
progressMap[result.courseId] = result.progress?.percentage || 0;
```

## Status: ✅ FIXED

