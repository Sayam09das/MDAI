# CORS Error Fix Plan

## Understanding the Error

```
Access to XMLHttpRequest at 'http://localhost:5000/api/teacher/finance/stats' 
from origin 'https://mdai-self.vercel.app' has been blocked by CORS policy
```

### Root Cause
- **Frontend**: Deployed at `https://mdai-self.vercel.app` (Vercel)
- **Backend**: Running locally at `http://localhost:5000`
- **Problem**: Browsers block cross-origin requests from Vercel to localhost

The frontend code (`financeApi.js`) has:
```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

When deployed to Vercel without `VITE_API_URL`, it defaults to `http://localhost:5000/api` which is **inaccessible** from Vercel's servers.

## Solution Plan

### Step 1: Improve CORS Configuration (Done ✅)
The backend already has CORS configured to allow `https://mdai-self.vercel.app`, but localhost can't be reached from Vercel.

### Step 2: Deploy Backend to Vercel (Recommended)
Deploy the backend to Vercel as a separate project.

### Step 3: Configure Environment Variables
Add `VITE_API_URL` in Vercel frontend settings.

## Immediate Actions for Testing

### Option A: Run Both Locally
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend (Vite)
cd client && npm run dev
```

### Option B: Deploy Backend to Vercel
1. Create a new Vercel project for the backend
2. Add environment variable in frontend Vercel project:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.vercel.app/api`

## Files to Modify
1. `client/.env` - Add `VITE_API_URL` for production
2. `backend/app.js` - Already configured ✅

## Status: Ready for Implementation

