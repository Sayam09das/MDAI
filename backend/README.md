# MDAI Backend - API Server

RESTful API server for the MDAI e-learning platform built with Node.js, Express, and MongoDB.

## 🚀 Overview

The backend provides:
- **Authentication & Authorization**: JWT-based secure access
- **User Management**: Students, teachers, and admin accounts
- **Course Management**: CRUD operations for courses and lessons
- **File Handling**: Cloudinary integration for media uploads
- **Payment Processing**: Stripe and Razorpay integration
- **Email Services**: Automated notifications and verification
- **Real-time Features**: Socket.io for live updates

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Media storage and management
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **Socket.io** - Real-time communication
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── config/
│   └── cloudinary.js         # Cloudinary configuration
├── controllers/
│   ├── admin.controller.js    # Admin operations
│   ├── auth.controller.js     # Authentication logic
│   ├── course.controller.js   # Course management
│   ├── enrollment.controller.js # Enrollment handling
│   ├── lesson.controller.js   # Lesson operations
│   ├── resource.controller.js # Resource management
│   └── teacherAuth.controller.js # Teacher authentication
├── database/
│   └── db.js                 # Database connection
├── middlewares/
│   ├── auth.middleware.js    # Authentication middleware
│   ├── checkPayment.js       # Payment verification
│   └── multer.js             # File upload middleware
├── models/
│   ├── adminModel.js         # Admin schema
│   ├── Course.js             # Course schema
│   ├── enrollmentModel.js    # Enrollment schema
│   ├── lessonModel.js        # Lesson schema
│   ├── ResourceModel.js      # Resource schema
│   ├── teacherModel.js       # Teacher schema
│   └── userModel.js          # User schema
├── routes/
│   ├── admin.routes.js       # Admin routes
│   ├── auth.routes.js        # Authentication routes
│   ├── course.routes.js      # Course routes
│   ├── enrollment.routes.js  # Enrollment routes
│   ├── lesson.routes.js      # Lesson routes
│   ├── resource.routes.js    # Resource routes
│   └── teacher.routes.js     # Teacher routes
├── utils/
│   └── generateToken.js      # JWT token utilities
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
└── package.json              # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Email service (Gmail/SendGrid)
- Payment gateway accounts

### Installation

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=3000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRATION=15m

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional Services
SENDGRID_API_KEY=your_sendgrid_key
RESEND_API_KEY=your_resend_key

# EmailJS (Optional)
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

The server will be available at `http://localhost:3000`

## 📊 Database Models

### User Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  address: String (required),
  isVerified: Boolean (default: false),
  timestamps: true
}
```

### Teacher Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  phone: String (required),
  address: String (required),
  gender: String (enum: male/female/other),
  password: String (required, hashed),
  isVerified: Boolean (default: false),
  class10Certificate: String (required),
  class12Certificate: String (required),
  collegeCertificate: String (required),
  phdOrOtherCertificate: String (optional),
  profileImage: String,
  timestamps: true
}
```

### Course Model
```javascript
{
  title: String (required),
  description: String (required),
  price: Number (required, min: 0),
  category: String (default: "Development"),
  thumbnail: {
    public_id: String (required),
    url: String (required)
  },
  duration: String (required),
  level: String (enum: Beginner/Intermediate/Advanced),
  language: String (default: "English"),
  requirements: [String],
  learningOutcomes: [String],
  instructor: ObjectId (ref: User, required),
  isPublished: Boolean (default: false),
  timestamps: true
}
```

### Enrollment Model
```javascript
{
  student: ObjectId (ref: User, required),
  course: ObjectId (ref: Course, required),
  enrollmentDate: Date (default: now),
  paymentStatus: String (enum: pending/completed/failed),
  progress: Number (default: 0),
  completionDate: Date,
  timestamps: true
}
```

