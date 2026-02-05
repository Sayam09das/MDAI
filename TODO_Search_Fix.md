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
- [ ] Edit StudentNavbar.jsx
- [ ] Edit TeacherNavbar.jsx
- [ ] Test search functionality

## Notes
Based on existing search patterns in:
- `EnrolledStudents.jsx` - uses filtered array approach
- `TeacherTasks.jsx` - uses filtered array approach

We'll implement URL-based search to support page navigation.

