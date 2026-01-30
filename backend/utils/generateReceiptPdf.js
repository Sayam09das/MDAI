import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateReceiptPdf = async (enrollment) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const fileName = `receipt-${enrollment.receipt.receiptNumber}.pdf`;
    const filePath = path.join("uploads", fileName);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Payment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Receipt No: ${enrollment.receipt.receiptNumber}`);
    doc.text(`Student: ${enrollment.student.fullName}`);
    doc.text(`Email: ${enrollment.student.email}`);
    doc.text(`Course: ${enrollment.course.title}`);
    doc.text(`Amount Paid: ₹${enrollment.amount || "N/A"}`);
    doc.text(`Payment Date: ${new Date(enrollment.verifiedAt).toDateString()}`);

    doc.moveDown();
    doc.text("Status: PAID", { bold: true });

    doc.moveDown(2);
    doc.text("Authorized by Admin", { align: "right" });

    doc.end();

    return filePath;
};