## 🛣️ API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register           # User registration
POST   /login              # User login
POST   /logout             # User logout
POST   /verify-email       # Email verification
POST   /forgot-password    # Password reset request
POST   /reset-password     # Password reset
GET    /profile            # Get user profile
PUT    /profile            # Update user profile
```

### Teacher Routes (`/api/teacher`)
```
POST   /register           # Teacher registration
POST   /login              # Teacher login
GET    /profile            # Get teacher profile
PUT    /profile            # Update teacher profile
POST   /upload-certificates # Upload certificates
GET    /dashboard          # Teacher dashboard data
```

### Course Routes (`/api/courses`)
```
GET    /                   # Get all courses
GET    /:id                # Get course by ID
POST   /                   # Create new course (Teacher only)
PUT    /:id                # Update course (Teacher only)
DELETE /:id                # Delete course (Teacher only)
POST   /:id/upload-thumbnail # Upload course thumbnail
GET    /teacher/:teacherId  # Get courses by teacher
```

### Enrollment Routes (`/api/enroll`)
```
POST   /                   # Enroll in course
GET    /student/:studentId # Get student enrollments
GET    /course/:courseId   # Get course enrollments
PUT    /:id/progress       # Update progress
POST   /:id/complete       # Mark course complete
```

### Lesson Routes (`/api/lessons`)
```
GET    /course/:courseId   # Get course lessons
POST   /                  # Create lesson (Teacher only)
PUT    /:id               # Update lesson (Teacher only)
DELETE /:id               # Delete lesson (Teacher only)
POST   /:id/upload-video  # Upload lesson video
```

### Resource Routes (`/api/resource`)
```
GET    /course/:courseId   # Get course resources
POST   /                  # Upload resource (Teacher only)
DELETE /:id               # Delete resource (Teacher only)
GET    /:id/download       # Download resource
```

### Admin Routes (`/api/admin`)
```
POST   /login              # Admin login
GET    /dashboard          # Admin dashboard data
GET    /users              # Get all users
GET    /teachers           # Get all teachers
GET    /courses            # Get all courses
PUT    /user/:id/verify    # Verify user
PUT    /teacher/:id/verify # Verify teacher
PUT    /course/:id/publish # Publish course
DELETE /user/:id           # Delete user
DELETE /teacher/:id        # Delete teacher
DELETE /course/:id         # Delete course
```

## 🔒 Authentication & Security

### JWT Implementation
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- **Token Storage**: HTTP-only cookies
- **Token Validation**: Middleware protection

### Security Features
- **Password Hashing**: Bcrypt with salt rounds
- **CORS Protection**: Configured origins
- **Helmet**: Security headers
- **Input Validation**: Express-validator
- **Rate Limiting**: Request throttling
- **File Upload Security**: Type and size restrictions

### Middleware Stack
```javascript
// Security middleware
app.use(helmet());
app.use(cors({
  origin: ["https://mdai-self.vercel.app", "https://mdai-admin.vercel.app"],
  credentials: true
}));

// Authentication middleware
const authMiddleware = (req, res, next) => {
  // JWT token verification
};

// File upload middleware
const upload = multer({
  storage: cloudinary.storage,
  fileFilter: (req, file, cb) => {
    // File type validation
  }
});
```

## 📁 File Upload & Storage

### Cloudinary Integration
- **Image Uploads**: Course thumbnails, profile pictures
- **Video Uploads**: Lesson videos
- **Document Uploads**: Certificates, resources
- **Automatic Optimization**: Image compression and resizing

### Upload Endpoints
```javascript
POST /api/courses/:id/upload-thumbnail
POST /api/lessons/:id/upload-video
POST /api/teacher/upload-certificates
POST /api/resource/upload
```

## 📧 Email Services

### Nodemailer Configuration
- **Welcome Emails**: User registration
- **Verification Emails**: Email confirmation
- **Password Reset**: Secure reset links
- **Course Notifications**: Enrollment confirmations
- **Payment Receipts**: Transaction confirmations

### Email Templates
- HTML templates for professional appearance
- Dynamic content injection
- Mobile-responsive design

## 💳 Payment Integration

### Supported Gateways
- **Stripe**: International payments
- **Razorpay**: Indian market focus
- **UPI**: Direct bank transfers

### Payment Flow
1. Course selection and checkout
2. Payment gateway integration
3. Payment verification
4. Enrollment confirmation
5. Receipt generation

## 🔄 Real-time Features

### Socket.io Implementation
- **Live Notifications**: Real-time updates
- **Chat System**: Student-teacher communication
- **Live Classes**: Video streaming support
- **Progress Updates**: Real-time progress tracking

## 📊 Logging & Monitoring

### Winston Logger
- **Error Logging**: Comprehensive error tracking
- **Access Logs**: Request/response logging
- **Performance Monitoring**: Response time tracking
- **File Rotation**: Automated log management

## 🚀 Deployment

### Production Environment
- **Platform**: Render
- **URL**: https://mdai-0jhi.onrender.com
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Email Service**: Gmail SMTP

### Environment Variables
```bash
# Production settings
NODE_ENV=production
PORT=3000

# Database
MONGO_URI=mongodb+srv://...

# Security
JWT_SECRET=production_secret
CORS_ORIGIN=https://mdai-self.vercel.app,https://mdai-admin.vercel.app
```

## 🧪 Testing

### API Testing
```bash
# Health check
GET /ping

# Authentication test
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Error Handling
- **Global Error Handler**: Centralized error processing
- **Custom Error Classes**: Structured error responses
- **Validation Errors**: Input validation feedback
- **Database Errors**: MongoDB error handling

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start with nodemon

# Production
npm start            # Start production server

# Database
npm run seed         # Seed database (if available)
npm run migrate      # Run migrations (if available)
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
```bash
# Check MongoDB connection
mongoose.connection.readyState
# 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
```

2. **CORS Errors**
```javascript
// Ensure frontend URL is in CORS origins
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend.com"]
}));
```

3. **File Upload Issues**
```bash
# Check Cloudinary configuration
console.log(process.env.CLOUDINARY_CLOUD_NAME);
```

## 📞 Support

- **API Documentation**: Available at `/api/docs` (if implemented)
- **Technical Support**: support@mdai.com
- **Server Status**: https://mdai-0jhi.onrender.com/ping

## 🤝 Contributing

1. Follow RESTful API conventions
2. Implement proper error handling
3. Add input validation
4. Write comprehensive tests
5. Document new endpoints

---

**Built with ❤️ using Node.js and modern backend technologies**