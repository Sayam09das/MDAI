# TODO: JSX Parser Error Fixes

## Issues Identified
1. StudentSidebar.jsx - exports `TeacherSidebar` instead of `StudentSidebar`
2. vite.config.js - uses experimental `babel-plugin-react-compiler`
3. App.jsx - duplicate `ReturnAnnouncements` import causing symbol conflict

## Fix Plan
- [x] Fix StudentSidebar.jsx - rename exported component
- [x] Fix vite.config.js - remove experimental babel plugin
- [x] Fix App.jsx - rename duplicate imports to StudentAnnouncements and TeacherAnnouncements
- [x] Test build to verify fixes - BUILD SUCCESSFUL ✓



