# TODO: Fix Search Bar Functionality in Navbars

## Task Summary
Fix the search bar functionality in both StudentNavbar and TeacherNavbar components with production-level search.

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
- [x] Add Backend Search API for Courses
- [x] Add Backend Search API for Resources
- [x] Add Frontend Search API Functions

## Files Created
- `client/src/Pages/Student/Dashboard/Search/Search.jsx`
- `client/src/Pages/Student/Dashboard/Search/ReturnSearch.jsx`
- `client/src/Pages/teacher/Dashboard/MainSearch/Search.jsx`
- `client/src/Pages/teacher/Dashboard/MainSearch/ReturnSearch.jsx`

## Backend API Endpoints Added
- `GET /api/courses/search?q=<query>&limit=<limit>`
- `GET /api/resources/search?q=<query>&limit=<limit>`

## Routes Added
- `/student-dashboard/search`
- `/teacher-dashboard/search`

## Features Implemented
1. **Real-time search input** - Text updates as you type
2. **Keyboard support** - Press Enter to search
3. **Clear button** - X button to clear search
4. **URL navigation** - Search queries are passed via URL parameters
5. **Search results page** - Dedicated page to display results
6. **Tab filtering** - Filter by All, Courses, Resources
7. **Real API integration** - Searches actual courses and resources from database
8. **Course navigation** - Clicking a course navigates to the course page
9. **Resource navigation** - Clicking a resource opens it in a new tab

## How Search Works
1. User types in the navbar search bar
2. Presses Enter or clicks search icon
3. Navigates to search results page
4. Page fetches courses and resources from backend
5. Results are displayed with tabs to filter
6. Clicking a result navigates to the relevant page

## Backend Search API (MongoDB)
- Courses: Searches title, description, category, level
- Resources: Searches title, description, courseTitle, teacherName
- Uses regex with case-insensitive options ($options: "i")
- Limited to 20 results by default

## Notes
Based on existing patterns in:
- `EnrolledStudents.jsx` - uses filtered array approach
- `TeacherTasks.jsx` - uses filtered array approach

Production-level search implemented with:
- Real-time API integration
- URL parameter support for bookmarking/sharing
- Proper loading states
- Error handling
- Responsive design

