# Complaint / Grievance Box Feature - Complete Implementation

## Overview
A complete complaint management system with role-based permissions for Students, Teachers, and Admins in a MERN stack LMS.

---

## Folder Structure

```
backend/
├── models/
│   └── complaintModel.js      # Mongoose schema for complaints
├── controllers/
│   └── complaint.controller.js # All complaint logic
├── routes/
│   └── complaint.routes.js     # API routes
└── app.js                      # Route registration

client/src/Pages/
├── Student/Dashboard/Complaints/
│   └── StudentComplaints.jsx   # Student complaint page
└── teacher/Dashboard/Complaints/
    └── TeacherComplaints.jsx   # Teacher complaint page

admin/src/Dashboard/DashboardComplaints/
└── ComplaintManagement.jsx     # Admin complaint management
```

---

## API Endpoints

### Base URL: `/api/complaints`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | JWT | Create new complaint |
| GET | `/recipients` | JWT | Get list of available recipients |
| GET | `/my` | JWT | Get user's own complaints |
| GET | `/stats` | JWT | Get complaint statistics |
| GET | `/:id` | JWT | Get single complaint details |
| GET | `/admin/all` | Admin | Get all complaints (with filters) |
| PATCH | `/:id/status` | Admin | Update complaint status |
| PATCH | `/:id/remark` | Admin | Add admin remark |
| DELETE | `/:id` | Admin | Soft delete complaint |

---

## Role-Based Permissions

### Student
- ✅ Can submit complaints
- ✅ Can complain against: Teacher, Admin
- ✅ Can view only their own complaints
- ❌ Cannot see others' complaints

### Teacher  
- ✅ Can submit complaints
- ✅ Can complain against: Student, Admin
- ❌ Cannot complain against other teachers
- ✅ Can view only their own complaints

### Admin
- ✅ Can view ALL complaints
- ✅ Can filter by: Student/Teacher, Status, Category
- ✅ Can update status: Pending → In Review → Resolved/Rejected
- ✅ Can add remarks/responses
- ✅ Can delete complaints

---

## Complaint Schema Fields

```javascript
{
  title: String,              // Required, max 200 chars
  description: String,        // Required, max 5000 chars
  sender: {
    userId: ObjectId,
    role: 'student' | 'teacher' | 'admin',
    name: String,
    email: String
  },
  recipient: {
    userId: ObjectId,
    role: 'student' | 'teacher' | 'admin',
    name: String,
    email: String
  },
  category: String,           // academic, payment, harassment, etc.
  priority: String,           // low, medium, high, urgent
  status: String,             // pending, in_review, resolved, rejected, escalated
  adminResponse: {
    message: String,
    respondedBy: ObjectId,
    respondedAt: Date
  },
  attachments: [{
    filename: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  isEscalated: Boolean,
  statusHistory: [{
    status: String,
    changedBy: { userId, role, name },
    changedAt: Date,
    note: String
  }],
  isDeleted: Boolean,
  timestamps: true
}
```

---

## Example API Responses

### GET /api/complaints/my
```json
{
  "success": true,
  "complaints": [
    {
      "_id": "...",
      "title": "Course content not loading",
      "description": "Video lectures are not playing...",
      "sender": { "name": "John Doe", "role": "student" },
      "recipient": { "name": "Prof. Smith", "role": "teacher" },
      "category": "technical",
      "priority": "high",
      "status": "in_review",
      "adminResponse": {
        "message": "Technical team has been notified",
        "respondedAt": "2024-01-15T10:30:00Z"
      },
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### GET /api/complaints/admin/all
```json
{
  "success": true,
  "complaints": [...],
  "stats": {
    "total": 25,
    "pending": 8,
    "inReview": 5,
    "resolved": 10,
    "escalated": 2
  },
  "pagination": {...}
}
```

### POST /api/complaints
```json
{
  "title": "Harassment by fellow student",
  "description": "I am experiencing harassment...",
  "recipientId": "admin_id",
  "recipientRole": "admin",
  "category": "harassment",
  "priority": "urgent"
}
// Response: 201 Created with complaint object
```

---

## Status Flow

```
Pending → In Review → Resolved
               ↓
           Rejected
               ↓
           Escalated (if needed)
```

---

## Frontend Integration

### Student Dashboard
Add to StudentRoutes:
```javascript
import StudentComplaints from '../Pages/Student/Dashboard/Complaints/StudentComplaints.jsx';

// Route: /dashboard/complaints
```

### Teacher Dashboard
Add to TeacherRoutes:
```javascript
import TeacherComplaints from '../Pages/teacher/Dashboard/Complaints/TeacherComplaints.jsx';

// Route: /dashboard/complaints
```

### Admin Dashboard
Add to DashboardRoutes:
```javascript
import ComplaintManagement from '../Dashboard/DashboardComplaints/ComplaintManagement.jsx';

// Route: /dashboard/complaints
```

Add sidebar navigation item:
```javascript
{
  path: "/dashboard/complaints",
  icon: MessageSquare,
  label: "Complaints"
}
```

---

## Environment Variables

Ensure these are set:
```
VITE_BACKEND_URL=http://localhost:5000
```

---

## Security Features

1. **JWT Authentication**: All routes require valid JWT token
2. **Role Validation**: Backend validates sender-recipient combinations
3. **Access Control**: Users can only see their own complaints
4. **Soft Delete**: Complaints are marked as deleted, not removed
5. **Status History**: Complete audit trail of status changes

---

## Testing Checklist

- [ ] Student can submit complaint to teacher
- [ ] Student can submit complaint to admin
- [ ] Student cannot submit complaint to other student
- [ ] Teacher can submit complaint to student
- [ ] Teacher can submit complaint to admin
- [ ] Teacher cannot submit complaint to other teacher
- [ ] Admin can view all complaints
- [ ] Admin can filter by status/category/role
- [ ] Admin can update status
- [ ] Admin can add remarks
- [ ] Admin can delete complaints
- [ ] Users see only their own complaints
- [ ] Pagination works correctly
- [ ] Search/filter functionality works

---

## Error Handling

Common error responses:
```json
{
  "success": false,
  "message": "Invalid recipient. Students cannot complain against other students"
}
```

```json
{
  "success": false,
  "message": "You don't have permission to view this complaint"
}
```

---

## Next Steps

1. Add file upload functionality for attachments
2. Add email notifications when complaint status changes
3. Add real-time updates using Socket.io
4. Add complaint categories configuration
5. Add SLA (Service Level Agreement) tracking
