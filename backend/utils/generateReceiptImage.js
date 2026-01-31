import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";

export const generateReceiptImage = async (enrollment) => {
    const width = 800;
    const height = 900;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    /* ================= BACKGROUND ================= */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    /* ================= BORDER ================= */
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    /* ================= HEADER ================= */
    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAYMENT RECEIPT", width / 2, 80);

    ctx.fillStyle = "#64748b";
    ctx.font = "16px Arial";
    ctx.fillText("MD AI Institute", width / 2, 110);

    ctx.textAlign = "left";

    /* ================= SEPARATOR ================= */
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 140);
    ctx.lineTo(width - 50, 140);
    ctx.stroke();

    /* ================= RECEIPT INFO ================= */
    ctx.fillStyle = "#000";
    ctx.font = "bold 18px Arial";
    ctx.fillText(`Receipt No: ${enrollment.receipt.receiptNumber}`, 50, 170);

    ctx.font = "16px Arial";
    ctx.fillText(
        `Date: ${new Date(
            enrollment.receipt.issuedAt || enrollment.verifiedAt
        ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })}`,
        50,
        200
    );

    /* ================= STUDENT INFO ================= */
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(50, 230, width - 100, 40);
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px Arial";
    ctx.fillText("STUDENT INFORMATION", 60, 257);

    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`Name: ${enrollment.student?.fullName || "N/A"}`, 50, 300);
    ctx.fillText(`Email: ${enrollment.student?.email || "N/A"}`, 50, 330);

    /* ================= COURSE INFO ================= */
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(50, 370, width - 100, 40);
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px Arial";
    ctx.fillText("COURSE DETAILS", 60, 397);

    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`Course: ${enrollment.course?.title || "N/A"}`, 50, 440);

    /* ================= PAYMENT INFO ================= */
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(50, 480, width - 100, 40);
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px Arial";
    ctx.fillText("PAYMENT INFORMATION", 60, 507);

    const amount =
        enrollment.amount ||
        enrollment.course?.price ||
        enrollment.course?.fees ||
        0;

    const formattedAmount = `$${Number(amount).toLocaleString("en-US")}`;

    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`Status: PAID`, 50, 550);
    ctx.fillText(`Amount: ${formattedAmount}`, 50, 580);
    ctx.fillText(`Verified By: Admin`, 50, 610);

    /* ================= FOOTER ================= */
    ctx.fillStyle = "#94a3b8";
    ctx.font = "italic 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        "This is a system-generated receipt. No signature required.",
        width / 2,
        700
    );
    ctx.fillText("© MD AI Institute", width / 2, 730);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "10px Arial";
    ctx.fillText(`Generated on: ${new Date().toISOString()}`, width / 2, 800);

    /* ================= SAVE FILE ================= */
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
