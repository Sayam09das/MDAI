# MDAI Client - Student & Teacher Portal

The main frontend application for MDAI platform, serving both students and teachers with comprehensive learning management features.

## 🚀 Overview

The client application provides:
- **Student Portal**: Course discovery, enrollment, learning, and progress tracking
- **Teacher Dashboard**: Course creation, student management, and analytics
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Features**: Live updates and notifications

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and development server
- **TailwindCSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Chart.js & Recharts** - Data visualization
- **React Calendar** - Calendar components
- **Lucide React** - Icon library
- **React Toastify** - Toast notifications

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── Admin/             # Admin-related components
│   ├── Auth/              # Authentication pages
│   ├── components/        # Reusable components
│   │   ├── common/        # Common UI components
│   │   ├── Dashboard/     # Dashboard components
│   │   ├── lib/           # Utility libraries
│   │   └── ui/            # UI components
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Layout components
│   ├── Main/              # Main pages
│   │   ├── AboutPage/     # About page components
│   │   ├── ContactPage/   # Contact page components
│   │   ├── CoursePage/    # Course detail components
│   │   └── Mainpages/     # Homepage components
│   ├── Pages/             # Page components
│   │   ├── Student/       # Student dashboard pages
│   │   └── teacher/       # Teacher dashboard pages
│   ├── ProtectedRoute/    # Route protection
│   ├── routes/            # Route definitions
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── data/                  # Static data files
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the client directory:
```env
# Backend API
VITE_BACKEND_URL=https://mdai-0jhi.onrender.com

# Assets
VITE_LOGO_URL=https://res.cloudinary.com/dp4ohisdc/image/upload/v1766995359/logo_odzmqw.jpg
VITE_MdaiVideo_URL=https://player.cloudinary.com/embed/?cloud_name=dp4ohisdc&public_id=mdai_ajbqxb&profile=cld-default
VITE_MDAIVIDEO_THUMB_URL=https://res.cloudinary.com/dp4ohisdc/image/upload/v1766997717/Screenshot_from_2025-12-29_14-09-03_pporpr.png

# Contact Information
VITE_PROFESSOR_WHATSAPP=9635825787
VITE_PROFESSOR_LINKEDIN=https://www.linkedin.com/in/symphorien-pyana/
VITE_WHATSAPP_NUMBER=+919836292481
VITE_SUPPORT_EMAIL=support@mdai.com
VITE_TEACHER_FORM_URL=https://forms.gle/2XvQKhRBLJ4ymBWh8

# Payment
VITE_PAYMENT_UPI=+243 812 336 721
VITE_SUPPORT_EMAIL=Symphorienpyana065@gmail.com
VITE_SUPPORT_WHATSAPP=+91 98362 92481
VITE_PAYMENT_FORM=https://forms.gle/YOUR_GOOGLE_FORM_LINK
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Features

### Student Features
- **Authentication**: Secure login/registration
- **Course Catalog**: Browse and search courses
- **Course Enrollment**: Secure payment processing
- **Learning Dashboard**: Track progress and performance
- **My Courses**: Access enrolled courses
- **Live Classes**: Join scheduled sessions
- **Resources**: Download course materials
- **Payments**: View payment history
- **Profile Management**: Update personal information

### Teacher Features
- **Teacher Dashboard**: Comprehensive analytics
- **Course Creation**: Build and publish courses
- **Student Management**: Track enrolled students
- **Live Sessions**: Schedule and conduct classes
- **Resources**: Upload and manage materials
- **Analytics**: Performance metrics and insights
- **Calendar**: Manage schedule and appointments
- **Finance**: Track earnings and payments

### Common Features
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live notifications
- **Modern UI**: Clean and intuitive interface
- **Performance**: Optimized for speed
- **Accessibility**: WCAG compliant

## 🎨 UI Components

### Layout Components
- **MainLayout**: Main application layout
- **StudentLayout**: Student dashboard layout
- **TeacherLayout**: Teacher dashboard layout
- **Navbar**: Navigation component
- **Footer**: Footer component
- **Sidebar**: Dashboard sidebar

### Dashboard Components
- **StudentNavbar**: Student navigation
- **TeacherNavbar**: Teacher navigation
- **StudentSidebar**: Student sidebar menu
- **TeacherSidebar**: Teacher sidebar menu

### Page Components
- **Homepage**: Landing page with hero section
- **About Page**: Company information
- **Contact Page**: Contact form and information
- **Course Pages**: Course details and enrollment
- **Authentication**: Login and registration

## 🔒 Authentication & Routing

### Route Protection
- **PublicRoute**: Accessible to all users
- **ProtectedRoute**: Requires authentication
- **StudentProtectedRoute**: Student-only access
- **TeacherProtectedRoute**: Teacher-only access

### Route Structure
```
/                    # Homepage
/about              # About page
/contact            # Contact page
/courses            # Course catalog
/course/:id         # Course details
/auth/login         # Login page
/auth/register      # Registration page
/student/*          # Student dashboard routes
/teacher/*          # Teacher dashboard routes
/admin/*            # Admin routes
```

## 📊 Analytics & Charts

### Chart Libraries
- **Chart.js**: Interactive charts
- **Recharts**: React chart components
- **React Calendar**: Calendar components

### Analytics Features
- Student performance tracking
- Course progress visualization
- Teacher analytics dashboard
- Financial reporting charts

## 🎭 Animations

### Framer Motion Features
- Page transitions
- Component animations
- Hover effects
- Loading animations
- Scroll-triggered animations

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### TailwindCSS Configuration
- Custom color palette
- Typography scale
- Spacing system
- Component utilities

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
The application is deployed on **Vercel**:
- **Production URL**: https://mdai-self.vercel.app
- **Auto-deployment**: Connected to Git repository
- **Environment Variables**: Configured in Vercel dashboard

## 🔧 Configuration Files

### Vite Configuration
```javascript
// vite.config.js
export default {
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}
```

### ESLint Configuration
```javascript
// eslint.config.js
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...reactHooks.configs.recommended,
  ...reactRefresh.configs.recommended
]
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
```bash
# Kill process on port 5173
npx kill-port 5173
```

2. **Environment variables not loading**
- Ensure `.env` file is in root directory
- Restart development server
- Check variable names start with `VITE_`

3. **Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

- **Technical Support**: support@mdai.com
- **WhatsApp**: +91 98362 92481
- **Documentation**: Check individual component files

## 🤝 Contributing

1. Follow React best practices
2. Use TypeScript for new components
3. Maintain responsive design
4. Add proper error handling
5. Write meaningful commit messages

---

**Built with ❤️ using React and modern web technologies**