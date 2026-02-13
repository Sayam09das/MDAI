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

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
});

// Exam-specific upload with PDF only and smaller limit
const examUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for exam file uploads
});

export default upload;
export { examUpload };
