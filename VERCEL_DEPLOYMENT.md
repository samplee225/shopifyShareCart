# Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

## Steps to Deploy

### 1. Setup MongoDB Atlas
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add it to environment variables

### 2. Create vercel.json
```json
{
  "buildCommand": "npm install",
  "outputDirectory": ".",
  "framework": "express",
  "env": {
    "MONGODB_URI": "@mongodb_uri"
  }
}
```

### 3. Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### 4. Add Environment Variables in Vercel Dashboard
- Go to Project Settings > Environment Variables
- Add `MONGODB_URI` with your MongoDB connection string

## Important Notes
- The status page uses MongoDB to persist metrics (works on Vercel)
- Metrics are automatically cleaned up after 7 days
- API endpoint: `/api/status` (returns JSON)
- Status page: `/status` (requires view rendering)

## For Serverless:
- Use the `/api/status` endpoint instead of `/status`
- Metrics persist across requests via MongoDB
- Each request updates the metrics
