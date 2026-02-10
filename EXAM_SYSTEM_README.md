# Secure Online Examination System - Implementation Guide

## Overview
A comprehensive anti-cheating examination system built for the MERN stack LMS application with professional-grade security features.

## Features Implemented

### 🔒 Security Features
1. **Tab/Window Switch Detection**
   - Real-time monitoring using `visibilitychange` and `blur` events
   - Automatic warning system (1st, 3rd, 5th violations)
   - Time tracking outside exam window

2. **Full-Screen Mode**
   - Auto-enter fullscreen when exam starts
   - Fullscreen exit detection and prevention
   - Automatic re-entry attempts

3. **Time-Based Disqualification**
   - 5-minute maximum outside time limit
   - Auto-submit when time limit exceeded
   - Server-side timer validation

4. **Restriction Controls**
   - Copy/Paste disabled
   - Right-click blocked
   - Text selection prevented
   - Keyboard shortcuts blocked (Ctrl+C, F12, Alt+Tab, etc.)
   - Page refresh prevented
   - Back button disabled

5. **Developer Tools Detection**
   - Console log monitoring
   - Window dimension checks
   - Debugger detection

### ⏱️ Timer System
- **Client-side**: Real-time countdown with sub-second precision
- **Server-side**: Heartbeat system (30-second intervals)
- **Auto-submit**: Triggers when:
  - Time expires
  - Student disqualified
  - Multiple heartbeat failures
  - Security violations exceed threshold

### 📊 Violation Tracking
- Tab switch count
- Time outside exam window
- Fullscreen exits
- Copy/paste attempts
- Keyboard shortcut blocks
- Developer tools detection

## Files Created

### Backend
```
backend/
├── models/
│   └── examModel.js          # Exam session schema with security tracking
├── controllers/
│   └── exam.controller.js    # All exam operations (start, submit, heartbeat, etc.)
└── routes/
    └── exam.routes.js        # API endpoints for exam management
```

### Frontend
```
client/
├── lib/api/
│   └── examApi.js            # Exam API client functions
├── hooks/
│   └── useExamSecurity.js    # Custom hook for exam security management
├── utils/
│   └── examSecurity.js       # Security utility functions
└── Pages/Student/
    └── Exam/
        └── ExamPage.jsx     # Main exam interface component
```

## API Endpoints

### Student Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/exams/:assignmentId/start` | Start exam session |
| POST | `/api/exams/:examId/submit` | Submit exam with answers |
| POST | `/api/exams/:examId/heartbeat` | Send heartbeat (every 30s) |
| POST | `/api/exams/:examId/violation` | Report a violation |
| GET | `/api/exams/:examId/status` | Get exam status |
| GET | `/api/exams/student/active` | Get active exams |
| GET | `/api/exams/student/history` | Get exam history |

### Teacher Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams/analytics/:assignmentId` | Get exam analytics |

## Usage

### Starting an Exam
```javascript
import { startExam } from '../lib/api/examApi';

// Student clicks "Start Exam"
const response = await startExam(assignmentId, duration);
// Response includes examSession ID and timing info
```

### In the Exam Page
```javascript
import useExamSecurity from '../hooks/useExamSecurity';

const ExamPage = () => {
    const {
        timeRemaining,
        formattedTime,
        violations,
        violationCount,
        warningMessage,
        submitExamSession
    } = useExamSecurity(assignmentId, examId);

    // Security is automatically managed
    // Timer runs, violations tracked, etc.
};
```

### Auto-Submit Behavior
The system automatically submits the exam when:
1. Timer reaches 00:00
2. Student spends > 5 minutes outside exam window
3. Student exits fullscreen multiple times
4. Multiple security violations occur
5. Heartbeat connection lost

## Configuration Constants

```javascript
// In client/src/utils/examSecurity.js
export const EXAM_SECURITY_CONFIG = {
    HEARTBEAT_INTERVAL: 30000,      // 30 seconds
    MAX_TIME_OUTSIDE: 300000,      // 5 minutes (300 seconds)
    MAX_VIOLATIONS: 5,
    HEARTBEAT_TIMEOUT: 120000,     // 2 minutes
    WARNING_THRESHOLDS: [1, 3],    // Violation counts for warnings
    WARNING_MESSAGES: [
        "⚠️ First Warning: Do not leave the exam window!",
        "⚠️ Second Warning: Multiple violations recorded!",
        "🚫 Final Warning: One more violation and you'll be disqualified!"
    ]
};
```

## Database Schema

### ExamSession Model
```javascript
{
    assignment: ObjectId,      // Reference to Assignment
    student: ObjectId,         // Reference to User
    course: ObjectId,          // Reference to Course
    startTime: Date,          // When exam started
    endTime: Date,            // When exam should end
    duration: Number,         // Duration in minutes
    status: String,          // NOT_STARTED, IN_PROGRESS, SUBMITTED, AUTO_SUBMITTED, DISQUALIFIED, EXPIRED
    violations: [{
        type: String,         // TAB_SWITCH, COPY_ATTEMPT, etc.
        timestamp: Date,
        details: String,
        duration: Number
    }],
    totalViolations: Number,
    tabSwitchCount: Number,
    timeOutside: Number,      // Total milliseconds outside
    fullscreenExits: Number,
    lastHeartbeat: Date,
    answers: Map,             // Student answers
    submission: ObjectId,      // Reference to Submission
    autoSubmitReason: String,  // Reason for auto-submit
    disqualifiedReason: String
}
```

## Security Best Practices

### Server-Side Validation
- Never trust client-side time - use server time
- Validate all submissions server-side
- Check for duplicate sessions
- Rate limit API endpoints

### Client-Side Protections
- Apply security restrictions immediately on exam start
- Clear violations on submit
- Backup violations to localStorage (for network issues)

### Monitoring
- Log all violations with timestamps
- Track IP addresses
- Monitor for suspicious patterns

## Integration with Existing System

### Assignment Page Updates
The `ReturnStudentAssignments.jsx` has been updated to include:
- "Start Secure Exam" button for each assignment
- Visual distinction for exam-type assignments

### Routes
Added to `StudentRoutes.jsx`:
```jsx
<Route path="exam/:assignmentId" element={<ExamPage />} />
```

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

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Limited (fullscreen may not work)

## Limitations & Considerations

1. **Fullscreen API**: Some browsers may block fullscreen without user gesture
2. **Mobile Devices**: Fullscreen and some restrictions may not work
3. **Dev Tools**: Sophisticated users can bypass client-side detection
4. **Network Issues**: localStorage backup for violations

## Future Enhancements

1. **Webcam Integration**: Record student during exam
2. **Screen Sharing**: Require screen share during exam
3. **AI Detection**: Detect face detection, multiple faces, etc.
4. **Proctoring Service**: Integrate with professional proctoring services
5. **Mobile App Support**: Native mobile exam experience

## License
Part of the MDAI Learning Management System

