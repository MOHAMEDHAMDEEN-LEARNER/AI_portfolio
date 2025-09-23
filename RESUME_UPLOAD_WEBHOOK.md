# Resume Upload and Webhook Integration

## Overview
The upload-resume page now has full functionality to:
1. Upload PDF/DOC files to Supabase storage
2. Send the uploaded file to an AI processing webhook when "Continue to Portfolio Builder" is clicked

## Setup Required

### 1. Supabase Storage Setup
Run the following SQL script in your Supabase SQL Editor:
```sql
-- See: supabase/storage_setup.sql
```

This will create:
- A `resumes` storage bucket
- RLS policies for secure file access

### 2. Webhook Integration
The system now sends uploaded resumes to:
```
https://glowing-amusing-stinkbug.ngrok-free.app/webhook/ai-portfolio
```

The webhook receives:
- `file`: The uploaded PDF/DOC file
- `userId`: User's Supabase ID
- `userEmail`: User's email
- `template`: Selected portfolio template
- `linkedinUrl`: LinkedIn profile URL
- `githubUrl`: GitHub profile URL
- `additionalInfo`: Additional user information

## Features Added

### File Upload
- Real file upload to Supabase storage (not just simulation)
- File validation (PDF, DOC, DOCX only)
- Unique file naming with user ID and timestamp
- Error handling for upload failures

### Webhook Integration
- Sends file as FormData to the AI processing endpoint
- Includes all user context and form data
- Graceful error handling - continues even if webhook fails
- Loading states during webhook processing

### User Experience
- Upload progress indication
- Success/error feedback
- Option to replace uploaded file
- Seamless integration with existing workflow

## File Structure Changes
- Modified: `app/upload-resume/page.tsx`
- Added: `supabase/storage_setup.sql`
- Added: `RESUME_UPLOAD_WEBHOOK.md` (this file)

## Next Steps
1. Run the storage setup SQL in Supabase
2. Test file upload functionality
3. Verify webhook receives files correctly
4. Monitor webhook response and handle any errors