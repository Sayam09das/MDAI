import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";

export const generateReceiptImage = async (enrollment) => {
    const width = 800;
    const height = 1000;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#000";
    ctx.font = "28px Arial";
    ctx.fillText("PAYMENT RECEIPT", 260, 60);

    ctx.font = "18px Arial";
    ctx.fillText(`Receipt No: ${enrollment.receipt.receiptNumber}`, 50, 130);
    ctx.fillText(`Date: ${new Date(enrollment.verifiedAt).toDateString()}`, 50, 170);

    ctx.fillText(`Student Name: ${enrollment.student.fullName}`, 50, 230);
    ctx.fillText(`Course: ${enrollment.course.title}`, 50, 270);
    ctx.fillText(`Payment Status: PAID`, 50, 310);

    ctx.font = "16px Arial";
    ctx.fillText(
        "This is a system-generated receipt. No signature required.",
        50,
        380
    );

    const uploadsDir = path.join(process.cwd(), "uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(
        uploadsDir,
        `receipt-${enrollment.receipt.receiptNumber}.png`
    );

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    return filePath;
};
