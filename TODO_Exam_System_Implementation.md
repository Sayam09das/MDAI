# Secure Online Examination System - Implementation Plan

## Overview
Implement a comprehensive anti-cheating examination system with:
- Tab/window switch detection
- Full-screen exam mode
- Auto-submit on time expiration
- Warning and disqualification system
- Extensive security restrictions
- Backend validation

---

## Files to Create/Modify

### Backend Files (backend/)

#### 1. New Model: `models/examModel.js`
Create exam model to store exam sessions with security tracking:
- exam session data
- violations tracking
- time tracking
- student answers
- auto-submit status

#### 2. New Controller: `controllers/exam.controller.js`
Create exam management controller:
- `startExam()` - Initialize exam session, enter fullscreen
- `submitExam()` - Submit exam with answers
- `heartbeat()` - Server-side timer validation
- `reportViolation()` - Log violations
- `autoSubmit()` - Handle auto-submit scenarios
- `getExamStatus()` - Check exam progress

#### 3. New Routes: `routes/exam.routes.js`
Create exam API routes:
- POST `/api/exams/:assignmentId/start` - Start exam
- POST `/api/exams/:examId/submit` - Submit exam
- POST `/api/exams/:examId/heartbeat` - Heartbeat (every 30s)
- POST `/api/exams/:examId/violation` - Report violation
- GET `/api/exams/:examId/status` - Get exam status
- GET `/api/exams/student/active` - Get student's active exams

#### 4. Update: `models/submissionModel.js`
Add exam-specific fields:
- `examSession` reference
- `violations` array
- `timeOutside` tracking
- `tabSwitchCount`
- `autoSubmitted`
- `disqualified`

#### 5. Update: `middlewares/auth.middleware.js`
Add exam session validation:
- Prevent multiple concurrent exam sessions
- Validate exam session token

---

### Frontend Files (client/src/)

#### 1. New Component: `Pages/Student/Exam/ExamPage.jsx`
Main exam page with:
- Full-screen mode activation
- Timer countdown
- Question display
- Answer input
- Violation warnings
- Auto-submit on ban

#### 2. New Hook: `hooks/useExamSecurity.js`
Custom hook for security features:
- Tab switch detection
- Window blur/focus tracking
- Copy/paste prevention
- Keyboard shortcut blocking
- Developer Heart tools detection
-beat sending
- Time tracking

#### 3. New Utility: `utils/examSecurity.js`
Security utility functions:
- Enter/exit fullscreen
- Detect dev tools
- Block shortcuts
- Log violations

#### 4. New API: `lib/api/examApi.js`
Exam API functions:
- startExam()
- submitExam()
- heartbeat()
- reportViolation()

#### 5. Update: `routes/StudentRoutes.jsx`
Add exam route:
```jsx
<Route path="exam/:assignmentId" element={<ExamPage />} />
```

---

## Security Features Implementation

### 1. Tab/Window Switch Detection
**Events to listen:**
- `visibilitychange` - Detect tab switch
- `blur` - Window loses focus
- `focus` - Window gains focus

**Actions:**
- First switch → Warning message
- Log violation
- Track time outside
- After 5 minutes → Disqualify

### 2. Full-Screen Mode
**API:**
- `element.requestFullscreen()`
- `document.exitFullscreen()`

**Detection:**
- Listen for `fullscreenchange` event
- Detect if student exits fullscreen

### 3. Restrictions

#### Copy/Paste Prevention
```javascript
document.addEventListener('copy', (e) => e.preventDefault());
document.addEventListener('paste', (e) => e.preventDefault());
document.addEventListener('cut', (e) => e.preventDefault());
```

#### Right Click Prevention
```javascript
document.addEventListener('contextmenu', (e) => e.preventDefault());
```

#### Text Selection Prevention
```css
user-select: none;
-moz-user-select: none;
-webkit-user-select: none;
```

#### Keyboard Shortcuts Block
```javascript
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && ['c', 'v', 'u', 's', 'p', 'a', 'f'].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === 'F12') e.preventDefault();
    if (e.key === 'Tab') e.preventDefault();
});
```

### 4. Developer Tools Detection
**Methods:**
- `console.log` detection
- `window.outerWidth/outerHeight` check
- Debugger statement detection

### 5. Page Refresh/Back Prevention
```javascript
window.onbeforeunload = (e) => {
    e.preventDefault();
    e.returnValue = '';
};
history.pushState(null, null, location.href);
```

### 6. Heartbeat System
**Client-side:**
- Send heartbeat every 30 seconds
- Include: timestamp, page visibility, focus status
- Server validates: time elapsed, session active

**Server-side:**
- Track last heartbeat timestamp
- If no heartbeat for 2 minutes → auto-submit
- Calculate total time spent

### 7. Violation Logging
**Track:**
- Tab switch count
- Time outside exam
- Copy/paste attempts
- Dev tools opened
- Fullscreen exit count
- Keyboard shortcut blocked

---

## Auto-Submit Logic

### Triggers:
1. Timer expires (server-side)
2. Time outside > 5 minutes
3. Multiple violations
4. Student exits fullscreen permanently
5. No heartbeat for 2 minutes

