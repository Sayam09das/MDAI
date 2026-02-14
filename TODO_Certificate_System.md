# Certificate Generation System - Implementation Plan

## Information Gathered:
- **Backend**: Express.js with MongoDB (Mongoose)
- **Frontend**: React with React Router, Tailwind CSS, styled-components
- **Current Progress System**: Uses enrollmentModel for tracking progress, submissions for assignments, examAttemptModel for exams
- **Course Model**: Currently doesn't have certificate settings
- **No existing certificate system** - building from scratch
- **Cloud Storage**: Uses Cloudinary (has canvas, pdfkit available)

## Implementation Plan:

### Phase 1: Backend - Data Models & Routes
1. **Create CertificateSettings Model** - Admin-controlled template configuration
2. **Create Certificate Model** - Store issued certificates
3. **Update Course Model** - Add certificate completion criteria fields
4. **Create Certificate Controller** - Handle certificate operations
5. **Create Certificate Routes** - API endpoints

### Phase 2: Backend - Auto-generation Logic
1. **Create certificate generation utility** - Using PDFKit
2. **Implement completion check logic** - Progress, assignments, exams
3. **Add hooks in progress controller** - Auto-generate on completion

### Phase 3: Admin Panel - UI
1. **Create CertificateTemplateSettings component** - Upload template, configure placeholders
2. **Add route to DashboardRoutes**
3. **Add sidebar navigation**

### Phase 4: Student Dashboard - UI
1. **Create MyCertificates component** - View eligible/issued certificates
2. **Add to student routes**
3. **Add to student sidebar**

### Phase 5: Teacher Dashboard - UI
1. **Create CourseCertificates component** - View students who earned certificates
2. **Add to teacher routes**

## Files to Create:
- `backend/models/certificateSettingsModel.js` - Template configuration
- `backend/models/certificateModel.js` - Issued certificates
- `backend/controllers/certificate.controller.js` - Business logic
- `backend/routes/certificate.routes.js` - API routes
- `backend/utils/generateCertificate.js` - PDF generation
- `admin/src/Dashboard/DashboardCertificates/` - Admin UI
- `client/src/Pages/Student/Dashboard/MyCertificates/` - Student UI
- `client/src/Pages/teacher/Dashboard/CourseCertificates/` - Teacher UI

## Files to Modify:
- `backend/models/Course.js` - Add completion criteria
- `backend/app.js` - Add certificate routes
- `admin/src/routes/DashboardRoutes.jsx` - Add routes
- `admin/src/components/Main/` - Add sidebar link
- `client/src/routes/StudentRoutes.jsx` - Add routes
- `client/src/components/Dashboard/Student/StudentSidebar.jsx` - Add link
- `client/src/routes/TeacherRoutes.jsx` - Add routes
- `client/src/components/Dashboard/Teacher/TeacherSidebar.jsx` - Add link

