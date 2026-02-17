import multer from "multer";

const storage = multer.memoryStorage();

// Filter to allow only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed!"), false);
    }
};

// Filter to allow images (for course thumbnails) and videos
const courseFileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, WebP, GIF images and MP4, WebM videos are allowed!"), false);
    }
};

// Filter to allow only image files (for certificate backgrounds)
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, and WebP images are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
});

// Image upload specifically for certificate backgrounds (smaller limit)
const imageUpload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for images
});

// Course upload - allows images (thumbnails) and videos
const courseUpload = multer({
    storage,
    fileFilter: courseFileFilter,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for course content (videos)
});

// Exam-specific upload with PDF only and smaller limit
const examUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for exam file uploads
});

export default upload;
export { examUpload, imageUpload, courseUpload };
