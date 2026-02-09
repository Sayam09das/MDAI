# MDAI Admin Dashboard

**Enterprise Administrative Control Panel**

[![Production](https://img.shields.io/badge/Production-Live-brightgreen)](https://mdai-admin.vercel.app)
[![React](https://img.shields.io/badge/React-19.x-blue)](https://reactjs.org/)
[![Security](https://img.shields.io/badge/Security-A+-brightgreen)](https://securityheaders.com/)

---

## Overview

Enterprise-grade administrative control panel for comprehensive management of the MDAI Learning Management System. Provides real-time monitoring, user management, content oversight, and business intelligence.

### Key Capabilities

- Complete user lifecycle management
- Course approval and moderation
- Financial reporting and analytics
- Complaint resolution system
- Audit logging and compliance
- System health monitoring
- Real-time notifications
- Bulk operations

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool |
| TailwindCSS | 4.1.18 | Styling |
| React Router | 7.12.0 | Routing |
| Axios | 1.13.2 | HTTP Client |
| Socket.io Client | 4.8.1 | Real-time Updates |
| Recharts | 2.15.4 | Data Visualization |
| Framer Motion | 12.29.0 | Animations |
| React Toastify | 11.0.5 | Notifications |

---

## Project Structure

```
admin/
├── src/
│   ├── Auth/                    # Admin authentication
│   │   └── Login/
│   ├── components/              # Reusable components
│   │   └── Main/
│   ├── context/                 # Context providers
│   │   └── AdminSocketContext.jsx
│   ├── Dashboard/               # Dashboard modules
│   │   ├── DashboardMain/       # Overview
│   │   ├── DashboardUser/       # User management
│   │   ├── DashboardStudent/    # Student management
│   │   ├── DashboardTeacher/    # Teacher management
│   │   ├── DashboardCourses/    # Course oversight
│   │   ├── DashboardFinance/    # Financial reports
│   │   ├── DashboardComplaints/ # Complaint system
│   │   ├── DashboardAnnouncements/ # Announcements
│   │   ├── DashboardReports/    # Analytics
│   │   ├── DashboardSettings/   # Settings
│   │   ├── DashboardSystem/     # System monitoring
│   │   ├── DashboardAuditLogs/  # Audit logs
│   │   └── StudentEnrollment/   # Enrollment management
│   ├── pages/                   # Page layouts
│   │   └── DashboardLayout.jsx
│   ├── routes/                  # Route definitions
│   │   ├── AuthRoutes.jsx
│   │   ├── DashboardRoutes.jsx
│   │   ├── MainRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── utils/                   # Utilities
│   │   └── auth.js
│   └── lib/                     # API clients
├── public/                      # Static assets
└── package.json
```

---

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Admin credentials

### Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

---

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_ADMIN_SESSION_TIMEOUT=3600000
VITE_ENABLE_AUDIT_LOGS=true
VITE_ENABLE_REAL_TIME=true
```

---

## Available Scripts

```bash
npm run dev          # Start development server (port 5174)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Features

### Dashboard Overview

- Key performance indicators (KPIs)
- Real-time user activity
- Revenue metrics
- System health status
- Quick action shortcuts
- Alert notifications

### User Management

#### Student Management
- View all students
- Student profiles and history
- Enrollment tracking
- Payment history
- Suspend/resume accounts
- Export student data
- Bulk operations

#### Teacher Management
- View all teachers
- Teacher profiles and credentials
- Course portfolio
- Revenue tracking
- Performance metrics
- Verification status
- Suspend/resume accounts

### Course Management

- Course approval workflow
- Content moderation
- Category management
- Pricing control
- Quality assurance
- Performance monitoring
- Bulk course operations

### Financial Management

- Revenue dashboard
- Transaction history
- Payment analytics
- Refund management
- Teacher payouts
- Financial reports
- Export capabilities

### Complaint System

- View all complaints
- Complaint categorization
- Priority management
- Response tracking
- Resolution workflow
- Analytics and trends

### System Monitoring

- API health status
- Database performance
- Error tracking
- User activity logs
- System resource usage
- Alert management

### Audit Logs

- Complete action tracking
- User activity history
- Security events
- Compliance reporting
- Export audit data

### Announcements

- Create announcements
- Target specific user groups
- Schedule announcements
- Track engagement
- Archive management

---

## Security

### Authentication

- Admin-only access
- JWT-based authentication
- Session management
- Multi-factor authentication (optional)
- Secure password policies

### Authorization

- Role-based access control
- Granular permissions
- Action-level authorization
- Resource ownership validation

### Audit Trail

- All admin actions logged
- Timestamp and user tracking
- IP address recording
- Change history
- Compliance reporting

---

## API Integration

```javascript
// lib/adminApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAdminStats = async () => {
  const response = await axios.get(`${API_URL}/admin/stats`);
  return response.data;
};

export const suspendUser = async (userId, reason) => {
  const response = await axios.put(`${API_URL}/admin/users/${userId}/suspend`, {
    reason
  });
  return response.data;
};

export const getAuditLogs = async (filters) => {
  const response = await axios.get(`${API_URL}/admin/audit-logs`, {
    params: filters
  });
  return response.data;
};
```

---

## Real-time Features

### Socket.io Integration

```javascript
// context/AdminSocketContext.jsx
import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const AdminSocketContext = createContext();

export const AdminSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: localStorage.getItem('adminToken') }
    });

    newSocket.on('newUser', (data) => {
      // Handle new user registration
    });

    newSocket.on('newEnrollment', (data) => {
      // Handle new enrollment
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <AdminSocketContext.Provider value={{ socket }}>
      {children}
    </AdminSocketContext.Provider>
  );
};
```

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Performance

- Bundle size: ~180KB (gzipped)
- Load time: <1s
- Real-time updates: <100ms latency
- Dashboard refresh: Every 30s
- Optimized for large datasets

---

## Admin Workflows

### User Suspension Workflow

1. Navigate to User Management
2. Select user to suspend
3. Provide suspension reason
4. Confirm action
5. System logs action in audit trail
6. User receives notification
7. Access immediately revoked

### Course Approval Workflow

1. Review pending courses
2. Check content quality
3. Verify instructor credentials
4. Approve or reject with feedback
5. Notify instructor
6. Publish approved courses

### Complaint Resolution Workflow

1. Review new complaints
2. Assign priority level
3. Investigate issue
4. Communicate with parties
5. Resolve and document
6. Close complaint
7. Track resolution metrics

---

## Monitoring & Analytics

### Dashboard Metrics

- Total users (students, teachers, admins)
- Active users (daily, weekly, monthly)
- Total courses (published, draft, pending)
- Revenue (today, this month, total)
- Enrollments (new, active, completed)
- System health (API, database, services)

### Reports

- User growth reports
- Revenue reports
- Course performance reports
- Teacher performance reports
- System usage reports
- Compliance reports

---

## Contributing

1. Create feature branch: `git checkout -b feature/admin-feature`
2. Make changes and test
3. Commit: `git commit -m "feat(admin): description"`
4. Push: `git push origin feature/admin-feature`
5. Create Pull Request

### Admin-Specific Guidelines

- All admin actions must be logged
- Implement proper permission checks
- Handle sensitive data securely
- Optimize for large datasets
- Maintain audit trail integrity

---

## License

Copyright (c) 2026 MDAI. All rights reserved.

---

**Live Dashboard**: [https://mdai-admin.vercel.app](https://mdai-admin.vercel.app)
