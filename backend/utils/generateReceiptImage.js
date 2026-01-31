import { createCanvas, registerFont } from "canvas";
import fs from "fs";
import path from "path";

/**
 * Generates a professional, production-ready payment receipt image
 * @param {Object} enrollment - Enrollment data containing student, course, and payment info
 * @returns {Promise<string>} - Path to the generated receipt image
 */
export const generateReceiptImage = async (enrollment) => {
    const width = 900;
    const height = 1100;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Enable high-quality rendering
    ctx.quality = "best";
    ctx.patternQuality = "best";
    ctx.antialias = "subpixel";

    /* ================= BACKGROUND WITH GRADIENT ================= */
    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Subtle background pattern
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, 200);

    /* ================= MAIN BORDER ================= */
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Inner decorative border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    /* ================= HEADER SECTION ================= */
    // Company/Institute Name
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MD AI INSTITUTE", width / 2, 100);

    // Tagline
    ctx.fillStyle = "#64748b";
    ctx.font = "italic 18px Arial";
    ctx.fillText("Excellence in Education", width / 2, 130);

    // Receipt Title
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 36px Arial";
    ctx.fillText("PAYMENT RECEIPT", width / 2, 190);

    /* ================= TOP SEPARATOR ================= */
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 220);
    ctx.lineTo(width - 60, 220);
    ctx.stroke();

    /* ================= RECEIPT METADATA ================= */
    const leftMargin = 80;
    const rightMargin = width - 80;
    let currentY = 270;

    // Receipt Number (Highlighted)
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(60, 240, width - 120, 50);
    
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Receipt No: ${enrollment.receipt.receiptNumber}`, leftMargin, 270);

    // Issue Date
    ctx.fillStyle = "#475569";
    ctx.font = "16px Arial";
    ctx.textAlign = "right";
    ctx.fillText(
        `Issue Date: ${new Date(
            enrollment.receipt.issuedAt || enrollment.verifiedAt
        ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })}`,
        rightMargin,
        270
    );

    currentY = 320;

    /* ================= STUDENT INFORMATION SECTION ================= */
    // Section Header
    drawSectionHeader(ctx, "STUDENT INFORMATION", leftMargin - 20, currentY, width - 120);
    currentY += 60;

    // Student Details
    ctx.fillStyle = "#0f172a";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    
    const studentName = enrollment.student?.fullName || "N/A";
    const studentEmail = enrollment.student?.email || "N/A";
    const studentPhone = enrollment.student?.phone || "N/A";

    drawInfoRow(ctx, "Full Name:", studentName, leftMargin, currentY);
    currentY += 35;
    drawInfoRow(ctx, "Email Address:", studentEmail, leftMargin, currentY);
    currentY += 35;
    if (studentPhone !== "N/A") {
        drawInfoRow(ctx, "Phone Number:", studentPhone, leftMargin, currentY);
        currentY += 35;
    }

    currentY += 20;

    /* ================= COURSE DETAILS SECTION ================= */
    drawSectionHeader(ctx, "COURSE DETAILS", leftMargin - 20, currentY, width - 120);
    currentY += 60;

    const courseTitle = enrollment.course?.title || "N/A";
    const courseCode = enrollment.course?.code || "N/A";
    const courseDuration = enrollment.course?.duration || "N/A";

    drawInfoRow(ctx, "Course Name:", courseTitle, leftMargin, currentY);
    currentY += 35;
    if (courseCode !== "N/A") {
        drawInfoRow(ctx, "Course Code:", courseCode, leftMargin, currentY);
        currentY += 35;
    }
    if (courseDuration !== "N/A") {
        drawInfoRow(ctx, "Duration:", courseDuration, leftMargin, currentY);
        currentY += 35;
    }

    currentY += 20;

    /* ================= PAYMENT DETAILS SECTION ================= */
    drawSectionHeader(ctx, "PAYMENT DETAILS", leftMargin - 20, currentY, width - 120);
    currentY += 60;

    const amount = enrollment.amount || enrollment.course?.price || enrollment.course?.fees || 0;
    const formattedAmount = `₹${Number(amount).toLocaleString("en-IN")}`;

    // Payment Status Badge
    ctx.fillStyle = "#dcfce7";
    ctx.fillRect(leftMargin, currentY - 25, 120, 40);
    ctx.fillStyle = "#166534";
    ctx.font = "bold 18px Arial";
    ctx.fillText("PAID", leftMargin + 35, currentY);
    
    currentY += 40;

    drawInfoRow(ctx, "Amount Paid:", formattedAmount, leftMargin, currentY);
    currentY += 35;
    drawInfoRow(ctx, "Payment Method:", "Online Transfer", leftMargin, currentY);
    currentY += 35;
    
    const verifiedDate = new Date(enrollment.verifiedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    drawInfoRow(ctx, "Verified On:", verifiedDate, leftMargin, currentY);
    currentY += 35;
    drawInfoRow(ctx, "Verified By:", "Admin", leftMargin, currentY);
    currentY += 35;

    /* ================= AMOUNT SUMMARY BOX ================= */
    currentY += 30;
    
    // Total Amount Box
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(60, currentY, width - 120, 80);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("TOTAL AMOUNT PAID", leftMargin, currentY + 30);
    
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "right";
    ctx.fillText(formattedAmount, rightMargin, currentY + 55);

    currentY += 110;

    /* ================= THANK YOU MESSAGE ================= */
    ctx.fillStyle = "#059669";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("✓ Payment Successful", width / 2, currentY);
    
    currentY += 40;
    ctx.fillStyle = "#475569";
    ctx.font = "16px Arial";
    ctx.fillText("Thank you for your enrollment!", width / 2, currentY);

    /* ================= FOOTER SECTION ================= */
    currentY = height - 180;

    // Separator line
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, currentY);
    ctx.lineTo(width - 60, currentY);
    ctx.stroke();

    currentY += 30;

    // Footer text
    ctx.fillStyle = "#64748b";
    ctx.font = "italic 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("This is a computer-generated receipt and does not require a physical signature.", width / 2, currentY);
    
    currentY += 25;
    ctx.fillText("For any queries, please contact: support@mdaiinstitute.com", width / 2, currentY);
    
    currentY += 40;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px Arial";
    ctx.fillText("© 2024 MD AI Institute. All rights reserved.", width / 2, currentY);
    
    currentY += 30;
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "10px Arial";
    ctx.fillText(`Generated on: ${new Date().toLocaleString("en-IN")}`, width / 2, currentY);

    /* ================= WATERMARK ================= */
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 120px Arial";
    ctx.textAlign = "center";
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-45 * Math.PI / 180);
    ctx.fillText("PAID", 0, 0);
    ctx.restore();

    /* ================= SAVE FILE ================= */
    const uploadsDir = path.join(process.cwd(), "uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(
        uploadsDir,
        `receipt-${enrollment.receipt.receiptNumber}.png`
    );

    const buffer = canvas.toBuffer("image/png", { compressionLevel: 9, filters: canvas.PNG_FILTER_NONE });
    fs.writeFileSync(filePath, buffer);

    console.log(`✓ Receipt generated: ${filePath}`);
    return filePath;
};

/* ================= HELPER FUNCTIONS ================= */

/**
 * Draws a section header with background
 */
function drawSectionHeader(ctx, text, x, y, width) {
    ctx.fillStyle = "#334155";
    ctx.fillRect(x, y, width, 45);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    ctx.fillText(text, x + 20, y + 28);
}

/**
 * Draws an information row with label and value
 */
function drawInfoRow(ctx, label, value, x, y) {
    // Label
    ctx.fillStyle = "#64748b";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, x, y);
    
    // Value
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 16px Arial";
    ctx.fillText(value, x + 180, y);
}