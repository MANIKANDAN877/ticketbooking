# BusBook Platform - Complete Deployment Guide

## Problem: "Failed to load bus details" Error

Your Netlify frontend can't connect to a backend API. We need to deploy the backend first, then update the frontend.

## Solution: Deploy Backend + Frontend

### Step 1: Deploy Backend to Render.com

1. **Go to [render.com](https://render.com)**
2. **Sign up** for free account
3. **Click "New"** button
4. **Select "Web Service"**
5. **Connect GitHub** OR create new repository
6. **Configure settings:**
   - **Name**: `busbook-backend`
   - **Region**: Closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`

7. **Click "Advanced Settings"**
   - **Auto-Deploy**: `Yes`
   - **Health Check Path**: `/api/health`

8. **Click "Create Web Service"**

### Step 2: Get Backend URL

After deployment, your backend URL will be:
```
https://busbook-backend.onrender.com
```

### Step 3: Update Frontend API URL

1. **Edit file**: `d:/todolist/client/src/services/api.ts`
2. **Change line 4**:
   ```typescript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://busbook-backend.onrender.com/api';
   ```

### Step 4: Rebuild Frontend

```bash
cd d:/todolist/client
npm run build
```

### Step 5: Redeploy Frontend to Netlify

1. **Go to your Netlify site**
2. **Replace the build folder** with new build
3. **Set environment variable** in Netlify:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://busbook-backend.onrender.com/api`

### Step 6: Test Everything

1. **Open your Netlify site**
2. **Test search**: Should work
3. **Test seat selection**: Should now work!
4. **Test complete booking flow**

## Quick Fix (If You Want to Use Local Backend)

If you want to keep your local backend running:

1. **Keep local server running**:
   ```bash
   cd d:/todolist/server
   npm start
   ```

2. **Update Netlify environment variable**:
   - **REACT_APP_API_URL** = `http://YOUR_IP:5000/api`
   - Replace YOUR_IP with your actual IP address

## Alternative: Use Mock Data (Frontend Only)

If you want the frontend to work without any backend, I can add mock data.

## Expected Results

After deployment:
- Bus search: Working
- Seat selection: Working
- Passenger details: Working
- Booking confirmation: Working
- Mobile responsive: Working

## Support

If you need help:
1. Check Render.com logs for backend errors
2. Check Netlify logs for frontend errors
3. Verify API URL is correct
4. Test backend health: `https://your-backend-url.onrender.com/api/health`
