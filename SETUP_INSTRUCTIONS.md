# 🚀 Quick Setup Guide - Fix Authentication Issues

## ⚠️ Important: Database Schema Setup Required

The "Failed to fetch" error and "No account found with this email address" message indicate that your database schema has not been deployed yet. Here's how to fix it:

### Step 1: Deploy Database Schema

1. **Open your Supabase Project Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project: `benrreylvuzwyjvmaszy`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Database Schema**
   - Copy the entire content from `supabase/schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the schema

### Step 2: Verify Database Setup

After running the schema, you should see these tables created:
- `user_profiles` - Stores user registration details
- `portfolio_generations` - Stores portfolio generation requests

### Step 3: Test Authentication

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Signup Flow**
   - Go to `/signup`
   - Fill in all registration details
   - Submit the form
   - Check console for debug messages

3. **Check Supabase Dashboard**
   - Go to "Authentication" > "Users" to see created accounts
   - Go to "Table Editor" > "user_profiles" to see profile data

### Step 4: Verify Email Configuration

If password reset isn't working:
1. Check `.env.local` has correct Gmail credentials
2. Make sure you're using Gmail App Password (not regular password)
3. Run: `npm install nodemailer @types/nodemailer`

## 🔧 Current Authentication Features

✅ **Enhanced Error Handling** - Better error messages and debugging
✅ **Connection Testing** - Automatic Supabase connection verification
✅ **Profile Creation** - Automatic user profile storage
✅ **Database Validation** - Login validates against database
✅ **Email OTP Reset** - Professional password reset via email
✅ **Graceful Fallbacks** - Works even if schema not deployed

## 🐛 Troubleshooting

### Error: "No account found with this email address"
- **Cause**: Database schema not deployed
- **Fix**: Run the schema.sql file in Supabase SQL Editor

### Error: "Failed to fetch"
- **Cause**: Network or Supabase connection issue
- **Fix**: Check internet connection and Supabase URL/keys

### Error: "Profile creation failed"
- **Cause**: Database tables don't exist
- **Fix**: Deploy database schema from `supabase/schema.sql`

### Console shows "Database schema not deployed"
- **Expected**: System works but with limited features
- **Fix**: Deploy schema for full functionality

## 📝 Next Steps

1. Deploy the database schema (most important!)
2. Test complete signup → login flow
3. Verify user profile data is stored
4. Test password reset functionality
5. Remove debug console.log statements for production

After deploying the schema, your authentication system will be fully functional with user data storage and database validation!