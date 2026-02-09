# MDAI Client Application

**Student & Teacher Portal - Enterprise Frontend**

[![Production](https://img.shields.io/badge/Production-Live-brightgreen)](https://mdai-self.vercel.app)
[![React](https://img.shields.io/badge/React-19.x-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-purple)](https://vitejs.dev/)

---

## Overview

Production-ready React application serving as the primary interface for students and teachers in the MDAI Learning Management System.

### Key Features

- Student course discovery and enrollment
- Teacher course creation and management
- Real-time messaging with Socket.io
- Payment integration (Stripe, Razorpay)
- Progress tracking and analytics
- Resource management
- Event calendar
- Mobile-responsive design

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool |
| TailwindCSS | 4.1.18 | Styling |
| React Router | 7.11.0 | Routing |
| Axios | 1.13.4 | HTTP Client |
| Socket.io Client | 4.8.3 | Real-time Communication |
| Framer Motion | 12.23.26 | Animations |
| Chart.js | 4.5.1 | Data Visualization |
| React Toastify | 11.0.5 | Notifications |

---

## Project Structure

```
client/
├── src/
│   ├── Auth/                    # Authentication components
│   ├── components/              # Reusable components
│   │   ├── common/             # Shared components
│   │   ├── Dashboard/          # Dashboard components
│   │   └── ui/                 # UI primitives
│   ├── Pages/                   # Route pages
│   │   ├── Student/            # Student pages
│   │   └── teacher/            # Teacher pages
│   ├── context/                 # React Context
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # API clients
│   ├── routes/                  # Route definitions
│   ├── utils/                   # Utilities
│   └── Main/                    # Landing pages
├── public/                      # Static assets
└── package.json
```

---

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

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
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

---

## Available Scripts

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Features

### Student Portal

- Browse and search courses
- Enroll with payment processing
- Track learning progress
- Access course resources
- Real-time messaging
- Event calendar
- Profile management

### Teacher Dashboard

- Create and manage courses
- Upload course materials
- Track student enrollments
- View payment history
- Manage lessons and resources
- Schedule events
- Student analytics

---

## API Integration

```javascript
// lib/api/courseApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getCourses = async () => {
  const response = await axios.get(`${API_URL}/courses`);
  return response.data;
};

export const enrollCourse = async (courseId, paymentData) => {
  const response = await axios.post(`${API_URL}/enrollments`, {
    courseId,
    ...paymentData
  });
  return response.data;
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
  "framework": "vite"
}
```

---

## Performance

- Bundle size: ~245KB (gzipped)
- First paint: <1s
- Time to interactive: <2s
- Lighthouse score: 98/100

---

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/name`
5. Create Pull Request

---

## License

Copyright (c) 2026 MDAI. All rights reserved.

---

**Live Application**: [https://mdai-self.vercel.app](https://mdai-self.vercel.app)