### Process:
1. Lock exam interface
2. Show ban message
3. Auto-submit current answers
4. Update submission with violations
5. Prevent re-entry
6. Log event

---

## Backend Validation

### Server-Side Timer:
- Assignment has `duration` field (in minutes)
- When student starts exam, record `startTime`
- Calculate `endTime = startTime + duration`
- On submit, validate: `currentTime <= endTime`
- If submitted after `endTime`, mark as late

### Session Management:
- Single exam session per student
- Prevent multiple tabs
- Validate session token with each request

---

## Implementation Steps

### Phase 1: Backend Foundation
1. Create exam model
2. Create exam controller
3. Create exam routes
4. Update submission model

### Phase 2: Frontend Security
1. Create exam API functions
2. Create exam security utilities
3. Create useExamSecurity hook
4. Create exam page component

### Phase 3: Integration
1. Add exam route
2. Connect to assignment system
3. Add "Start Exam" button to assignments
4. Add exam results view

### Phase 4: Testing & Refinement
1. Test all security features
2. Test auto-submit scenarios
3. Test backend validation
4. Refine UI/UX

---

## File Structure

```
backend/
├── models/
│   ├── examModel.js          (NEW)
│   └── submissionModel.js    (MODIFIED)
├── controllers/
│   └── exam.controller.js    (NEW)
└── routes/
    └── exam.routes.js        (NEW)

client/src/
├── lib/api/
│   └── examApi.js            (NEW)
├── hooks/
│   └── useExamSecurity.js    (NEW)
├── utils/
│   └── examSecurity.js       (NEW)
└── Pages/Student/
    └── Exam/
        └── ExamPage.jsx     (NEW)
```

---

## API Endpoints

### POST /api/exams/:assignmentId/start
Start exam session
Request: `{ duration: 60 }`
Response: `{ success: true, examSession: {...} }`

### POST /api/exams/:examId/heartbeat
Send heartbeat
Request: `{ timestamp: Date.now(), status: "active" }`
Response: `{ success: true, serverTime: Date.now() }`

### POST /api/exams/:examId/violation
Report violation
Request: `{ type: "TAB_SWITCH", details: {...} }`
Response: `{ success: true, violationCount: 3 }`

### POST /api/exams/:examId/submit
Submit exam
Request: `{ answers: [...], timeSpent: 45 }`
Response: `{ success: true, submission: {...} }`

### GET /api/exams/:examId/status
Get exam status
Response: `{ success: true, status: "IN_PROGRESS", violations: [...] }`

---

## Constants

```javascript
const EXAM_CONFIG = {
    HEARTBEAT_INTERVAL: 30000, // 30 seconds
    MAX_TIME_OUTSIDE: 300000, // 5 minutes
    MAX_VIOLATIONS: 3,
    HEARTBEAT_TIMEOUT: 120000, // 2 minutes
    WARNING_MESSAGES: [
        "First warning: Do not leave the exam window",
        "Second warning: You have been warned",
        "Final warning: One more violation and you'll be disqualified"
    ]
};
```

---

## Estimated Time
Backend: 4-6 hours
Frontend: 6-8 hours
Integration & Testing: 2-3 hours
Total: 12-17 hours

---

## Dependencies
- None (use native browser APIs)
- Socket.io for real-time (optional, for monitoring)

---

## Security Considerations
1. Never trust client-side time - use server time
2. Validate all submissions on server
3. Store all violations for review
4. Implement rate limiting
5. Use HTTPS in production
6. Consider webcam integration (optional)

---

## UI Components Needed

### 1. Warning Banner
```jsx
<Alert variant="warning">
    ⚠️ Warning: You have left the exam tab!
</Alert>
```

### 2. Disqualification Screen
```jsx
<Modal>
    <h2>🚫 Disqualified</h2>
    <p>You exceeded the allowed time outside the exam.</p>
    <p>Your exam has been auto-submitted.</p>
</Modal>
```

### 3. Exam Header
```jsx
<div className="exam-header">
    <Timer duration={60} onExpire={handleExpire} />
    <ViolationCounter count={violations} />
    <FullscreenButton />
</div>
```

### 4. Question Navigator
```jsx
<div className="question-nav">
    {questions.map((q, i) => (
        <QuestionButton 
            key={i} 
            status={q.status}
            current={i === currentQuestion}
        />
    ))}
</div>
```

---

## Testing Checklist

- [ ] Tab switch detection works
- [ ] Fullscreen mode activates
- [ ] Timer counts down correctly
- [ ] Auto-submit on time expire
- [ ] Copy/paste blocked
- [ ] Right click blocked
- [ ] Keyboard shortcuts blocked
- [ ] Dev tools detection works
- [ ] Heartbeat sends every 30s
- [ ] Violations logged correctly
- [ ] Disqualification after 5 min outside
- [ ] Server-side timer validation
- [ ] Single session enforcement
- [ ] Re-entry prevention after submit

---

## Ready to Implement ✅
This plan covers all requirements for a professional, secure online examination system.

