import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a receipt image using canvas
 * This function creates a simple receipt image with enrollment details
 * 
 * @param {Object} enrollment - The enrollment object with populated student and course data
 * @param {string} imagePath - The path where the image should be saved
 * @returns {Promise<string>} - The path to the generated image
 */
export const generateReceiptImage = async (enrollment) => {
    try {
        // Dynamic import canvas for ESM compatibility
        const { createCanvas, loadImage, registerFont } = await import('canvas');
        
        // Canvas dimensions
        const width = 600;
        const height = 800;
        
        // Create canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Border
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        
        // Header background
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(20, 20, width - 40, 80);
        
        // Header text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAYMENT RECEIPT', width / 2, 70);
        
        // Receipt number
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`Receipt #: ${enrollment.receipt?.receiptNumber || 'N/A'}`, width / 2, 140);
        
        // Date
        const date = new Date(enrollment.receipt?.issuedAt || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        ctx.font = '16px Arial';
        ctx.fillText(`Date: ${date}`, width / 2, 170);
        
        // Separator line
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 200);
        ctx.lineTo(width - 40, 200);
        ctx.stroke();
        
        // Student details section
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Student Details', 50, 240);
        
        ctx.fillStyle = '#374151';
        ctx.font = '16px Arial';
        ctx.fillText(`Name: ${enrollment.student?.fullName || 'N/A'}`, 50, 280);
        ctx.fillText(`Email: ${enrollment.student?.email || 'N/A'}`, 50, 310);
        
        // Course details section
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Course Details', 50, 370);
        
        ctx.fillStyle = '#374151';
        ctx.font = '16px Arial';
        ctx.fillText(`Course: ${enrollment.course?.title || 'N/A'}`, 50, 410);
        ctx.fillText(`Price: ₹${enrollment.course?.price || 0}`, 50, 440);
        
        // Payment details section
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Payment Details', 50, 500);
        
        ctx.fillStyle = '#374151';
        ctx.font = '16px Arial';
        ctx.fillText(`Payment Status: ${enrollment.paymentStatus || 'N/A'}`, 50, 540);
        ctx.fillText(`Payment Method: Online`, 50, 570);
        
        // Amount section
        const amount = enrollment.amount || enrollment.course?.price || 0;
        const adminAmount = enrollment.adminAmount || 0;
        const teacherAmount = enrollment.teacherAmount || 0;
        
        // Total amount box
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(50, 620, width - 100, 80);
        
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Total Amount Paid: ₹${amount}`, width / 2, 660);
        
        // Footer
        ctx.fillStyle = '#9ca3af';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Thank you for your purchase!', width / 2, 720);
        ctx.fillText('This is an auto-generated receipt.', width / 2, 745);
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `receipt_${enrollment._id}_${timestamp}.png`;
        const uploadDir = path.join(__dirname, '..', '..', '..', 'temp_receipts');
        
        // Create temp directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, filename);
        
        // Save image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
        
        console.log(`Receipt image generated at: ${filePath}`);
        
        return filePath;
    } catch (error) {
        console.error('Error generating receipt image:', error);
        
        // Fallback: create a simple text-based receipt as a last resort
        return createSimpleTextReceipt(enrollment);
    }
};

/**
 * Create a simple text-based receipt as fallback
 * @param {Object} enrollment - The enrollment object
 * @returns {string} - Path to the created text file
 */
const createSimpleTextReceipt = (enrollment) => {
    try {
        const timestamp = Date.now();
        const filename = `receipt_${enrollment._id}_${timestamp}.txt`;
        const uploadDir = path.join(__dirname, '..', '..', '..', 'temp_receipts');
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, filename);
        
        const receiptContent = `
================================
       PAYMENT RECEIPT
================================
Receipt #: ${enrollment.receipt?.receiptNumber || 'N/A'}
Date: ${new Date(enrollment.receipt?.issuedAt || Date.now()).toLocaleDateString()}

Student Details
---------------
Name: ${enrollment.student?.fullName || 'N/A'}
Email: ${enrollment.student?.email || 'N/A'}

Course Details
--------------
Course: ${enrollment.course?.title || 'N/A'}
Price: ₹${enrollment.course?.price || 0}

Payment Details
---------------
Status: ${enrollment.paymentStatus || 'N/A'}
Method: Online

Total Amount: ₹${enrollment.amount || enrollment.course?.price || 0}

================================
Thank you for your purchase!
================================
`;
        
        fs.writeFileSync(filePath, receiptContent);
        console.log(`Simple receipt created at: ${filePath}`);
        
        return filePath;
    } catch (error) {
        console.error('Error creating simple receipt:', error);
        throw error;
    }
};

export default generateReceiptImage;

