# TODO: Fix Question Paper 404 Error

## Task
Fix the 404 error when downloading question paper: `GET /api/exams/:id/question-paper` returns 404 "Question paper not found"

## Root Cause
The original code was:
1. Not uploading files to Cloudinary - only saving metadata
2. Using `req.file.path` which is empty (multer uses memory storage)
3. The `downloadQuestionPaper` checked for `data` field that didn't exist

## Solution Implemented

### 1. Upload Function - Now uses Cloudinary
- Uploads the PDF file to Cloudinary
- Stores the Cloudinary URL in the database
- Other metadata (filename, originalName, contentType, size) is also saved

### 2. Download Function - Redirects to Cloudinary URL
- If URL exists, redirects directly to Cloudinary
- If only filename exists (old data without URL), shows helpful error message

### 3. Model - Added `data` field as fallback
- Added `data: { type: Buffer, default: null }` for future use

## Files Modified
1. **backend/models/examModel.js** - Added `data` field
2. **backend/controllers/exam.controller.js** - Updated upload and download functions

## Important Notes
- **Existing question papers** (uploaded before this fix): Will need to be re-uploaded by teachers because the old code didn't save the actual file anywhere
- **New question papers**: Will work correctly after deploying the fix

## How to Test
1. Deploy the updated backend
2. Have a teacher create a new exam OR edit an existing one
3. Upload a new question paper PDF
4. Student should be able to download the question paper successfully

