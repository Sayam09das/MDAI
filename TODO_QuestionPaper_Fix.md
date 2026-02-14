# TODO: Fix Question Paper 404 Error

## Task
Fix the 404 error when downloading question paper: `GET /api/exams/:id/question-paper` returns 404 "Question paper not found"

## Root Cause
The `downloadQuestionPaper` controller checks for `exam.questionPaper.data` which doesn't exist in the model. The model only has:
- `filename`
- `originalName`
- `contentType`
- `size`
- `url`
- `uploadedAt`

## Steps to Fix

### 1. Update exam.controller.js - downloadQuestionPaper function
- [x] Check for `exam.questionPaper.url` first and fetch the file (for Cloudinary)
- [x] Check for `exam.questionPaper.filename` (for legacy files with data in DB)
- [x] Return appropriate error messages for each case

### 2. Update exam.controller.js - uploadQuestionPaper function  
- [x] Ensure URL is properly saved when uploading (already working)

## Implementation Status
✅ FIXED - The `downloadQuestionPaper` function in `backend/controllers/exam.controller.js` has been updated to:
1. First check if there's a URL (Cloudinary) and fetch the file from there
2. If no URL, check if there's a filename with binary data in the model
3. Return appropriate error messages for each case

## Changes Made
- Modified: `backend/controllers/exam.controller.js` - Updated `downloadQuestionPaper` function

