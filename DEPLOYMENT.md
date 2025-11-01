# 🚀 Vercel Deployment Guide

## Pre-Deployment Checklist

✅ Database schema pushed to Neon  
✅ Cloudinary configured  
✅ Environment variables documented  
✅ Build script optimized  

## Step 1: Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

### Database (Neon PostgreSQL)
```
DATABASE_URL=postgresql://neondb_owner:npg_0iWVrCHaMIG7@ep-sweet-math-ad0qm5us-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### NextAuth
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

### Google OAuth (Optional)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Cloudinary
```
CLOUDINARY_CLOUD_NAME=dekitmlm7
CLOUDINARY_API_KEY=532143793435188
CLOUDINARY_API_SECRET=e7xQn9aGZhlq40OJoy8t-UrYMxc
```

### Socket.io (if using separate server)
```
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
SOCKET_PORT=3001
```

## Step 2: Deploy to Vercel

### Option A: GitHub Integration
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Step 3: Post-Deployment

### Update NEXTAUTH_URL
After deployment, update `NEXTAUTH_URL` in Vercel environment variables to your production URL.

### Database Verification
1. Visit: `https://your-app.vercel.app/api/auth/providers`
2. Should return providers without errors
3. Test login with: `25mx301` / `25mx301`

### Cloudinary Setup
1. Verify images load correctly
2. Test avatar upload functionality
3. Check Cloudinary dashboard for uploads

## Build Configuration

The project is configured with:
- ✅ `postinstall` script to generate Prisma client
- ✅ Optimized build command
- ✅ Proper Next.js configuration

## Socket.io Note

The Socket.io server (`server.mjs`) runs separately. For production:
1. Deploy it separately (Railway, Render, etc.)
2. Update `NEXT_PUBLIC_SOCKET_URL` in Vercel
3. Or use Pusher/other service for production

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify `DATABASE_URL` is correct
- Check Prisma client generation

### Login Doesn't Work
- Verify `NEXTAUTH_URL` matches production URL
- Check `NEXTAUTH_SECRET` is set
- Review server logs in Vercel dashboard

### Images Not Loading
- Verify Cloudinary credentials
- Check `remotePatterns` in `next.config.js`
- Test Cloudinary connection

## Environment Variables Template

Create `.env.production` locally with your values (never commit this):
```env
DATABASE_URL=your-neon-url
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Success Indicators

✅ Build completes without errors  
✅ Homepage loads  
✅ Login page accessible  
✅ Can login with `25mx301`  
✅ Dashboard loads  
✅ Images display correctly  

🎉 Deployment successful!

