# 🔄 Complete Restart Instructions

## The Problem
Next.js cache was corrupted, causing module not found errors.

## ✅ Solution - Follow These Steps:

### Step 1: Stop Everything
Press `Ctrl+C` in ALL terminal windows running dev servers.

### Step 2: Kill Any Remaining Processes
```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
```

### Step 3: Clean Start
Run the clean start script:
```bash
./clean-start.sh
```

OR manually:
```bash
# Remove caches
rm -rf .next node_modules/.cache

# Regenerate Prisma
npx prisma generate

# Start server
npm run dev
```

## ✅ Verification

Once the server starts:

1. Go to: http://localhost:3000/login
2. Login with:
   - **Username**: `25mx301`
   - **Password**: `25mx301`
3. You should be redirected to `/dashboard`

## 🔍 If Login Still Doesn't Work:

Check the terminal logs for:
- Database connection errors
- Auth errors
- User lookup errors

The credentials ARE correct (verified ✅), so if login fails, check server logs.

## 📝 Login Credentials

All 63 users:
- Username: `25mx301` through `25mx363` (lowercase)
- Password: Same as username

Example:
- `25mx301` / `25mx301`
- `25mx354` / `25mx354`
- `25mx363` / `25mx363`
