# Render Deployment Guide

This guide will help you deploy the Placement Portal to Render.

## Prerequisites

1. **MongoDB Atlas Account** - Free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Git Repository** - Push your code to GitHub, GitLab, or another Git provider

## Step-by-Step Deployment

### 1. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (shared)
3. Create a database user with a strong password
4. Get your connection string:
   - Click "Connect" → "Drivers" 
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/placement?retryWrites=true&w=majority`)
   - Replace `<username>`, `<password>`, and `placement` with your actual values

### 2. Prepare Your Repository

The following files have already been created for you:
- `.env.example` - Template for environment variables
- `.gitignore` - Prevents sensitive files from being committed
- `render.yaml` - Render deployment configuration
- `.env.production` - Production environment settings

### 3. Deploy to Render

1. **Connect your Git repository to Render:**
   - Go to [render.com](https://render.com) and log in
   - Click "New" → "Web Service"
   - Select your Git repository
   - Choose the branch to deploy (usually `main`)

2. **Configure the service:**
   - **Name:** `placement-portal` (or your choice)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Select based on your needs (Free tier available)

3. **Set Environment Variables:**
   - Click "Environment" on the service settings
   - Add the following variables:
     - `NODE_ENV`: `production`
     - `MONGO_URL`: Your MongoDB Atlas connection string (from Step 1)
   
   Example MONGO_URL:
   ```
   mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/PlacementPortal?retryWrites=true&w=majority
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for the deployment to complete (usually 2-5 minutes)

### 4. Verify Your Deployment

Once deployed:
1. Visit your app URL (provided by Render)
2. Test the student/company registration
3. Check MongoDB Atlas to confirm data is being stored

## Troubleshooting

### MongoDB Connection Issues
- Verify the connection string is correct (check username/password)
- Ensure MongoDB Atlas allows connections from Render (IP whitelist should include 0.0.0.0/0 for all IPs)
- Check the Render logs: Go to Service → Logs tab

### Port Issues
- Render automatically assigns a port; the app uses `process.env.PORT` which is correct

### Frontend Not Loading
- The frontend files are served from the `frontend/` directory
- Ensure all HTML files are present in the `frontend/` folder

## Common Deployment Variables

```
NODE_ENV=production
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/PlacementPortal?retryWrites=true&w=majority
PORT=<Render assigns this automatically>
```

## Database Backups

MongoDB Atlas free tier includes:
- 512 MB storage
- Automatic backups
- 14-day point-in-time restore

## Next Steps

- Enable HTTPS (automatic on Render)
- Set up custom domain (if needed)
- Monitor logs and metrics in Render dashboard
- Consider upgrading from free tier for production use

## Support

For Render-specific issues, check:
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Help](https://docs.atlas.mongodb.com/)
