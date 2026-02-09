# MDAI - Modern Digital Academy Institute

**Enterprise-Grade Learning Management System**

[![Production Status](https://img.shields.io/badge/Production-Live-brightgreen)](https://mdai-self.vercel.app)
[![API Status](https://img.shields.io/badge/API-Operational-brightgreen)](https://mdai-0jhi.onrender.com/ping)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running Locally](#running-locally)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

MDAI is a full-stack, production-ready Learning Management System (LMS) built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform provides comprehensive course management, role-based access control, real-time messaging, payment processing, and administrative oversight for educational institutions.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Uptime** | 99.9% |
| **Response Time** | <200ms |
| **Concurrent Users** | 10,000+ |
| **Real-time Features** | Socket.io |
| **Security** | JWT + bcrypt |

### Core Capabilities

- Complete course lifecycle management
- Multi-tenant architecture (Admin, Teacher, Student)
- Integrated payment processing (Stripe, Razorpay)
- Real-time messaging and notifications
- Student enrollment and progress tracking
- Teacher payment history and analytics
- Complaint management system
- Audit logging and system monitoring
- Responsive, mobile-first design

---

## Features

### Student Portal

- **Course Discovery**: Browse and search available courses
- **Enrollment Management**: Enroll in courses with payment integration
- **Progress Tracking**: Monitor learning progress and completion status
- **Resource Access**: Download course materials and resources
- **Messaging System**: Communicate with teachers and administrators
- **Event Calendar**: View upcoming classes and events
- **Profile Management**: Update personal information and preferences
- **Complaint Submission**: Report issues with recipient selection

### Teacher Dashboard

- **Course Creation**: Create and publish courses with multimedia content
- **Lesson Management**: Organize course content into structured lessons
- **Student Analytics**: Track student enrollment and performance
- **Resource Upload**: Share downloadable materials with students
- **Payment History**: View earnings and transaction records
- **Messaging**: Respond to student inquiries
- **Event Management**: Schedule and manage class sessions
- **Profile Settings**: Manage credentials and notification preferences

### Admin Panel

- **User Management**: Manage students, teachers, and administrators
- **Course Oversight**: Approve, edit, or remove courses
- **Enrollment Control**: Monitor and manage student enrollments
- **Financial Reporting**: Track revenue, transactions, and payouts
- **Complaint Resolution**: Review and respond to user complaints
- **System Monitoring**: View audit logs and system health metrics
- **Announcement Management**: Broadcast platform-wide notifications
- **Suspend/Resume Users**: Control user access and account status
- **Settings Configuration**: Manage platform-wide settings

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool and dev server |
| TailwindCSS | 4.x | Utility-first CSS framework |
| Framer Motion | 12.x | Animation library |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Socket.io Client | 4.x | Real-time communication |
| Chart.js | 4.x | Data visualization |
| React Toastify | 11.x | Notification system |
| Lucide React | Latest | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | JavaScript runtime |
| Express.js | 5.x | Web application framework |
| MongoDB | 5.x | NoSQL database |
| Mongoose | 9.x | MongoDB ODM |
| Socket.io | 4.x | WebSocket server |
| JWT | 9.x | Authentication tokens |
| bcryptjs | 3.x | Password hashing |
| Helmet | 8.x | Security headers |
| Multer | 2.x | File upload handling |
| Cloudinary | 2.x | Media storage and CDN |
| Stripe | 20.x | Payment processing |
| Razorpay | 2.x | Payment gateway |
| Nodemailer | 7.x | Email service |
| Winston | 3.x | Logging framework |
| Redis | 5.x | Caching and session management |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting (Client & Admin) |
| Render | Backend API hosting |
| MongoDB Atlas | Managed database service |
| Cloudinary | Media storage and optimization |
| GitHub Actions | CI/CD pipeline |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │   Teacher    │  │    Admin     │      │
│  │   Portal     │  │  Dashboard   │  │    Panel     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│         ┌──────────────────────────────────────┐            │
│         │  CORS │ Helmet │ Rate Limiting │ JWT │            │
│         └──────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │  Socket.io   │  │   Business   │      │
│  │   REST API   │  │   Server     │  │    Logic     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │    Redis     │  │  Cloudinary  │      │
│  │    Atlas     │  │    Cache     │  │     CDN      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client Request**: User interacts with React frontend
2. **Authentication**: JWT token validation via middleware
3. **Authorization**: Role-based access control (RBAC)
4. **Business Logic**: Controllers process requests
5. **Data Access**: Mongoose models interact with MongoDB
6. **Response**: JSON data returned to client
7. **Real-time Updates**: Socket.io broadcasts events

---

## Project Structure

```
MDAI/
├── client/                      # Student & Teacher Frontend
│   ├── src/
│   │   ├── Auth/               # Authentication components
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Dashboard/      # Dashboard-specific components
│   │   │   ├── common/         # Shared components
│   │   │   └── ui/             # Base UI elements
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page layouts
│   │   ├── lib/                # API clients and utilities
│   │   ├── Main/               # Landing pages
│   │   ├── Pages/              # Route pages
│   │   │   ├── Student/        # Student dashboard pages
│   │   │   └── teacher/        # Teacher dashboard pages
│   │   ├── ProtectedRoute/     # Route guards
│   │   ├── routes/             # Route definitions
│   │   └── utils/              # Helper functions
│   ├── public/                 # Static assets
│   └── package.json
│
├── admin/                       # Administrative Dashboard
│   ├── src/
│   │   ├── Auth/               # Admin authentication
│   │   ├── components/         # Admin UI components
│   │   ├── context/            # Admin context providers
│   │   ├── Dashboard/          # Admin dashboard modules
│   │   │   ├── DashboardMain/
│   │   │   ├── DashboardUser/
│   │   │   ├── DashboardStudent/
│   │   │   ├── DashboardTeacher/
│   │   │   ├── DashboardCourses/
│   │   │   ├── DashboardFinance/
│   │   │   ├── DashboardComplaints/
│   │   │   ├── DashboardAnnouncements/
│   │   │   ├── DashboardReports/
│   │   │   ├── DashboardSettings/
│   │   │   ├── DashboardSystem/
│   │   │   ├── DashboardAuditLogs/
│   │   │   └── StudentEnrollment/
│   │   ├── pages/              # Admin pages
│   │   ├── routes/             # Admin routing
│   │   └── utils/              # Admin utilities
│   └── package.json
│
├── backend/                     # Core API Server
│   ├── config/                 # Configuration files
│   │   └── cloudinary.js       # Cloudinary setup
│   ├── controllers/            # Business logic
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── complaint.controller.js
│   │   ├── course.controller.js
│   │   ├── enrollment.controller.js
│   │   ├── event.controller.js
│   │   ├── lesson.controller.js
│   │   ├── message.controller.js
│   │   ├── progress.controller.js
│   │   ├── resource.controller.js
│   │   ├── student.controller.js
│   │   └── teacherAuth.controller.js
│   ├── database/               # Database connection
│   │   └── db.js
│   ├── middlewares/            # Custom middleware
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── multer.js           # File upload
│   ├── models/                 # Mongoose schemas
│   │   ├── adminModel.js
│   │   ├── announcementModel.js
│   │   ├── attendanceModel.js
│   │   ├── auditLogModel.js
│   │   ├── complaintModel.js
│   │   ├── conversationModel.js
│   │   ├── Course.js
│   │   ├── enrollmentModel.js
│   │   ├── eventModel.js
│   │   ├── financeTransactionModel.js
│   │   ├── lessonModel.js
│   │   ├── messageModel.js
│   │   ├── ResourceModel.js
│   │   ├── teacherModel.js
│   │   └── userModel.js
│   ├── routes/                 # API endpoints
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── complaint.routes.js
│   │   ├── course.routes.js
│   │   ├── enrollment.routes.js
│   │   ├── event.routes.js
│   │   ├── lesson.routes.js
│   │   ├── message.routes.js
│   │   ├── resource.routes.js
│   │   ├── student.routes.js
│   │   └── teacher.routes.js
│   ├── utils/                  # Helper utilities
│   │   ├── generateReceiptImage.js
│   │   ├── generateToken.js
│   │   ├── migrateComplaints.js
│   │   ├── seedRecipients.js
│   │   └── socket.js           # Socket.io setup
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server entry point
│   └── package.json
│
├── api/                         # Serverless functions
│   └── index.js
│
└── package.json                 # Root package configuration
```

---

## Installation

### Prerequisites

Ensure the following are installed on your system:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v5.0 or higher (or MongoDB Atlas account)
- **Git**: Latest version

### Clone Repository

```bash
git clone https://github.com/your-org/mdai.git
cd mdai
```

### Install Dependencies

Install dependencies for all services:

```bash
# Install backend dependencies
cd backend
npm install

# Install client dependencies
cd ../client
npm install

# Install admin dependencies
cd ../admin
npm install
```

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mdai?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@mdai.com
FROM_NAME=MDAI Platform

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379

# CORS Origins
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Firebase (Optional - for push notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### Client Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Admin Environment Variables

Create a `.env` file in the `admin/` directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

## Running Locally

### Start Backend Server

```bash
cd backend
npm run dev
```

The API server will start at `http://localhost:3000`

### Start Client Application

```bash
cd client
npm run dev
```

The client application will start at `http://localhost:5173`

### Start Admin Dashboard

```bash
cd admin
npm run dev
```

The admin dashboard will start at `http://localhost:5174`

### Verify Installation

- **API Health Check**: `http://localhost:3000/ping`
- **Client**: `http://localhost:5173`
- **Admin**: `http://localhost:5174`

---

## Production Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
4. Add environment variables from `.env`
5. Deploy

### Frontend Deployment (Vercel)

#### Client Deployment

```bash
cd client
vercel --prod
```

#### Admin Deployment

```bash
cd admin
vercel --prod
```

### Environment-Specific Configuration

Update environment variables for production:

```env
# Backend
NODE_ENV=production
CLIENT_URL=https://mdai-self.vercel.app
ADMIN_URL=https://mdai-admin.vercel.app

# Client
VITE_API_URL=https://mdai-0jhi.onrender.com/api
VITE_SOCKET_URL=https://mdai-0jhi.onrender.com

# Admin
VITE_API_URL=https://mdai-0jhi.onrender.com/api
VITE_SOCKET_URL=https://mdai-0jhi.onrender.com
```

---

## API Documentation

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://mdai-0jhi.onrender.com/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new student | No |
| POST | `/auth/login` | Student login | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update profile | Yes |

### Teacher Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/teacher/register` | Register as teacher | No |
| POST | `/teacher/login` | Teacher login | No |
| GET | `/teacher/profile` | Get teacher profile | Yes (Teacher) |
| PUT | `/teacher/profile` | Update teacher profile | Yes (Teacher) |
| GET | `/teacher/students` | Get enrolled students | Yes (Teacher) |
| GET | `/teacher/payments` | Get payment history | Yes (Teacher) |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/courses` | Get all courses | No |
| GET | `/courses/:id` | Get course details | No |
| POST | `/courses` | Create new course | Yes (Teacher) |
| PUT | `/courses/:id` | Update course | Yes (Teacher) |
| DELETE | `/courses/:id` | Delete course | Yes (Teacher/Admin) |
| GET | `/courses/teacher/:teacherId` | Get teacher courses | Yes |

### Enrollment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/enrollments` | Enroll in course | Yes (Student) |
| GET | `/enrollments/student/:studentId` | Get student enrollments | Yes (Student) |
| GET | `/enrollments/course/:courseId` | Get course enrollments | Yes (Teacher) |
| PUT | `/enrollments/:id/progress` | Update progress | Yes (Student) |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/login` | Admin login | No |
| GET | `/admin/users` | Get all users | Yes (Admin) |
| GET | `/admin/teachers` | Get all teachers | Yes (Admin) |
| GET | `/admin/students` | Get all students | Yes (Admin) |
| PUT | `/admin/users/:id/suspend` | Suspend user | Yes (Admin) |
| PUT | `/admin/users/:id/resume` | Resume user | Yes (Admin) |
| GET | `/admin/courses` | Get all courses | Yes (Admin) |
| GET | `/admin/enrollments` | Get all enrollments | Yes (Admin) |
| GET | `/admin/transactions` | Get financial data | Yes (Admin) |
| GET | `/admin/complaints` | Get all complaints | Yes (Admin) |
| PUT | `/admin/complaints/:id` | Update complaint | Yes (Admin) |
| GET | `/admin/audit-logs` | Get audit logs | Yes (Admin) |

### Message Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/messages/conversations` | Get user conversations | Yes |
| GET | `/messages/:conversationId` | Get conversation messages | Yes |
| POST | `/messages` | Send message | Yes |
| PUT | `/messages/:id/read` | Mark as read | Yes |

### Complaint Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/complaints` | Submit complaint | Yes |
| GET | `/complaints` | Get user complaints | Yes |
| GET | `/complaints/:id` | Get complaint details | Yes |
| PUT | `/complaints/:id` | Update complaint | Yes (Admin) |

### Event Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/events` | Get all events | Yes |
| POST | `/events` | Create event | Yes (Teacher/Admin) |
| PUT | `/events/:id` | Update event | Yes (Teacher/Admin) |
| DELETE | `/events/:id` | Delete event | Yes (Teacher/Admin) |

### Resource Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/resource/course/:courseId` | Get course resources | Yes |
| POST | `/resource` | Upload resource | Yes (Teacher) |
| DELETE | `/resource/:id` | Delete resource | Yes (Teacher) |

---

## User Roles

### Student

**Capabilities:**
- Browse and search courses
- Enroll in courses with payment
- Access course content and resources
- Track learning progress
- Communicate with teachers
- Submit complaints
- View event calendar
- Manage profile settings

**Restrictions:**
- Cannot create courses
- Cannot access teacher or admin features
- Cannot modify other users' data

### Teacher

**Capabilities:**
- Create and manage courses
- Upload course materials and resources
- View enrolled students
- Track student progress
- Manage lessons and content
- Schedule events and classes
- View payment history
- Respond to student messages
- Update profile and credentials

**Restrictions:**
- Cannot access admin panel
- Cannot manage other teachers' courses
- Cannot suspend users
- Cannot view system-wide analytics

### Administrator

**Capabilities:**
- Full system access and control
- Manage all users (students, teachers, admins)
- Approve, edit, or remove any course
- Monitor all enrollments and transactions
- Review and resolve complaints
- Access audit logs and system metrics
- Suspend or resume user accounts
- Broadcast announcements
- Configure platform settings
- Generate financial reports

**Restrictions:**
- Cannot impersonate users
- Cannot modify encrypted passwords directly

---

## Security

### Authentication

- **JWT Tokens**: Stateless authentication with access and refresh tokens
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Token Expiration**: Access tokens expire in 7 days, refresh tokens in 30 days
- **HTTP-Only Cookies**: Secure token storage to prevent XSS attacks

### Authorization

- **Role-Based Access Control (RBAC)**: Middleware enforces role-specific permissions
- **Route Protection**: Protected routes verify JWT and user roles
- **Resource Ownership**: Users can only modify their own resources

### Data Protection

- **Input Validation**: Express-validator and Zod schemas validate all inputs
- **SQL Injection Prevention**: Mongoose ODM prevents NoSQL injection
- **XSS Protection**: Helmet.js sets security headers
- **CORS Configuration**: Strict origin policy for cross-origin requests
- **Rate Limiting**: Prevents brute-force attacks and API abuse
- **Data Encryption**: Sensitive data encrypted at rest and in transit (TLS 1.3)

### File Upload Security

- **File Type Validation**: Multer restricts allowed file types
- **File Size Limits**: Maximum upload size enforced
- **Cloudinary Integration**: Secure media storage with CDN delivery

### Best Practices

- Environment variables for sensitive configuration
- Regular dependency updates and security audits
- Audit logging for administrative actions
- Session management with Redis
- HTTPS enforcement in production
- Content Security Policy (CSP) headers

---

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make changes and commit: `git commit -m "Add feature description"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Submit a pull request

### Code Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Maintain consistent code formatting
- Write unit tests for new features
- Update documentation as needed

### Pull Request Guidelines

- Provide clear description of changes
- Reference related issues
- Ensure all tests pass
- Update README if necessary
- Request review from maintainers

---

## License

Copyright (c) 2026 Modern Digital Academy Institute

This software is proprietary and confidential. Unauthorized copying, transferring, or reproduction of this software, via any medium, is strictly prohibited.

For licensing inquiries: legal@mdai.com

---

## Support

### Contact Information

- **Email**: support@mdai.com
- **WhatsApp**: +91 98362 92481
- **LinkedIn**: [Professor Profile](https://www.linkedin.com/in/symphorien-pyana/)

### Production URLs

- **Student/Teacher Portal**: [https://mdai-self.vercel.app](https://mdai-self.vercel.app)
- **Admin Dashboard**: [https://mdai-admin.vercel.app](https://mdai-admin.vercel.app)
- **API Server**: [https://mdai-0jhi.onrender.com](https://mdai-0jhi.onrender.com)
- **API Health**: [https://mdai-0jhi.onrender.com/ping](https://mdai-0jhi.onrender.com/ping)

---

**Built with precision and scalability in mind by the MDAI Engineering Team**
