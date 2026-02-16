# Certificate Format Change: PDF to Image

## Task: Change certificate generation from PDF to PNG image format

### Steps:
- [x] 1. Update `backend/controllers/certificate.controller.js` - Change generateCertificate function to use canvas for PNG generation
- [x] 2. Update `backend/utils/certificateUtils.js` - Ensure image format consistency  
- [x] 3. Update client-side download button to use .png extension
- [ ] 4. Test the changes

### Files edited:
1. backend/controllers/certificate.controller.js
2. backend/utils/certificateUtils.js
3. client/src/Pages/Student/Dashboard/MyCertificates/MyCertificates.jsx

### Summary of changes:
- Replaced PDFKit with canvas library for certificate generation
- Changed certificate format from PDF to PNG
- Updated Cloudinary upload to use resource_type: "image" and format: "png"
- Updated client-side download button to use .png extension

