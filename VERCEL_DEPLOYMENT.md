# Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- GitHub repository (push your code)

## Step 1: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (Free tier)
4. Go to **Database Access** → Create a database user
   - Username: `your-username`
   - Password: `your-strong-password`
5. Go to **Network Access** → Add IP Address
   - Click "Add Current IP Address" or "Allow Access from Anywhere" (0.0.0.0/0)
6. Go to **Databases** → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<databasename>` with your values

Example connection string:
```
mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/shopifyCartShare?retryWrites=true&w=majority
```

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Add status page with MongoDB metrics"
git push origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Framework Preset: **Other**
5. Root Directory: `./`
6. Environment Variables:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://youruser:yourpassword@cluster.mongodb.net/shopifyCartShare...`
7. Click "Deploy"

### Option B: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted:
- Set `MONGODB_URI` to your MongoDB connection string

## Step 4: Verify Deployment

After deployment:

1. **View Status Page:**
   - Visit: `https://your-project.vercel.app/status`
   - Should display the status dashboard with metrics

2. **Check API Endpoint:**
   - Visit: `https://your-project.vercel.app/api/status`
   - Should return JSON with server metrics

3. **View Logs:**
   - Go to Vercel Dashboard
   - Select your project
   - Click "Deployments"
   - Click on the latest deployment
   - View logs to troubleshoot

## Troubleshooting

### Status page shows "Loading..." forever
- **Issue:** MongoDB connection failed
- **Fix:** Check `MONGODB_URI` in Vercel Environment Variables
- **Check:** Go to Vercel Logs and look for MongoDB connection errors

### 404 Not Found errors
- **Issue:** Routes not configured correctly
- **Fix:** Verify `vercel.json` is in project root
- **Clear:** Redeploy the project

### Metrics not persisting
- **Issue:** MongoDB write permissions
- **Fix:** Check MongoDB Network Access allows Vercel IPs
- **Solution:** Add `0.0.0.0/0` to Network Access in MongoDB Atlas

### API endpoint works but page doesn't load
- **Issue:** EJS view engine issue on serverless
- **Fix:** Use the API endpoint `/api/status` instead
- **Alternative:** Frontend can fetch `/api/status` and render custom UI

## File Structure

```
shopifyCartShare/
├── index.js                    # Main server
├── vercel.json                 # Vercel config
├── .env.example                # Environment template
├── package.json
├── api/
│   └── status.js              # Serverless status endpoint
├── services/
│   ├── connection.js          # MongoDB connection
│   ├── vercelMonitoring.js    # Vercel-compatible monitoring
│   └── monitoring.js          # Local monitoring
├── model/
│   └── MetricsModel.js        # MongoDB metrics schema
└── view/
    └── status.ejs             # Status page UI
```

## How It Works

1. **Request Tracking:** Every API request updates metrics
2. **Database Persistence:** Metrics saved to MongoDB every ~10 requests
3. **Status API:** `/api/status` returns real-time metrics from DB + in-memory
4. **Status Page:** `/status` displays metrics in beautiful UI
5. **Auto Cleanup:** Old metrics deleted after 7 days automatically

## Next Steps

- Monitor your app in Vercel Dashboard
- Check MongoDB Atlas for stored metrics
- Customize the status page UI in `view/status.ejs`
- Add more monitoring metrics as needed

## Support
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Express Guide: https://expressjs.com/
