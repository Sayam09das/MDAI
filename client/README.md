# 🚀 MDAI - AI-Powered Modern Learning Platform

<div align="center">
  <img src="https://res.cloudinary.com/dp4ohisdc/image/upload/v1766995359/logo_odzmqw.jpg" alt="MDAI Logo" width="200"/>
  
  [![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

## 📖 About

MDAI is a cutting-edge AI-powered modern learning platform that revolutionizes online education through expert-led courses, live interactive classes, comprehensive resources, and real-time educational experiences. Built with modern web technologies, MDAI offers a seamless and engaging learning environment for students worldwide.

## ✨ Key Features

### 🎓 **Course Management**
- **20+ Expert-Led Courses** covering Machine Learning, Web Development, Data Science, Cybersecurity, and more
- **Multi-Level Learning** (Beginner, Intermediate, Advanced)
- **Course Progress Tracking** with detailed analytics
- **Interactive Curriculum** with hands-on projects
- **Resource Materials** and downloadable content

### 🔴 **Live Learning Experience**
- **Real-time Live Classes** with expert instructors
- **Interactive Sessions** with Q&A support
- **Video Streaming** powered by Cloudinary
- **Live Class Scheduling** and notifications

### 👨‍🏫 **Expert Instructors**
- **Professional Teacher Profiles** with detailed backgrounds
- **Direct Communication** via WhatsApp and LinkedIn
- **Personalized Learning** guidance and mentorship
- **Industry Expert** instruction and insights

### 🎨 **Modern UI/UX**
- **Responsive Design** optimized for all devices
- **Beautiful Animations** with Framer Motion
- **Interactive Components** with smooth transitions
- **Professional Layout** with modern aesthetics
- **Accessibility Compliant** design patterns

### 🔐 **User Management**
- **Secure Authentication** system
- **User Registration** and login functionality
- **Profile Management** and customization
- **Progress Tracking** and achievements

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 19.2.0** - Latest React with concurrent features
- **React Router DOM 7.11.0** - Client-side routing
- **React Compiler** - Optimized performance with Babel plugin

### **Styling & UI**
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Framer Motion 12.23.26** - Advanced animations and transitions
- **Lucide React 0.562.0** - Beautiful icon library
- **Custom UI Components** - Reusable component library

### **Development Tools**
- **Vite 7.2.4** - Lightning-fast build tool
- **ESLint 9.39.1** - Code linting and quality
- **TypeScript Support** - Type-safe development
- **Hot Module Replacement** - Instant development feedback

### **Additional Libraries**
- **React Toastify 11.0.5** - Elegant notifications
- **Motion 12.23.26** - Enhanced animation capabilities
- **Path Resolution** - Absolute imports with @ alias

## 📁 Project Structure

```
client/
├── 📁 public/                    # Static assets and favicons
│   ├── android-chrome-*.png      # Android app icons
│   ├── apple-touch-icon.png      # iOS app icon
│   └── favicon.ico               # Website favicon
├── 📁 src/
│   ├── 📁 assets/                # Images and media files
│   │   └── logo.jpeg             # Application logo
│   ├── 📁 Auth/                  # Authentication components
│   │   ├── Login.jsx             # User login form
│   │   └── Registration.jsx      # User registration form
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 lib/               # Utility functions
│   │   ├── 📁 ui/                # UI component library
│   │   ├── Footer.jsx            # Application footer
│   │   └── Navbar.jsx            # Navigation header
│   ├── 📁 layouts/               # Page layout components
│   │   └── MainLayout.jsx        # Main application layout
│   ├── 📁 Main/                  # Core application pages
│   │   ├── 📁 AboutPage/         # About us page components
│   │   ├── 📁 ContactPage/       # Contact page components
│   │   ├── 📁 CoursePage/        # Course detail components
│   │   └── 📁 Mainpages/         # Homepage components
│   ├── 📁 routes/                # Application routing
│   │   ├── AboutRoutes.jsx       # About page routes
│   │   ├── AuthRoutes.jsx        # Authentication routes
│   │   ├── ContactRoutes.jsx     # Contact page routes
│   │   ├── CourseRoutes.jsx      # Course page routes
│   │   └── MainRoutes.jsx        # Main application routes
│   ├── App.jsx                   # Root application component
│   ├── App.css                   # Global styles
│   └── main.jsx                  # Application entry point
├── 📁 data/                      # Static data files
│   └── courses.json              # Course catalog data
├── .env                          # Environment variables
├── components.json               # Shadcn/ui configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.js                # Vite build configuration
└── vercel.json                   # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MDAI/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   ```env
   VITE_LOGO_URL=your_logo_url
   VITE_MdaiVideo_URL=your_video_url
   VITE_MDAIVIDEO_THUMB_URL=your_thumbnail_url
   VITE_FSD_URL=your_fsd_video_url
   VITE_FSD_THUMB_URL=your_fsd_thumbnail_url
   VITE_PROFESSOR_WHATSAPP=professor_whatsapp_number
   VITE_PROFESSOR_LINKEDIN=professor_linkedin_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🎯 Core Features Overview

### 📚 **Course Catalog**
- **20 Comprehensive Courses** across multiple domains
- **Skill Levels**: Beginner to Advanced
- **Duration**: 6-16 weeks per course
- **Pricing**: $79-$179 per course
- **Student Base**: 30,000+ enrolled students

### 🏗️ **Application Architecture**
- **Component-Based Architecture** with React
- **Route-Based Code Splitting** for optimal performance
- **Responsive Design** for mobile and desktop
- **SEO Optimized** with proper meta tags
- **PWA Ready** with service worker support

### 🎨 **Design System**
- **Consistent UI Components** with Shadcn/ui
- **Modern Color Palette** with CSS variables
- **Typography Scale** for readable content
- **Animation Library** with Framer Motion
- **Icon System** with Lucide React

## 🌐 Deployment

### **Vercel Deployment** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### **Manual Build**
```bash
# Create production build
npm run build

# Serve static files from dist/ directory
```

## 🔧 Configuration

### **Vite Configuration**
- **React Plugin** with React Compiler support
- **Tailwind CSS** integration
- **Path Aliases** for clean imports
- **Hot Module Replacement** enabled

### **Tailwind Configuration**
- **Shadcn/ui** integration
- **Custom CSS Variables** for theming
- **Responsive Breakpoints** configured
- **Component Library** support

### **TypeScript Support**
- **Type Checking** enabled
- **Path Mapping** configured
- **React Types** included
- **Development Experience** enhanced

## 🤝 Contributing

We welcome contributions to improve MDAI! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **WhatsApp**: [+91 9635825787](https://wa.me/919635825787)
- **LinkedIn**: [Professor Profile](https://www.linkedin.com/in/symphorien-pyana/)
- **Website**: [MDAI Platform](https://www.mdai.com)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for beautiful animations
- **Cloudinary** for media management
- **Vercel** for seamless deployment

---

<div align="center">
  <p>Built with ❤️ by the MDAI Team</p>
  <p>© 2026 MDAI. All rights reserved.</p>
</div>