# TODO: Fix Search Bar Functionality in Navbars

## Task Summary
Fix the search bar functionality in both StudentNavbar and TeacherNavbar components.

## Files to Edit
1. `client/src/components/Dashboard/Student/StudentNavbar.jsx`
2. `client/src/components/Dashboard/Teacher/TeacherNavbar.jsx`

## Changes Required

### 1. Add Search State
```javascript
const [searchQuery, setSearchQuery] = useState("");
```

### 2. Add onChange Handler
```javascript
const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
};
```

### 3. Add Search Submit Handler
```javascript
const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
    }
};
```

### 4. Add Clear Search Functionality
```javascript
const clearSearch = () => {
    setSearchQuery('');
};
```

### 5. Update Input Element
- Add `value={searchQuery}`
- Add `onChange={handleSearchChange}`
- Add `onKeyDown={handleSearchSubmit}`
- Add clear button when searchQuery has text

## Progress
- [x] Edit StudentNavbar.jsx
- [x] Edit TeacherNavbar.jsx
- [x] Create Student Search Page
- [x] Create Teacher Search Page
- [x] Add Routes for Search Pages

## Files Created
- `client/src/Pages/Student/Dashboard/Search/Search.jsx`
- `client/src/Pages/Student/Dashboard/Search/ReturnSearch.jsx`
- `client/src/Pages/teacher/Dashboard/MainSearch/Search.jsx`
- `client/src/Pages/teacher/Dashboard/MainSearch/ReturnSearch.jsx`

## Routes Added
- `/student-dashboard/search`
- `/teacher-dashboard/search`

## Features Implemented
1. **Real-time search input** - Text updates as you type
2. **Keyboard support** - Press Enter to search
3. **Clear button** - X button to clear search
4. **URL navigation** - Search queries are passed via URL parameters
5. **Search results page** - Dedicated page to display results
6. **Tab filtering** - Filter by All, Courses, Students, Resources

## Notes
Based on existing search patterns in:
- `EnrolledStudents.jsx` - uses filtered array approach
- `TeacherTasks.jsx` - uses filtered array approach

URL-based search is implemented for page navigation support.
The search results page shows simulated data and can be connected to real API endpoints.

